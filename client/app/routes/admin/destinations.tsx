import { useState } from "react";
import { Link } from "react-router";
import { Plus, Search, Edit, Trash2, MapPin } from "lucide-react";
import { countryData } from "../../lib/tour.data";

// Mock data for destinations
const destinations = [
  {
    id: 1,
    name: "Goa",
    country: "India",
    description: "Famous for its beaches, nightlife, and Portuguese architecture",
    image: "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
    attractions: ["Beaches", "Nightlife", "Water Sports"],
    status: "Active",
  },
  {
    id: 2,
    name: "Kerala",
    country: "India",
    description: "Known for its backwaters, beaches, and Ayurvedic treatments",
    image: "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg",
    attractions: ["Backwaters", "Beaches", "Ayurveda"],
    status: "Active",
  },
  {
    id: 3,
    name: "Rajasthan",
    country: "India",
    description: "Land of kings, known for its palaces, forts, and desert",
    image: "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg",
    attractions: ["Palaces", "Forts", "Desert Safari"],
    status: "Active",
  },
];

export default function Destinations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");

  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch = destination.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCountry =
      selectedCountry === "All" || destination.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const countries = ["All", ...Object.keys(countryData)];

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Destinations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your travel destinations and locations
          </p>
        </div>
        <Link
          to="/admin/destinations/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Destination
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destinations..."
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
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDestinations.map((destination) => (
          <div
            key={destination.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={destination.image}
                alt={destination.name}
                className="object-cover w-full h-48"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-emerald-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {destination.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/admin/destinations/${destination.id}`}
                    className="text-gray-400 hover:text-emerald-600"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => {
                      // Handle delete
                    }}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">{destination.description}</p>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Attractions</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {destination.attractions.map((attraction) => (
                    <span
                      key={attraction}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                    >
                      {attraction}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">{destination.country}</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    destination.status === "Active"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {destination.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 