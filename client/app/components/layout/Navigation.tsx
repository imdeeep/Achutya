import { useState } from "react";
import {
  Search,
  Calendar,
  MapPin,
  ArrowRight,
  Menu,
  X,
  Phone,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router";

type DropdownContentType = {
  "International Trips": string[];
  "India Trips": string[];
  "Weekend Trips": string[];
  "Group Tours": string[];
};

const Navigation = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownContent: DropdownContentType = {
    "International Trips": ["Thailand", "Switzerland", "Bali", "Dubai"],
    "India Trips": ["Goa", "Kerala", "Rajasthan", "Himachal"],
    "Weekend Trips": ["Lonavala", "Alibaug", "Pune", "Matheran"],
    "Group Tours": ["Andaman", "Kashmir", "Sikkim", "Coorg"],
  };

  const createSlug = (destination: string) => {
    return destination.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm">
        {/* Desktop Line 1 - Hidden on mobile */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="text-3xl font-bold text-emerald-600 tracking-tight">
              Achutya
            </div>

            <div className="flex-1 mx-8 flex items-center gap-2 max-w-xl">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Where do you want to go?"
                  className="w-full pl-4 pr-24 py-2.5 border text-black border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-100 text-sm transition-all placeholder-gray-400"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 text-white px-5 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm">
                  <Search size={16} />
                  Search
                </button>
              </div>
            </div>

            <div className="flex space-x-6">
              {[
                "Upcoming Trips",
                "Corporate Tours",
                "Blogs",
                "About Us",
                "Payments",
              ].map((item) => (
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
              ))}
            </div>

            <div className="ml-6 font-semibold bg-emerald-600 text-white px-4 py-2 rounded-full text-sm hover:bg-emerald-700 transition-colors shadow-sm">
              +91-9090403075
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
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                    >
                      View All Destinations
                      <ArrowRight size={16} className="ml-2" />
                    </a>
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
            <div className="text-2xl font-bold text-emerald-600 tracking-tight">
              Achutya
            </div>

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
          <div className="px-4 pb-3">
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
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`lg:hidden bg-white border-t border-gray-100 transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-4 space-y-2 max-h-80 overflow-y-auto">
            {/* Navigation Items */}
            {[
              "Upcoming Trips",
              "Corporate Tours",
              "Blogs",
              "About Us",
              "Payments",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="flex items-center text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors duration-200 px-3 py-2.5 rounded-lg text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item === "Upcoming Trips" && (
                  <Calendar size={16} className="mr-3 text-emerald-500" />
                )}
                {item}
              </a>
            ))}

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
