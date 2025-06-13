import { useState } from "react";
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
} from "lucide-react";
import { tours } from "~/lib/tour.data";

export default function Itineraries() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedGroupType, setSelectedGroupType] = useState("All");

  const filteredTours = tours.filter((tour) => {
    const matchesSearch = tour.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCountry =
      selectedCountry === "All" || tour.country === selectedCountry;
    const matchesCity = selectedCity === "All" || tour.city === selectedCity;
    const matchesGroupType =
      selectedGroupType === "All" || tour.groupType === selectedGroupType;
    return matchesSearch && matchesCountry && matchesCity && matchesGroupType;
  });

  const countries = ["All", ...new Set(tours.map((tour) => tour.country))];
  const cities = ["All", ...new Set(tours.map((tour) => tour.city))];
  const groupTypes = ["All", "Group", "Private", "Custom"];

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
        {filteredTours.map((tour) => (
          <div
            key={tour.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="relative">
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <Link
                  to={`/admin/itineraries/${tour.id}`}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => {
                    // Handle delete
                  }}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {tour.title}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {tour.duration}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  {tour.city}, {tour.country}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  {tour.groupType}
                </div>
                <div className="flex items-center text-sm">
                  <Star className="w-4 h-4 mr-1 text-yellow-400" />
                  <span className="text-gray-700">{tour.rating}</span>
                  <span className="text-gray-400 ml-1">
                    ({tour.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-lg font-semibold text-emerald-600">
                    ₹{tour.price.toLocaleString()}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {tour.groupType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTours.length === 0 && (
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
