import {
  Clock,
  Users,
  Mountain,
  CheckCircle,
  Phone,
  Mail,
  IndianRupee,
} from "lucide-react";
import type { TourData } from "~/types/tour";


const BookingCard = ({tourData,handleBookNow}: { tourData: TourData }) => {
  return (
    <div className="lg:col-span-1">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 sticky top-6 border border-white/50">
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center space-x-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900 flex items-center">
                      <IndianRupee className="h-7 w-7" />
                      {tourData.price.toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{tourData.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {tourData.discount}% OFF
                    </span>
                    <span className="text-sm text-gray-600">per person</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    {
                      icon: Clock,
                      label: "Duration",
                      value: tourData.duration,
                    },
                    {
                      icon: Users,
                      label: "Group Size",
                      value: `Max ${tourData.maxGroupSize}`,
                    },
                    {
                      icon: Mountain,
                      label: "Difficulty",
                      value: tourData.difficulty,
                    },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-gray-600 flex items-center space-x-2 text-sm">
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </span>
                        <span className="font-semibold text-gray-900 text-sm">
                          {item.value}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleBookNow}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Book Now
                </button>

                <div className="text-center space-y-2 mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-600 hover:text-emerald-600 transition-colors">
                    <Phone className="h-3 w-3" />
                    <span>+91-9999999999</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-600 hover:text-emerald-600 transition-colors">
                    <Mail className="h-3 w-3" />
                    <span>info@tourcompany.com</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-bold mb-3 text-center text-gray-900 text-sm">
                    Why Choose Us?
                  </h4>
                  <div className="space-y-2">
                    {[
                      { icon: CheckCircle, text: "Best Price Guarantee" },
                      { icon: CheckCircle, text: "24/7 Support" },
                      { icon: CheckCircle, text: "Free Cancellation" },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-2 bg-emerald-50 rounded-lg"
                        >
                          <Icon className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-xs font-medium text-gray-700">
                            {item.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
  )
}

export default BookingCard