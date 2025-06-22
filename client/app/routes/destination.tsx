import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";
import { MapPin, ChevronDown } from "lucide-react";
import Layout from "~/components/layout/Layout";
import FilterComponent from "~/components/ui/FilterComponent";
import TourCards from "~/components/ui/TourCards";
import { countryData } from "~/lib/tour.data";
import { tourApi } from "~/services/userApi";

const TourDestination = () => {
  const { slug } = useParams();
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("q");

  const [isExpanded, setIsExpanded] = useState(false);
  const [destinationData, setDestinationData] = useState<any>(null);
  const [toursData, setToursData] = useState<any[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [duration, setDuration] = useState<[number, number]>([1, 14]);
  const [budget, setBudget] = useState<[number, number]>([0, 9999999]);

  useEffect(() => {
    const getTourByDestination = async () => {
      if (!id) return;
      try {
        const response = await tourApi.getTourByDestination(id);
        if (response?.success) {
          setDestinationData(response.data.destination);
          setToursData(response.data.tours);

          const country = response.data.destination.country;
          setSelectedCountry(country);
        }
      } catch (err) {
        console.error("API fetch error:", err);
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

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero */}
        <div
          className="relative h-80 bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              destinationData?.heroImage || destinationData?.image
            })`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-2 drop-shadow-lg">
                {destinationName}
              </h1>
              <div className="inline-flex items-center bg-[#339966] border border-white/20 text-white px-2 py-1 rounded-full text-sm font-medium">
                <MapPin className="w-4 h-4 mr-1" />
                {destinationData?.country || "Unknown Country"}
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        {destinationData && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  About {destinationName}
                </h2>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  {isExpanded ? "Show Less" : "Show More"}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
              <p
                className={`text-gray-600 leading-relaxed ${
                  !isExpanded ? "line-clamp-2" : ""
                }`}
              >
                {destinationData.description}
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
                countryData={countryData}
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
        )}
      </div>
    </Layout>
  );
};

export default TourDestination;
