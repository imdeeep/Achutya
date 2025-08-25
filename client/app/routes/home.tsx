import { useState } from "react";
import Page1 from "~/components/sections/Home/Page1";
import Layout from "../components/layout/Layout";
import { Link } from "react-router";
import { useEffect } from "react";
import { tourApi } from "~/services/adminApi";
import FeaturedBlogs from "~/components/blogs/BlogSection";
import PopularDestinations from "~/components/sections/Home/PopularDestinations";
import ContactSection from "~/components/sections/Home/ContactSection";

interface TourFormData {
  _id: string;
  rating: number;
  reviewCount: number;
  reviews: string[];
  title: string;
  isFeatured?: boolean;
  subtitle: string;
  description: string;
  image: string;
  heroImage: string;
  duration: string;
  price: number;
  originalPrice: number;
  discount: number;
  groupType: string;
  maxGroupSize: number;
  difficulty: string;
  destination: { _id: string; name: string; city: string; country: string } | string;
  country: string;
  city: string;
  location: string;
  additionalDestinations: string[];
  availableDates: AvailableDate[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  essentials: string[];
  notes: string[];
  features: Feature[];
  itinerary: DayItinerary[];
  isActive: boolean;
  slug: string;
}
interface AvailableDate {
  startDate: string;
  endDate: string;
  price: number;
  availableSlots: number;
  bookedSlots: number;
  isAvailable: boolean;
  notes?: string;
}

interface Feature {
  title: string;
  description: string;
}
interface DayItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  distance?: string;
  duration?: string;
  accommodation: string;
  meals: string;
}

export function meta({ }) {
  return [
    { title: "Achyuta - Discover Your Next Adventure" },
    {
      name: "description",
      content:
        "Achyuta is your ultimate travel companion. Explore the world's most breathtaking destinations and plan unforgettable journeys.",
    },
  ];
}
function FeaturedTours() {
  const [tours, setTours] = useState<TourFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        setLoading(true);
        const response = await tourApi.getTopFeaturedTours(); // Use the API endpoint we created
        if (response.success) {
          setTours(response.data);
        } else {
          throw new Error(response.error || "Failed to fetch featured tours");
        }
      } catch (err: any) {
        console.error("Error fetching featured tours:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTours();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Tours
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Loading featured tours...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="animate-pulse">
                  <div className="bg-gray-200 h-48 w-full"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#277A55] text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Tours
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked experiences designed to give you the best of each
            destination
          </p>
        </div>

        {tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <div
                key={tour._id}
                className="relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">

                <Link
                  to={`/tour?q=${tour._id}`}
                  className=""
                >
                  {/* Tour Image */}
                  <div className="relative">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
                    />

                    {/* Discount Badge */}
                    <div className="absolute top-3 right-3 bg-yellow-400 text-black px-3 py-1 text-xs font-semibold rounded-full shadow-lg">
                      <span className="line-through text-red-600 mr-1">₹{tour.originalPrice?.toLocaleString()}</span>
                      ₹{tour.price?.toLocaleString()}/- Onwards
                    </div>
                  </div>

                  {/* Bottom Text Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/30 to-transparent px-4 py-4 text-white">
                    <div className="flex flex-col items-center justify-between mb-2 mt-24">
                      <h3 className=" sm:text-2xl font-bold truncate text-wrap">{tour.title}</h3>
                      <div className="flex items-center justify-between text-sm mt-3 w-full">
                        <div className="flex items-center ">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 11H5v2h14v-2z" />
                          </svg>
                          <span>{tour.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.14 2 5 5.14 5 9c0 3.25 4.27 8.24 6.39 10.69a1.01 1.01 0 001.22.16c.12-.06.23-.14.32-.25C14.73 17.24 19 12.25 19 9c0-3.86-3.14-7-7-7z" />
                          </svg>
                          <span>{tour.city || tour.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 10h10v2H7z" />
                          </svg>
                          <span>
                            {new Date(
                              tour.availableDates?.find((d) => d.isAvailable)?.startDate || ''
                            ).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                    </Link>
              </div>

            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600">No featured tours available at the moment.</p>
          </div>
        )}
        <div className="text-center">
          {/* <Link
            to="/tours/featured"
            className="inline-block mt-6 text-[#277A55] font-semibold hover:underline"
          >
            View All Featured Tours →
          </Link> */}
        </div>
      </div>
    </section>
  );
}

// Testimonials
function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      content:
        "Amazing experience with Achyuta! The trip to Himachal was perfectly organized.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Rajesh Kumar",
      content:
        "Professional service and unforgettable memories. Highly recommend!",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Anita Patel",
      content:
        "Kerala backwaters tour was magical. Everything was perfectly planned.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">What Our Travelers Say</h2>
          <p className="text-gray-600">
            Real experiences from real adventurers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-700 mb-4">"{testimonial.content}"</p>

              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <h4 className="font-semibold">{testimonial.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-20 bg-[#277A55] text-white text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Start Your Next Adventure?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of travelers who have discovered incredible
          destinations with us
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-[#277A55] px-8 py-3 rounded-full font-semibold hover:bg-gray-100">
            Explore Tours
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#277A55]">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <Page1 />

      {/* Featured Tours */}
      <FeaturedTours />

      {/* Popular Destinations */}
      <PopularDestinations />
      <h1 className="text-3xl font-bold text-black text-center my-8">
        Featured Blogs
      </h1>
      <FeaturedBlogs />
      <div className="text-center mt-8 mb-12">
        <Link
          to="/our-blogs"
          className="inline-flex items-center px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
        >
          View All Blogs
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
      {/* Testimonials */}
      <Testimonials />


      {/* Contact Section */}
      <ContactSection />

      {/* Ready to Start Your Next Adventure? */}
      <CTASection />
    </Layout>
  );
}
