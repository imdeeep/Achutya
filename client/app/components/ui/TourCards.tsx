import React from "react";
import { Star, Clock, MapPin, IndianRupee } from "lucide-react";
import { Link } from "react-router";

interface Tour {
  id: string;
  title: string;
  image: string;
  groupType: string;
  rating: number;
  reviews: number;
  duration: string;
  city: string;
  price: number;
}

interface TourCardsProps {
  filteredTours: Tour[];
  selectedDate: string;
  formatPrice: (price: number) => string;
  clearFilters: () => void;
}

const TourCards: React.FC<TourCardsProps> = ({
  filteredTours,
  selectedDate,
  formatPrice,
  clearFilters,
}) => {
  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredTours.map((tour) => (
          <div
            key={tour.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
          >
            <div className="relative overflow-hidden">
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute top-3 left-3">
                <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  {tour.groupType}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-gray-800">
                    {tour.rating}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({tour.reviews})
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                {tour.title}
              </h3>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{tour.city}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 text-xl font-bold text-gray-900">
                    <IndianRupee className="w-5 h-5 text-emerald-600" />
                    <span>{formatPrice(tour.price)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedDate
                      ? `Starting ${selectedDate}`
                      : "Dates on Request"}
                  </p>
                </div>
                <Link
                  to={`/tour?id=${tour.id}`}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-emerald-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/*  No Results State */}
      {filteredTours.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No tours found
          </h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your filters to find more options
          </p>
          <button
            onClick={clearFilters}
            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm px-4 py-2 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TourCards;
