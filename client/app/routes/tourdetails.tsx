import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import Layout from "~/components/layout/Layout";
import TourHeader from "~/components/sections/TourDetails/TourHeader";
import TourNotFound from "~/components/sections/TourDetails/TourNotFound";
import { Error } from "~/components/sections/TourDetails/Error";
import BookingCard from "~/components/sections/TourDetails/BookingCard";
import MainContent from "~/components/sections/TourDetails/MainContent";
import { itineraryApi } from "~/services/adminApi";
import { mockTourData } from "~/lib/mockTourData";
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const TourDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tourData, setTourData] = useState<any>(mockTourData);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllNotes, setShowAllNotes] = useState(false);

  useEffect(() => {
    // Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true);
        const response = await itineraryApi.getItinerary(id!);
        if (response.success) {
          // Transform the API data into the expected format
          const transformedData = {
            ...response.data,
            overview: {
              description: response.data.description,
              features: response.data.features
            },
            location: `${response.data.city}, ${response.data.country}`,
            subtitle: response.data.description.substring(0, 100) + '...',
            rating: 4.5, // Default values for now
            reviewCount: 0,
            maxGroupSize: 20,
            price: Number(response.data.price)
          };
          setTourData(transformedData);
        } else {
          throw Error(response.error || 'Failed to fetch itinerary details');
        }
      } catch (err) {
        setError("Failed to load tour details. Please try again.");
        console.error('Error fetching tour data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTourData();
    }
  }, [id]);

  const toggleAccordion = (dayIndex: number) => {
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };

  const truncateText = (text: string, maxLength = 280) => {
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
    return <Error error={error} />;
  }

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
