import React from "react";
import {
  Star,
  Clock,
  MapPin,
  IndianRupee,
  Percent,
  Users,
  BadgeCheck,
} from "lucide-react";
import { Link } from "react-router";

interface Tour {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  groupType: string;
  rating: number;
  reviewCount: number;
  duration: string;
  city: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  highlights?: string[];
  maxGroupSize?: number;
}

interface TourCardsProps {
  filteredTours: Tour[];
  selectedDate: string | null;
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
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow group hover:shadow-xl hover:scale-[1.015] transition-all duration-300"
          >
            <div className="relative overflow-hidden">
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />

              {/* Group Type & Discount */}
              <div className="absolute top-3 left-3 z-20 flex gap-2">
                <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                  {tour.groupType}
                </span>
                {tour.discount && tour.discount > 0 && (
                  <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow">
                    {tour.discount}% OFF
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow text-sm font-medium flex items-center gap-1 text-gray-800">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {tour.rating}
                <span className="text-xs text-gray-500">
                  ({tour.reviewCount})
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-1">
                {tour.title}
              </h3>
              {tour.subtitle && (
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                  {tour.subtitle}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  {tour.duration}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  {tour.city}
                </div>
                {tour.maxGroupSize && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    {tour.maxGroupSize} People
                  </div>
                )}
              </div>

              {tour.highlights && tour.highlights.length > 0 && (
                <ul className="text-sm text-gray-600 mb-4 list-disc list-inside space-y-1">
                  {tour.highlights
                    .slice(0, 2)
                    .map((point: string, index: number) => (
                      <li key={index}>{point}</li>
                    ))}
                  {tour.highlights.length > 2 && (
                    <li className="italic text-gray-400">+ more</li>
                  )}
                </ul>
              )}

              <div className="flex items-center justify-between mt-4">
                <div>
                  <div className="flex items-center gap-1 text-xl font-bold text-gray-900">
                    <IndianRupee className="w-5 h-5 text-emerald-600" />
                    {formatPrice(tour.price)}
                    {tour.originalPrice && tour.originalPrice > tour.price && (
                      <span className="line-through text-sm text-gray-400 ml-2">
                        {formatPrice(tour.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  to={`/tour?q=${tour.id}`}
                  className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-emerald-700 hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredTours.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow border border-gray-200 mt-6">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No tours found
          </h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your filters to find more options.
          </p>
          <button
            onClick={clearFilters}
            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm px-4 py-2 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TourCards;
