import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Calendar, MapPin, Clock, Users, Star } from "lucide-react";

interface TourDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  maxGroupSize: number;
  rating: number;
  reviews: number;
  images: string[];
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
}

export default function TourDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState<TourDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    // In a real application, you would fetch the tour details from your backend
    // For now, we'll use mock data
    setTour({
      id: id || "1",
      title: "Rajasthan Heritage Tour",
      description: "Experience the royal heritage of Rajasthan with our carefully curated tour package. Visit magnificent palaces, ancient forts, and vibrant markets while immersing yourself in the rich culture and traditions of this majestic state.",
      price: 45999,
      duration: "10 days, 9 nights",
      location: "Rajasthan",
      maxGroupSize: 15,
      rating: 4.6,
      reviews: 128,
      images: [
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      highlights: [
        "Visit the magnificent Amber Fort in Jaipur",
        "Experience the desert safari in Jaisalmer",
        "Explore the beautiful Lake Palace in Udaipur",
        "Shop at traditional markets and bazaars",
        "Enjoy cultural performances and local cuisine"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival in Jaipur",
          description: "Arrive at Jaipur International Airport. Transfer to hotel and evening at leisure."
        },
        {
          day: 2,
          title: "Jaipur City Tour",
          description: "Visit City Palace, Hawa Mahal, and Jantar Mantar. Evening shopping at local markets."
        },
        // Add more days as needed
      ]
    });
    setLoading(false);
  }, [id]);

  const handleBooking = () => {
    if (!selectedDate) {
      alert("Please select a date for your tour");
      return;
    }

    const totalAmount = tour?.price ? tour.price * guests : 0;
    navigate(`/payment?itineraryId=${id}&amount=${totalAmount}&date=${selectedDate}&guests=${guests}`);
  };

  if (loading || !tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tour details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh]">
        <img
          src={tour.images[0]}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-4xl font-bold mb-4">{tour.title}</h1>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{tour.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>Max {tour.maxGroupSize} people</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                <span>{tour.rating} ({tour.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Tour</h2>
              <p className="text-gray-600 mb-6">{tour.description}</p>
              
              <h3 className="text-xl font-bold mb-4">Highlights</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                {tour.highlights.map((highlight, index) => (
                  <li key={index} className="text-gray-600">{highlight}</li>
                ))}
              </ul>

              <h3 className="text-xl font-bold mb-4">Itinerary</h3>
              <div className="space-y-6">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="border-l-4 border-emerald-500 pl-4">
                    <h4 className="font-bold">Day {day.day}: {day.title}</h4>
                    <p className="text-gray-600 mt-2">{day.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-emerald-600 mb-2">
                  ₹{tour.price.toLocaleString()}
                </h3>
                <p className="text-gray-500">per person</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests
                  </label>
                  <select
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {[...Array(tour.maxGroupSize)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Price per person</span>
                    <span>₹{tour.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Number of guests</span>
                    <span>{guests}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Total Amount</span>
                    <span>₹{(tour.price * guests).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  className="w-full bg-emerald-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 