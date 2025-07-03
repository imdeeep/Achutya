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
            // Add any other fields that your UI components expect
            ...response.data,
          };
          setTourData(transformedData);
        } else {
          throw new Error(
            response.error || response.message || "Failed to fetch tour details"
          );
        }
      } catch (err) {
        console.error("Error fetching tour data:", err);
        setError(
          err instanceof Error
            ? err.message
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
