import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";
import { MapPin, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import Layout from "~/components/layout/Layout";
import FilterComponent from "~/components/ui/FilterComponent";
import TourCards from "~/components/ui/TourCards";
import { tourApi } from "~/services/userApi";

const TourDestination = () => {
  const { slug } = useParams();
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("q");

  const [isExpanded, setIsExpanded] = useState(false);
  const [destinationData, setDestinationData] = useState<any>(null);
  const [toursData, setToursData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [duration, setDuration] = useState<[number, number]>([1, 14]);
  const [budget, setBudget] = useState<[number, number]>([0, 9999999]);

  useEffect(() => {
    const getTourByDestination = async () => {
      if (!id) {
        setIsLoading(false);
        setError("No destination ID provided");
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const response = await tourApi.getTourByDestination(id);
        
        if (response?.success) {
          setDestinationData(response.data.destination);
          setToursData(response.data.tours || []);

          const country = response.data.destination?.country;
          if (country) {
            setSelectedCountry(country);
          }
        } else {
          setError("Failed to load destination data");
        }
      } catch (err) {
        console.error("API fetch error:", err);
        setError("Something went wrong while loading the destination");
      } finally {
        setIsLoading(false);
      }
    };
    
    getTourByDestination();
  }, [id]);

  const destinationName =
    destinationData?.name?.trim() ||
    (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "") ||
    "Destination";

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN").format(price);

  const filteredTours = toursData.filter((tour) => {
    const tourDuration = parseInt(tour.duration?.split(" ")[0]) || 0;

    const matchesCountry =
      selectedCountry === "All" || tour.country === selectedCountry;
    const matchesCities =
      selectedCities.length === 0 || selectedCities.includes(tour.city);
    const matchesDuration =
      tourDuration >= duration[0] && tourDuration <= duration[1];
    const matchesBudget = tour.price >= budget[0] && tour.price <= budget[1];

    return matchesCountry && matchesCities && matchesDuration && matchesBudget;
  });

  const clearFilters = () => {
    setSelectedCities([]);
    setDuration([1, 14]);
    setBudget([0, 9999999]);
    setSelectedCountry(destinationData?.country || "All");
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen animate-pulse">
      {/* Hero skeleton */}
      <div className="h-80 bg-gradient-to-br from-emerald-400 to-emerald-600">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-16 w-64 bg-white/20 rounded-lg mb-4 mx-auto"></div>
            <div className="h-8 w-32 bg-white/20 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="min-h-screen">
      <div className="relative h-80 bg-gradient-to-br from-emerald-400 to-emerald-600">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-2 drop-shadow-lg">
              {destinationName}
            </h1>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 py-2 rounded-full text-sm font-medium">
              <MapPin className="w-4 h-4 mr-1" />
              Destination
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Tours Available
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            There are no tours available for this specific destination right now. 
            Please check back later or explore other destinations.
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <LoadingSkeleton />
      </Layout>
    );
  }

  // Show error state or no tours available
  if (error || !destinationData || toursData.length === 0) {
    return (
      <Layout>
        <ErrorState />
      </Layout>
    );
  }

  const getHeroBackground = () => {
    const imageUrl = destinationData?.heroImage || destinationData?.image;
    if (imageUrl) {
      return {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {
      background: 'linear-gradient(135deg,#339966 0%, #339966 50%, #339966 100%)'
    };
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero */}
        <div
          className="relative h-80"
          style={getHeroBackground()}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
                {destinationName}
              </h1>
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                <MapPin className="w-4 h-4 mr-2" />
                {destinationData?.country || "Unknown Country"}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                About {destinationName}
              </h2>
              {destinationData.description && destinationData.description.length > 150 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-teal-50 transition-colors duration-200"
                >
                  {isExpanded ? "Show Less" : "Show More"}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>
            <p
              className={`text-gray-600 leading-relaxed ${
                !isExpanded ? "line-clamp-3" : ""
              }`}
            >
              {destinationData.description || "Discover the beauty and wonder of this amazing destination."}
            </p>
          </div>

          {/* Tours Count */}
          <div className="mb-6">
            <p className="text-lg font-medium text-gray-700">
              <span className="text-teal-600 font-bold">{filteredTours.length}</span>{" "}
              {filteredTours.length === 1 ? "tour" : "tours"} available
            </p>
          </div>

          {/* Filters & Cards */}
          <div className="flex flex-col lg:flex-row gap-8">
            <FilterComponent
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedCities={selectedCities}
              setSelectedCities={setSelectedCities}
              duration={duration}
              setDuration={setDuration}
              budget={budget}
              setBudget={setBudget}
              formatPrice={formatPrice}
              filteredTours={filteredTours}
            />

            <TourCards
              filteredTours={filteredTours}
              selectedDate={""}
              formatPrice={formatPrice}
              clearFilters={clearFilters}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TourDestination;