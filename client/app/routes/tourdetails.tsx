import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import Layout from "~/components/layout/Layout";
import TourHeader from "~/components/sections/TourDetails/TourHeader";
import TourNotFound from "~/components/sections/TourDetails/TourNotFound";
import { Error } from "~/components/sections/TourDetails/Error";
import BookingCard from "~/components/sections/TourDetails/BookingCard";
import MainContent from "~/components/sections/TourDetails/MainContent";
import { tourApi } from "~/services/userApi";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// interface UserDetails {
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
// }

const TourDetails = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tourData, setTourData] = useState<any>(null); // Start with null instead of mockTourData
  const [selectedTab, setSelectedTab] = useState("overview");
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllNotes, setShowAllNotes] = useState(false);

  // Extract ID from query parameter
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("q");

  useEffect(() => {
    // Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const fetchTourData = async () => {
      if (!id) {
        setError("Tour ID is required");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await tourApi.getTourById(id);
        if (response.success && response.data) {
          const transformedData = {
            id: response.data.id || response.data._id,
            title: response.data.title || response.data.name,
            subtitle:
              response.data.subtitle ||
              (response.data.description
                ? response.data.description.substring(0, 100) + "..."
                : ""),
            location:
              response.data.location ||
              `${response.data.city || ""}, ${response.data.country || ""}`.replace(
                ", ,",
                ""
              ),
            duration: response.data.duration,
            price: Number(response.data.price) || 0,
            rating: response.data.rating || 4.5,
            reviewCount: response.data.reviewCount || 0,
            maxGroupSize: response.data.maxGroupSize || 20,
            heroImage: response.data.heroImage || [],
            images: response.data.images || [],
            overview: {
              description:
                response.data.description ||
                response.data.overview?.description ||
                "",
              features:
                response.data.features ||
                response.data.overview?.features ||
                [],
            },
            itinerary: response.data.itinerary || [],
            inclusions: response.data.inclusions || [],
            exclusions: response.data.exclusions || [],
            notes: response.data.notes || [],
            bookingInfo: response.data.bookingInfo || {},
            availableDates: response.data.availableDates || [],
            ...response.data,
          };
          setTourData(transformedData);
        } else {
          throw Error(
            response.error || response.message || "Failed to fetch tour details"
          );
        }
      } catch (err: any) {
        console.error("Error fetching tour data:", err);
        setError(
          err && typeof err === 'object' && 'message' in err
            ? (err as { message: string }).message
            : "Failed to load tour details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [id]);

  const toggleAccordion = (dayIndex: number) => {
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };

  const truncateText = (text: string, maxLength = 280) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  // Show loading state
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

  // Show error state
  if (error) {
    return <Error error={error} />;
  }

  // Show not found state
  if (!tourData) {
    return <TourNotFound />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <TourHeader tourData={tourData} />

        {/* Available Dates & Slots Info */}
        {tourData.availableDates && tourData.availableDates.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 pt-4">
            <div className="bg-white rounded-xl shadow border border-gray-100 p-4 mb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-emerald-700 flex items-center gap-2">
                    <span>Available Dates & Slots</span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {tourData.availableDates.map((date: any, idx: number) => {
                      const start = new Date(String(date.startDate));
                      const end = new Date(String(date.endDate));
                      return (
                        <div key={idx} className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 flex flex-col items-start min-w-[180px]">
                          <div className="font-medium text-gray-900">
                            {start.toLocaleDateString()} - {end.toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-600 mb-1">
                            Slots Left: <span className="font-semibold">{date.slotsLeft ?? (date.availableSlots - date.bookedSlots)}</span> / <span className="font-semibold">{date.totalSlots ?? date.availableSlots}</span>
                          </div>
                          {date.isRecurringInstance && (
                            <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold mt-1">Recurring</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* PDF Download Button */}
                {tourData.pdf && (
                  <div className="flex-shrink-0">
                    <a
                      href={tourData.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Tour PDF
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Content Area */}
            <MainContent
              tourData={tourData}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              expandedDay={expandedDay}
              toggleAccordion={toggleAccordion}
              showFullDescription={showFullDescription}
              setShowFullDescription={setShowFullDescription}
              showAllNotes={showAllNotes}
              setShowAllNotes={setShowAllNotes}
              truncateText={truncateText}
            />

            {/* Booking Card */}
            <BookingCard tourData={tourData} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TourDetails;
