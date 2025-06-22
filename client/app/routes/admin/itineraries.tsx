import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Star,
  Upload,
  Eye,
} from "lucide-react";
import { tourApi } from "~/services/adminApi";

interface Itinerary {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  duration: string;
  country: string;
  city: string;
  groupType: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  essentials: string[];
  notes: string[];
  features: Array<{
    title: string;
    description: string;
  }>;
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
    activities: string[];
    distance: string;
    duration: string;
    accommodation: string;
    meals: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function Itineraries() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedGroupType, setSelectedGroupType] = useState("All");

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const response = await tourApi.getAllTours();
      console.log("API Response:", response); // Debug log

      // Handle different response structures
      if (response.success && response.data) {
        setItineraries(response.data);
        setError(null);
      } else if (Array.isArray(response)) {
        // If response is directly an array
        setItineraries(response);
        setError(null);
      } else {
        throw new Error(response.message || "Failed to fetch itineraries");
      }
    } catch (err) {
      setError("Failed to fetch itineraries");
      console.error("Error fetching itineraries:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItinerary = async (itineraryId: string) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      try {
        const response = await tourApi.deleteTour(itineraryId);
        if (response.success || response.message) {
          setItineraries(
            itineraries.filter((itinerary) => itinerary._id !== itineraryId)
          );
        } else {
          throw new Error(response.error || "Failed to delete tour");
        }
      } catch (err) {
        setError("Failed to delete tour");
        console.error("Error deleting tour:", err);
      }
    }
  };

  const filteredItineraries = itineraries.filter((itinerary) => {
    const matchesSearch = itinerary.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCountry =
      selectedCountry === "All" || itinerary.country === selectedCountry;
    const matchesCity =
      selectedCity === "All" || itinerary.city === selectedCity;
    const matchesGroupType =
      selectedGroupType === "All" || itinerary.groupType === selectedGroupType;
    return matchesSearch && matchesCountry && matchesCity && matchesGroupType;
  });

  const countries = [
    "All",
    ...new Set(
      itineraries.map((itinerary) => itinerary.country).filter(Boolean)
    ),
  ];
  const cities = [
    "All",
    ...new Set(itineraries.map((itinerary) => itinerary.city).filter(Boolean)),
  ];
  const groupTypes = ["All", "Group", "Private", "Custom"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchItineraries}
                  className="text-sm bg-red-100 text-red-800 rounded-md px-3 py-2 hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
        <div className="relative flex-1 w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search itineraries..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm h-10"
          />
        </div>
        <div className="w-full sm:w-auto">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm h-10"
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <select
            value={selectedGroupType}
            onChange={(e) => setSelectedGroupType(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm h-10"
          >
            {groupTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <Link
          to="/admin/itineraries/new"
          className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 h-10 whitespace-nowrap"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Tour
        </Link>
      </div>

      {/* Itineraries Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItineraries.map((itinerary) => (
          <div
            key={itinerary._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="relative">
              <img
                src={itinerary.image || "/placeholder-image.jpg"}
                alt={itinerary.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-image.jpg";
                }}
              />
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <Link
                  to={`/tour/${itinerary._id}`}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
                  title="View Tour"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <Link
                  to={`/admin/itineraries/update/${itinerary._id}`}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
                  title="Edit Tour"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDeleteItinerary(itinerary._id)}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors duration-200"
                  title="Delete Tour"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                {itinerary.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {itinerary.description}
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{itinerary.duration}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>
                    {itinerary.city}
                    {itinerary.city && itinerary.country && ", "}
                    {itinerary.country}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{itinerary.groupType}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-lg font-semibold text-emerald-600">
                    ₹
                    {itinerary.price
                      ? Number(itinerary.price).toLocaleString()
                      : "N/A"}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {itinerary.groupType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItineraries.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No itineraries found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ||
            selectedCountry !== "All" ||
            selectedCity !== "All" ||
            selectedGroupType !== "All"
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first itinerary"}
          </p>
          {!searchQuery &&
            selectedCountry === "All" &&
            selectedCity === "All" &&
            selectedGroupType === "All" && (
              <Link
                to="/admin/itineraries/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Tour
              </Link>
            )}
        </div>
      )}
    </div>
  );
}
