import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Car,
  ChevronRight,
  ChevronDown,
  Home,
  Utensils,
  Shield,
  AlertCircle,
  CheckCircle,
  X,
  Info,
  Eye,
  EyeOff,
} from "lucide-react";
import { mockTourData } from "~/lib/mockTourData";
import Layout from "~/components/layout/Layout";
import TourHeader from "~/components/sections/TourDetails/TourHeader";
import BookingCard from "~/components/sections/TourDetails/BookingCard";
import TourNotFound from "~/components/sections/TourDetails/TourNotFound";
import { Error } from "~/components/sections/TourDetails/Error";

const TourDetails = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tourData, setTourData] = useState(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [expandedDay, setExpandedDay] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllNotes, setShowAllNotes] = useState(false);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true);        await new Promise((resolve) => setTimeout(resolve, 1000));
        setTourData(mockTourData);
      } catch (err) {
        setError("Failed to load tour details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, []);

  const handleBookNow = () => {
    alert("Booking functionality would be implemented here");
  };

  const toggleAccordion = (dayIndex) => {
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };

  const truncateText = (text, maxLength = 280) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="animate-pulse">
            <div className="h-80 bg-gradient-to-r from-gray-200 to-gray-300"></div>
            <div className="max-w-6xl mx-auto px-4 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-6 bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-32 bg-gray-200 rounded-xl"></div>
                </div>
                <div className="h-96 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Error error={error}/>
    );
  }

  if (!tourData) {
    return (
      <TourNotFound/>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <TourHeader tourData={mockTourData}/>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Content Area */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                <div className="bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-md border-b border-white/30">
                  <nav className="flex px-6 py-1" aria-label="Tabs">
                    {[
                      { id: "overview", name: "Overview", icon: Eye },
                      { id: "itinerary", name: "Itinerary", icon: Calendar },
                      {
                        id: "inclusions",
                        name: "Inclusions",
                        icon: CheckCircle,
                      },
                      { id: "essentials", name: "Essentials", icon: Shield },
                      { id: "notes", name: "Important Notes", icon: Info },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedTab(tab.id)}
                          className={`py-3 px-4 text-sm font-medium transition-all duration-200 flex items-center space-x-2 rounded-lg mx-1 ${
                            selectedTab === tab.id
                              ? "bg-emerald-600 text-white shadow-lg"
                              : "text-gray-600 hover:text-emerald-600 hover:bg-white/50"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="hidden sm:inline">{tab.name}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="p-6">
                  {selectedTab === "overview" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          Tour Overview
                        </h2>
                        <div className="prose prose-gray max-w-none">
                          <p className="text-gray-700 leading-relaxed">
                            {showFullDescription
                              ? tourData.overview.description
                              : truncateText(tourData.overview.description)}
                          </p>
                          {tourData.overview.description.length > 280 && (
                            <button
                              onClick={() =>
                                setShowFullDescription(!showFullDescription)
                              }
                              className="mt-3 text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center space-x-1 transition-colors"
                            >
                              {showFullDescription ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                              <span>
                                {showFullDescription
                                  ? "Read Less"
                                  : "Read More"}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          Tour Highlights
                        </h3>
                        <div className="grid gap-3">
                          {tourData.highlights.map((highlight, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100"
                            >
                              <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-800 text-sm font-medium">
                                {highlight}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          Tour Features
                        </h3>
                        <div className="grid gap-3">
                          {tourData.overview.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border  border-emerald-100"
                            >
                              <CheckCircle className="h-5 w-5 text-[#339966] mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="text-gray-800 text-sm font-medium mb-1">
                                  {feature.title}
                                </h4>
                                <p className="text-gray-700 text-xs leading-relaxed">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedTab === "itinerary" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Itinerary
                      </h2>
                      <div className="space-y-3">
                        {tourData.itinerary.map((day, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm"
                          >
                            <button
                              onClick={() => toggleAccordion(index)}
                              className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 flex items-center justify-between hover:from-emerald-50 hover:to-teal-50 transition-all duration-200"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                  {day.day}
                                </div>
                                <div className="text-left">
                                  <h4 className="font-bold text-gray-900">
                                    {day.title}
                                  </h4>
                                  {day.distance && (
                                    <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                                      <span className="flex items-center space-x-1">
                                        <Car className="h-3 w-3" />
                                        <span>{day.distance}</span>
                                      </span>
                                      <span className="flex items-center space-x-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{day.duration}</span>
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {expandedDay === index ? (
                                <ChevronDown className="h-5 w-5 text-emerald-600" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-emerald-600" />
                              )}
                            </button>

                            {expandedDay === index && (
                              <div className="px-4 pb-4">
                                <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                                  {day.description}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h5 className="font-semibold text-gray-900 mb-2 text-sm">
                                      Activities
                                    </h5>
                                    <ul className="space-y-1">
                                      {day.activities.map(
                                        (activity, actIndex) => (
                                          <li
                                            key={actIndex}
                                            className="flex items-start space-x-2 text-xs text-gray-600"
                                          >
                                            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                            <span>{activity}</span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-xs">
                                      <Home className="h-3 w-3 text-emerald-600" />
                                      <span className="text-gray-600">
                                        {day.accommodation}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs">
                                      <Utensils className="h-3 w-3 text-emerald-600" />
                                      <span className="text-gray-600">
                                        {day.meals}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTab === "inclusions" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Inclusions & Exclusions
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-xl border border-emerald-100">
                          <h3 className="text-lg font-bold mb-4 text-emerald-700 flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5" />
                            <span>Included</span>
                          </h3>
                          <ul className="space-y-2">
                            {tourData.inclusions.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-start space-x-2"
                              >
                                <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 text-sm">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-5 rounded-xl border border-red-100">
                          <h3 className="text-lg font-bold mb-4 text-red-700 flex items-center space-x-2">
                            <X className="h-5 w-5" />
                            <span>Not Included</span>
                          </h3>
                          <ul className="space-y-2">
                            {tourData.exclusions.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-start space-x-2"
                              >
                                <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 text-sm">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedTab === "essentials" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        What to Pack
                      </h2>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {tourData.essentials.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 p-3 bg-white/70 rounded-lg"
                            >
                              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-bold text-yellow-800 mb-1 text-sm">
                              Health Advisory
                            </h4>
                            <p className="text-xs text-yellow-700 leading-relaxed">
                              High altitude travel up to 4,500m. Consult your
                              doctor for medical concerns. Altitude sickness
                              medication recommended.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedTab === "notes" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Important Notes
                      </h2>
                      <div className="space-y-3">
                        {(showAllNotes
                          ? tourData.notes
                          : tourData.notes.slice(0, 5)
                        ).map((note, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100"
                          >
                            <div className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {note}
                            </p>
                          </div>
                        ))}

                        {tourData.notes.length > 5 && (
                          <button
                            onClick={() => setShowAllNotes(!showAllNotes)}
                            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-amber-100 to-yellow-100 hover:from-amber-200 hover:to-yellow-200 text-amber-800 rounded-xl font-medium text-sm transition-all duration-200 border border-amber-200"
                          >
                            {showAllNotes
                              ? "Show Less Notes"
                              : `Show All ${tourData.notes.length} Notes`}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <BookingCard tourData={mockTourData} handleBookNow={handleBookNow}/>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TourDetails;
