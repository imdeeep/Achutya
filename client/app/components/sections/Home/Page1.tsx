import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { destinationApi } from "~/services/userApi";
import { Link } from "react-router";

interface Destination {
  _id: string;
  name: string;
  country: string;
  countryName?: string;
  image: string;
  heroImage?: string;
}

interface Tour {
  _id?: string;
  id?: string;
  title: string;
  location?: string;
  city?: string;
  image: string;
  heroImage?: string;
  duration?: string;
  price?: number;
}

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

interface ApiResponse {
  success: boolean;
  data: {
    destinations?: {
      count: number;
      results: Destination[];
    };
    tours?: {
      count: number;
      results: Tour[];
    };
    totalResults?: number;
  };
}

const Page1 = () => {
  const [currentSubheading, setCurrentSubheading] = useState<number>(0);
  const [currentDestination, setCurrentDestination] = useState<number>(0);
  const [searchData, setSearchData] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const subheadings = [
    "Create Unforgettable Memories",
    "Discover Amazing Destinations",
    "Connect with Fellow Adventurers",
    "Explore the World Together",
  ];

  const destinations = [
    "Bali",
    "America",
    "Himachal",
    "Switzerland",
    "Thailand",
    "Dubai",
  ];

  useEffect(() => {
    const subheadingInterval = setInterval(() => {
      setCurrentSubheading((prev) => (prev + 1) % subheadings.length);
    }, 3000);

    const destinationInterval = setInterval(() => {
      setCurrentDestination((prev) => (prev + 1) % destinations.length);
    }, 1500);

    return () => {
      clearInterval(subheadingInterval);
      clearInterval(destinationInterval);
    };
  }, []);

  const handleSearch = async (query: string): Promise<void> => {
    if (!query.trim()) {
      setSearchData([]);
      setShowResults(false);
      setIsLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
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

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim()) {
      setIsLoading(true); // Show loading immediately for better UX
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
    // Navigation is handled by the Link component
  };

  // Clean up on unmount
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

  // Close results when clicking outside
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
    <div className="relative min-h-screen w-full overflow-hidden">
      <motion.div
        initial={{ scale: 1.2 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/2131856/pexels-photo-2131856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center md:-translate-y-10">
        <div className="">
          <motion.p
            key={currentSubheading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white text-lg md:text-2xl font-medium"
          >
            {subheadings[currentSubheading]}
          </motion.p>
        </div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white text-4xl md:text-5xl lg:text-7xl font-bold mb-4 leading-tight"
        >
          Adventure Awaits, <span style={{ color: "#2ca36e" }}>Explore</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-lg relative"
          ref={searchRef}
        >
          <div className="relative bg-white rounded-md shadow-2xl overflow-hidden">
            <div className="flex items-center px-2 py-2">
              <svg
                className="text-gray-400 w-5 h-5 mr-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0z"
                />
              </svg>

              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="w-full text-gray-700 text-lg bg-transparent border-none outline-none"
                  placeholder={`Search for ${destinations[currentDestination]}`}
                />
              </div>

              <button
                onClick={handleSearchClick}
                disabled={isLoading}
                className="ml-4 p-2 rounded text-white transition-all duration-300 hover:shadow-lg flex-shrink-0 cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: "#277a55" }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

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
                              (e.target as HTMLImageElement).style.display =
                                "none";
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
                              📍 {result.location}
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
        </motion.div>
      </div>
    </div>
  );
};

export default Page1;
