import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, MapPin, Users, Star, Edit, Save, X } from "lucide-react";
import { tours } from "~/lib/tour.data";

export default function ItineraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTour, setEditedTour] = useState<any>(null);

  const tour = tours.find((t) => t.id === Number(id));

  useEffect(() => {
    if (tour) {
      setEditedTour(tour);
    }
  }, [tour]);

  if (!tour) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-1">Itinerary not found</h3>
          <p className="text-gray-500">The itinerary you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/admin/itineraries")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Itineraries
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // Here you would typically make an API call to update the tour
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTour(tour);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/itineraries")}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Itineraries
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative">
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-64 object-cover"
          />
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={editedTour.title}
                  onChange={(e) => setEditedTour({ ...editedTour, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  value={editedTour.duration}
                  onChange={(e) => setEditedTour({ ...editedTour, duration: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  value={editedTour.price}
                  onChange={(e) => setEditedTour({ ...editedTour, price: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{tour.title}</h1>
              <div className="space-y-4">
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
                  <span className="text-gray-400 ml-1">({tour.reviews} reviews)</span>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-2xl font-semibold text-emerald-600">
                    ₹{tour.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 