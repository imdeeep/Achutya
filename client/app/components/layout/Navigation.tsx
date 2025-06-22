import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { destinationApi } from "~/services/userApi";
import {
  Search,
  Calendar,
  MapPin,
  ArrowRight,
  Menu,
  X,
  Phone,
  ChevronDown,
  User,
} from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "~/hooks/auth";

type DropdownContentType = {
  "International Trips": string[];
  "India Trips": string[];
  "Weekend Trips": string[];
  "Group Tours": string[];
};

interface SearchResult {
  _id?: string;
  id?: string;
  type: "destination" | "tour";
  displayName: string;
  location: string;
  image: string;
  duration?: string;
  price?: number;
}

const Navigation = () => {
  const { user, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [searchData, setSearchData] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null)

  const dropdownContent: DropdownContentType = {
    "International Trips": ["Thailand", "Switzerland", "Bali", "Dubai"],
    "India Trips": ["Goa", "Kerala", "Rajasthan", "Himachal"],
    "Weekend Trips": ["Lonavala", "Alibaug", "Pune", "Matheran"],
    "Group Tours": ["Andaman", "Kashmir", "Sikkim", "Coorg"],
  };

  const createSlug = (destination: string) => {
    return destination.toLowerCase().replace(/\s+/g, "-");
  };

  const handleSearch = async (query: string): Promise<void> => {
    if (!query.trim()) {
      setSearchData([]);
      setShowResults(false);
      setIsLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError("");

    try {
      const response = await destinationApi.searchBoth(query);
      const combinedResults: SearchResult[] = [];

      if (response.data.destinations?.results) {
        response.data.destinations.results.slice(0, 3).forEach((dest) => {
          combinedResults.push({
            ...dest,
            type: "destination",
            displayName: dest.name,
            location: `${dest.countryName || dest.country}`,
            image: dest.image || dest.heroImage || "",
          } as SearchResult);
        });
      }

      if (response.data.tours?.results) {
        response.data.tours.results.slice(0, 3).forEach((tour) => {
          combinedResults.push({
            _id: tour._id,
            id: tour._id,
            type: "tour",
            displayName: tour.title,
            location: `${tour.location || tour.city || ""}`,
            image: tour.image || tour.heroImage || "",
            duration: tour.duration,
            price: tour.price,
          } as SearchResult);
        });
      }

      setSearchData(combinedResults);
      setShowResults(combinedResults.length > 0);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name !== "AbortError"
      ) {
        console.error("Search error:", error);
        setError("Search failed");
        setSearchData([]);
        setShowResults(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim()) {
      setIsLoading(true);
      debounceRef.current = setTimeout(() => {
        handleSearch(value);
      }, 200);
    } else {
      setShowResults(false);
      setSearchData([]);
      setIsLoading(false);
    }
  };

  const handleSearchClick = (): void => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const handleResultClick = (result: SearchResult): void => {
    setShowResults(false);
  };

  // Cleanup effects
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm">
        {/* Desktop Line 1 - Hidden on mobile */}
        <div className="hidden lg:block">
          <div className="max-w-10/12 mx-auto px-4 py-3 flex items-center justify-between">
            <Link
              to="/"
              className="text-3xl font-bold text-emerald-600 tracking-tight"
            >
              Achyuta
            </Link>

            <div className="flex-1 mx-8 flex items-center gap-2 max-w-xl" ref={searchRef}>
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder="Where do you want to go?"
                  className="w-full pl-4 pr-24 py-2.5 border text-black border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-100 text-sm transition-all placeholder-gray-400"
                />
                <button 
                  onClick={handleSearchClick}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 text-white px-5 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Search size={16} />
                  )}
                  Search
                </button>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {(showResults || isLoading) && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-xl mt-1 max-h-80 overflow-y-auto z-50 border border-gray-100"
                    >
                      {isLoading ? (
                        <div className="p-4 text-center">
                          <div className="inline-flex items-center gap-2 text-gray-500">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                            <span className="text-sm">Searching...</span>
                          </div>
                        </div>
                      ) : error ? (
                        <div className="p-4 text-red-500 text-center text-sm">
                          {error}
                        </div>
                      ) : searchData.length === 0 ? (
                        <div className="p-4 text-gray-500 text-center text-sm">
                          No results found
                        </div>
                      ) : (
                        <div className="py-1">
                          {searchData.map((result, index) => (
                            <div
                              key={`${result.type}-${result._id || result.id}`}
                              onClick={() => handleResultClick(result)}
                              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                            >
                              <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 mr-3 bg-gray-100">
                                <img
                                  src={result.image}
                                  alt={result.displayName}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                  }}
                                />
                              </div>

                              <Link
                                to={
                                  result.type === "destination"
                                    ? `/destination/${result.displayName.replace(/\s+/g, "").toLowerCase()}?q=${result._id}`
                                    : `/tour?q=${result._id}`
                                }
                                className="flex-1 min-w-0 block"
                                onClick={() => handleResultClick(result)}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-medium text-gray-900 truncate text-sm">
                                    {result.displayName}
                                  </h3>
                                  <span
                                    className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                                      result.type === "destination"
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-green-100 text-green-600"
                                    }`}
                                  >
                                    {result.type === "destination" ? "Place" : "Tour"}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <p className="text-xs text-gray-500 truncate">
                                    {result.location}
                                  </p>

                                  {result.type === "tour" && result.price && (
                                    <span className="text-xs font-medium text-green-600 ml-2">
                                      ₹{(result.price / 1000).toFixed(0)}K
                                    </span>
                                  )}
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex space-x-6 md:mr-10">
              {["Upcoming Trips", "Corporate Tours", "Blogs", "About Us"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 flex items-center text-sm group"
                  >
                    {item === "Upcoming Trips" && (
                      <Calendar size={16} className="mr-2 text-emerald-500" />
                    )}
                    <span className="relative after:bg-emerald-600 after:transition-all group-hover:after:w-full">
                      {item}
                    </span>
                  </a>
                )
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* <div className="font-semibold bg-emerald-600 text-white px-4 py-2 rounded-full text-sm hover:bg-emerald-700 transition-colors shadow-sm">
                +91-9090403075
              </div> */}

              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors">
                    <User size={20} />
                    <span className="text-sm font-medium">{user.name}</span>
                    <ChevronDown
                      size={16}
                      className="text-gray-500 transition-transform duration-200 group-hover:rotate-180"
                    />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 invisible translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-150"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to={`/bookings`}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-150"
                    >
                      Bookings
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-150"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-sm  text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Line 2 - Hidden on mobile */}
        <div className="hidden lg:block border-t bg-emerald-500/15">
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center space-x-8">
            {[
              "International Trips",
              "India Trips",
              "Weekend Trips",
              "Group Tours",
            ].map((item) => (
              <div
                key={item}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(item)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors duration-200 cursor-pointer text-sm font-medium px-3 py-1.5 rounded-lg">
                  {item}
                  <ChevronDown
                    size={16}
                    className={`ml-2 transition-transform duration-200 ${
                      openDropdown === item
                        ? "rotate-180 text-emerald-500"
                        : "text-gray-500"
                    }`}
                  />
                </div>

                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-white shadow-lg rounded-xl py-3 z-20 border border-gray-200 transition-all duration-300 ${
                    openDropdown === item
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="px-4 pb-2 text-xs font-semibold text-gray-500 tracking-wide">
                    Popular Destinations
                  </div>
                  {dropdownContent[item as keyof DropdownContentType].map(
                    (destination: string) => (
                      <Link
                        key={destination}
                        to={`/destination/${createSlug(destination)}`}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 group/item transition-colors"
                      >
                        <MapPin
                          size={16}
                          className="mr-3 text-gray-400 group-hover/item:text-emerald-500 min-w-[16px] transition-colors"
                        />
                        {destination}
                      </Link>
                    )
                  )}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      to = {`/destinations`}
                      className="flex items-center px-4 py-2 text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                    >
                      View All Destinations
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {["Honeymoon Packages", "early-bird", "Gift Cards"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-transparent"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              to="/"
              className="text-2xl font-bold text-emerald-600 tracking-tight"
            >
              Achyuta
            </Link>

            <div className="flex items-center gap-3">
              <a
                href="tel:+919090403075"
                className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors"
              >
                <Phone size={18} />
              </a>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {/* <div className="px-4 hidden pb-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where do you want to go?"
                className="w-full pl-4 pr-16 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-100 text-sm transition-all placeholder-gray-400"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors">
                <Search size={16} />
              </button>
            </div>
          </div> */}
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`lg:hidden bg-white border-t border-gray-100 transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-4 space-y-2 max-h-80 overflow-y-auto">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <User size={20} className="text-emerald-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="flex items-center text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-200 px-3 py-2.5 rounded-lg text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-200 px-3 py-2.5 rounded-lg text-sm font-medium w-full"
                >
                  Logout
                </button>
                <Link
                  to={`/bookings`}
                  className="flex items-center text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-200 px-3 py-2.5 rounded-lg text-sm font-medium w-full"
                >
                  Bookings
                </Link>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-3 py-2">
                <Link
                  to="/login"
                  className="text-center text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-center bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}

            <div className="border-t border-gray-100 my-3"></div>

            {/* Trip Categories */}
            {[
              "International Trips",
              "India Trips",
              "Weekend Trips",
              "Group Tours",
            ].map((category) => (
              <div key={category}>
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === category ? null : category)
                  }
                  className="flex items-center justify-between w-full text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-200 px-3 py-2.5 rounded-lg text-sm font-medium"
                >
                  {category}
                  <ChevronDown
                    size={16}
                    className={`ml-2 transition-transform duration-200 ${
                      openDropdown === category ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openDropdown === category && (
                  <div className="mt-1 ml-4 space-y-1">
                    {dropdownContent[category as keyof DropdownContentType].map(
                      (destination: string) => (
                        <a
                          key={destination}
                          href="#"
                          className="flex items-center text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-200 px-3 py-2 rounded-lg text-sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <MapPin size={14} className="mr-3 text-gray-400" />
                          {destination}
                        </a>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="border-t border-gray-100 my-3"></div>

            {/* Special Items */}
            {["Honeymoon Packages", "early-bird", "Gift Cards"].map((item) => (
              <a
                key={item}
                href="#"
                className="flex items-center text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-200 px-3 py-2.5 rounded-lg text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
