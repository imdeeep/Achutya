import React, { useState } from "react";
import { useParams } from "react-router";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Clock,
  IndianRupee,
  ChevronDown,
  Filter,
} from "lucide-react";
import Layout from "~/components/layout/Layout";
import FilterComponent from "~/components/ui/FilterComponent";
import TourCards from "~/components/ui/TourCards";
import DateSection from "~/components/ui/DateSection";
import { tours, months, monthDates, countryData } from "~/lib/tour.data";

const TourDestination = () => {
  const { slug } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Jun-25");
  const [selectedDate, setSelectedDate] = useState("");
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [duration, setDuration] = useState<[number, number]>([1, 14]);
  const [budget, setBudget] = useState<[number, number]>([8000, 300000]);

  const destination = slug
    ? slug.charAt(0).toUpperCase() + slug.slice(1)
    : "Destination";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  const handleMonthClick = (month: any) => {
    setSelectedMonth(month);
    if (expandedMonth === month) {
      setExpandedMonth(null);
      setSelectedDate("");
    } else {
      setExpandedMonth(month);
    }
  };

  const filteredTours = tours.filter((tour) => {
    const tourDuration = parseInt(tour.duration.split(" ")[0]);
    const matchesCountry = tour.country === selectedCountry;
    const matchesCities =
      selectedCities.length === 0 || selectedCities.includes(tour.city);

    return (
      matchesCountry &&
      matchesCities &&
      tourDuration >= duration[0] &&
      tourDuration <= duration[1] &&
      tour.price >= budget[0] &&
      tour.price <= budget[1]
    );
  });

  const clearFilters = () => {
    setSelectedCities([]);
    setDuration([1, 14]);
    setBudget([8000, 300000]);
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Header */}
        <div
          className="relative h-80 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.pexels.com/photos/4428291/pexels-photo-4428291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-2 drop-shadow-lg">
                {destination}
              </h1>
              <div className="inline-flex items-center bg-[#339966] border border-white/20 text-white px-2 py-1 rounded-full text-sm font-medium">
                <MapPin className="w-4 h-4 mr-1" />
                India
              </div>
            </div>
          </div>
        </div>

        {/* Date Selection Bar */}
        <DateSection
          selectedMonth={selectedMonth}
          selectedDate={selectedDate}
          expandedMonth={expandedMonth}
          handleMonthClick={handleMonthClick}
          setSelectedDate={setSelectedDate}
          months={months}
          monthDates={monthDates}
        />

        {/* About Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-2xl font-bold text-gray-900">
                About {destination}
              </h2>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                {isExpanded ? "Show Less" : "Show More"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>
            <div
              className={`text-gray-600 leading-relaxed ${!isExpanded ? "line-clamp-2" : ""}`}
            >
              <p className="text-base">
                {destination} is a beautiful destination in India known for its
                rich cultural heritage, stunning landscapes, and vibrant local
                life.
                {!isExpanded && "..."}
              </p>
              {isExpanded && (
                <p className=" text-base">
                  Visitors can explore ancient temples, bustling markets, and
                  experience authentic Indian cuisine. The region's unique blend
                  of traditional and modern elements creates an unforgettable
                  experience for travelers seeking adventure and cultural
                  immersion.
                </p>
              )}
            </div>
          </div>

          {/* Enhanced Main Content Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
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

            {/* Tour Cards Grid */}
            <TourCards
              filteredTours={filteredTours}
              selectedDate={selectedDate}
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
