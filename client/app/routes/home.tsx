import { useState } from "react";
import Page1 from "~/components/sections/Home/Page1";
import Layout from "../components/layout/Layout";
import { Link } from "react-router";

export function meta({}) {
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
  const tours = [
    {
      title: "Rajasthan Heritage Tour",
      location: "Rajasthan",
      duration: "10 days, 9 nights",
      price: "₹45,999",
      rating: 4.6,
      reviews: 128,
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Kerala Backwater Experience",
      location: "Kerala",
      duration: "6 days, 5 nights",
      price: "₹32,999",
      rating: 4.7,
      reviews: 94,
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Himalayan Trekking Adventure",
      location: "Himachal",
      duration: "12 days, 11 nights",
      price: "₹89,999",
      rating: 4.9,
      reviews: 67,
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center">
                  <svg
                    className="w-4 h-4 text-yellow-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-black font-medium">
                    {tour.rating}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 12.414a1 1 0 00-.293-.293L17.657 7.586A8 8 0 1016.243 6.172l-4.828 4.828a1 1 0 00-.293.293L7.586 6.757a8 8 0 1010.071 9.9z"
                    />
                  </svg>
                  {tour.location}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {tour.title}
                </h3>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {tour.duration}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[#277A55]">
                      {tour.price}
                    </span>
                    <p className="text-sm text-gray-500">per person</p>
                  </div>
                  <Link
                    to={`/tour?id=2`}
                    className="bg-[#277A55] hover:bg-[#1e5c41] text-white px-6 py-2 rounded-full font-semibold transition-colors duration-200"
                  >
                    Book Now
                  </Link>
                </div>

                <div className="flex items-center mt-3 text-sm text-gray-500">
                  <span>({tour.reviews} reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Popular Destinations
function PopularDestinations() {
  const destinations = [
    {
      name: "Himachal Pradesh",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tours: "15 Tours",
    },
    {
      name: "Kerala",
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tours: "12 Tours",
    },
    {
      name: "Rajasthan",
      image:
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tours: "18 Tours",
    },
    {
      name: "Goa",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tours: "8 Tours",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Popular Destinations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover amazing places and create unforgettable memories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{dest.name}</h3>
                  <p className="text-sm opacity-90">{dest.tours}</p>
                </div>
              </div>
            </div>
          ))}
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

      {/* Testimonials */}
      <Testimonials />

      {/* Ready to Start Your Next Adventure? */}
      <CTASection />
    </Layout>
  );
}
