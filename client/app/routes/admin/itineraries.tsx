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
import { itineraryApi } from "../../services/adminApi";
import { uploadImage } from "../../services/cloudinary";

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
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const response = await itineraryApi.getAllItineraries();
      if (response.success) {
        setItineraries(response.data);
        setError(null);
      } else {
        throw new Error(response.error || "Failed to fetch itineraries");
      }
    } catch (err) {
      setError("Failed to fetch itineraries");
      console.error("Error fetching itineraries:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItinerary = async (itineraryId: string) => {
    if (window.confirm("Are you sure you want to delete this itinerary?")) {
      try {
        const response = await itineraryApi.deleteItinerary(itineraryId);
        if (response.success) {
          setItineraries(
            itineraries.filter((itinerary) => itinerary._id !== itineraryId)
          );
        } else {
          throw new Error(response.error || "Failed to delete itinerary");
        }
      } catch (err) {
        setError("Failed to delete itinerary");
        console.error("Error deleting itinerary:", err);
      }
    }
  };

  const handleImageUpload = async (file: File, itineraryId: string) => {
    try {
      setUploadingImage(true);
      const imageUrl = await uploadImage(file);
      const response = await itineraryApi.updateItinerary(itineraryId, {
        image: imageUrl,
      });
      if (response.success) {
        await fetchItineraries(); // Refresh the itineraries list
      } else {
        throw new Error(response.error || "Failed to update image");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image");
    } finally {
      setUploadingImage(false);
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
    ...new Set(itineraries.map((itinerary) => itinerary.country)),
  ];
  const cities = [
    "All",
    ...new Set(itineraries.map((itinerary) => itinerary.city)),
  ];
  const groupTypes = ["All", "Group", "Private", "Custom"];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Itineraries</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your tour itineraries and packages
          </p>
        </div>
        <Link
          to="/admin/itineraries/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Itinerary
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search itineraries..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          />
        </div>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <select
          value={selectedGroupType}
          onChange={(e) => setSelectedGroupType(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
        >
          {groupTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
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
                src={itinerary.image}
                alt={itinerary.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <Link
                  to={`/tour/${itinerary._id}`}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <Link
                  to={`/admin/itineraries/update/${itinerary._id}`}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDeleteItinerary(itinerary._id)}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {itinerary.title}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {itinerary.duration}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  {itinerary.city}, {itinerary.country}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  {itinerary.groupType}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-lg font-semibold text-emerald-600">
                    ₹{itinerary.price}
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
      {filteredItineraries.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No itineraries found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
