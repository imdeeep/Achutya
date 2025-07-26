import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Loader2,
  MapPin,
  Clock,
  Sun,
  Calendar,
  Globe,
  DollarSign,
  Languages,
} from "lucide-react";
import { destinationApi } from "~/services/adminApi";

interface Destination {
  _id: string;
  name: string;
  country: "India" | "International";
  countryName: string;
  description: string;
  image: string;
  heroImage: string;
  highlights: string[];
  bestTimeToVisit: string;
  climate: string;
  currency: string;
  language: string;
  timeZone: string;
  isActive: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: Destination[];
  count: number;
  message?: string;
}

const HighlightText = ({
  text,
  searchTerm,
}: {
  text: string;
  searchTerm: string;
}) => {
  if (!searchTerm || !text) return <span>{text}</span>;

  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-yellow-200 text-gray-900 px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

export default function Destinations() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");

  const fetchAllDestinations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await destinationApi.getAllDestinations();
      if (response.success && response.data) {
        setDestinations(response.data);
      } else {
        throw new Error(response.message || "Failed to load destinations");
      }
    } catch (err) {
      console.error("Error fetching destinations:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load destinations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDestinations();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this destination? This action cannot be undone."
      )
    )
      return;

    try {
      setDeletingId(id);
      const response = await destinationApi.deleteDestination(id);
      if (response.success) {
        setDestinations((prev) => prev.filter((d) => d._id !== id));
      } else {
        throw new Error(response.message || "Failed to delete destination");
      }
    } catch (err) {
      console.error("Error deleting destination:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete destination. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Enhanced search functionality
  const filteredDestinations = destinations.filter((destination) => {
    if (!searchTerm.trim() && selectedCountry === "All") return true;

    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch =
      searchLower === "" ||
      destination.name.toLowerCase().includes(searchLower) ||
      destination.countryName?.toLowerCase().includes(searchLower) ||
      destination.description?.toLowerCase().includes(searchLower) ||
      destination.highlights?.some((h) =>
        h.toLowerCase().includes(searchLower)
      ) ||
      destination._id.toLowerCase().includes(searchLower);

    const matchesCountry =
      selectedCountry === "All" || destination.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  const countries = ["All", ...new Set(destinations.map((d) => d.country))];

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="w-full sm:w-1/3">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md"
                placeholder="Search by name, country, or highlights..."
              />
            </div>
          </div>

          <div className="w-full sm:w-1/4">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country Type
            </label>
            <select
              id="country"
              name="country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 rounded-md"
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-auto sm:ml-auto">
            <Link
              to="/admin/destinations/new"
              className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <Plus className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
              Add Destination
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <Loader2 className="mx-auto h-8 w-8 text-emerald-500 animate-spin" />
          <p className="mt-2 text-sm text-gray-500">Loading destinations...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : filteredDestinations.length === 0 ? (
        <div className="text-center py-12 bg-white shadow rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No destinations found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedCountry !== "All"
              ? "No destinations match your search criteria."
              : "Get started by creating a new destination."}
          </p>
          <div className="mt-6">
            <Link
              to="/admin/destinations/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              New Destination
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDestinations.map((destination) => (
            <div
              key={destination._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image with overlay */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src={
                    destination.image ||
                    destination.heroImage ||
                    "https://via.placeholder.com/800x450?text=No+Image"
                  }
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/800x450?text=Image+Not+Found";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        <HighlightText
                          text={destination.name}
                          searchTerm={searchTerm}
                        />
                      </h3>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 text-emerald-300 mr-1" />
                        <span className="text-emerald-100 text-sm">
                          <HighlightText
                            text={destination.countryName}
                            searchTerm={searchTerm}
                          />
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/destinations/${destination._id}`);
                        }}
                        className="text-gray-800 hover:text-green-800 p-2 rounded-full transition-colors bg-white"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(destination._id);
                        }}
                        disabled={deletingId === destination._id}
                        className="text-gray-800 hover:text-red-600 p-2 rounded-full transition-colors disabled:opacity-50 bg-white"
                        title="Delete"
                      >
                        {deletingId === destination._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                {/* Essential Info Icons */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {destination.bestTimeToVisit && (
                    <div className="flex items-center">
                      <div className="bg-emerald-50 p-2 rounded-full text-emerald-600 mr-3">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Best Time</p>
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">
                          {destination.bestTimeToVisit.split(" to ")[0]}
                        </p>
                      </div>
                    </div>
                  )}

                  {destination.climate && (
                    <div className="flex items-center">
                      <div className="bg-blue-50 p-2 rounded-full text-blue-600 mr-3">
                        <Sun className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Climate</p>
                        <p className="text-sm font-medium text-gray-800">
                          {destination.climate}
                        </p>
                      </div>
                    </div>
                  )}

                  {destination.timeZone && (
                    <div className="flex items-center">
                      <div className="bg-purple-50 p-2 rounded-full text-purple-600 mr-3">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Time Zone</p>
                        <p className="text-sm font-medium text-gray-800">
                          {destination.timeZone}
                        </p>
                      </div>
                    </div>
                  )}

                  {destination.currency && (
                    <div className="flex items-center">
                      <div className="bg-amber-50 p-2 rounded-full text-amber-600 mr-3">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Currency</p>
                        <p className="text-sm font-medium text-gray-800">
                          {destination.currency}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {destination.description && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    <HighlightText
                      text={destination.description}
                      searchTerm={searchTerm}
                    />
                  </p>
                )}

                {/* Status Badge */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      destination.isActive
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {destination.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">
                    Created{" "}
                    {new Date(destination.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
