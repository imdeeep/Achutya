import { useState } from "react";
import Page1 from "~/components/sections/Home/Page1";
import Layout from "../components/layout/Layout";
import { Link } from "react-router";
import { useEffect } from "react";
import { tourApi } from "~/services/adminApi";
import FeaturedBlogs from "~/components/blogs/BlogSection";
import PopularDestinations from "~/components/sections/Home/PopularDestinations";
import ContactSection from "~/components/sections/Home/ContactSection";
import JourneyCarousel from "~/components/sections/Home/JourneyCarousel";
import Button from "~/components/ui/Button";
import SectionHeader from "~/components/ui/SectionHeader";
import Card from "~/components/ui/Card";
import Container from "~/components/ui/Container";

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
        const response = await tourApi.getTopFeaturedTours();
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
      <section className="py-20 bg-white">
        <Container>
          <SectionHeader
            title="Featured Tours"
            subtitle="Handpicked experiences designed to give you the best of each destination"
          />
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
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center">
            <div className="text-red-500 mb-4">Error: {error}</div>
            <Button
              onClick={() => window.location.reload()}
              variant="primary"
              size="md"
            >
              Retry
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionHeader
          title="Featured Tours"
          subtitle="Handpicked experiences designed to give you the best of each destination"
        />

        {tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <Card key={tour._id} shadow="xl" hover={true}>
                <Link
                  to={`/tour?q=${tour._id}`}
                  className="block"
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
                      <h3 className="sm:text-2xl font-bold truncate text-wrap">{tour.title}</h3>
                      <div className="flex items-center justify-between text-sm mt-3 w-full">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-white mr-1" fill="currentColor" viewBox="0 0 24 24">
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
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600">No featured tours available at the moment.</p>
          </div>
        )}
      </Container>
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
    <section className="py-20 bg-gray-50">
      <Container>
        <SectionHeader
          title="What Our Travelers Say"
          subtitle="Real experiences from real adventurers"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} shadow="lg" hover={true}>
              <div className="p-8">
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-6 h-6 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 mb-6 text-lg leading-relaxed">"{testimonial.content}"</p>

                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-20 bg-teal-600 text-white text-center">
      <Container size="md">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Start Your Next Adventure?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of travelers who have discovered incredible destinations with us
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            href="/destinations"
            variant="primary"
            size="lg"
            className="bg-white text-teal-600 hover:bg-gray-100"
          >
            Explore Tours
          </Button>
          <Button
            href="/contact"
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-teal-600"
          >
            Contact Us
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <Page1 />

      {/* Journey in Frames Carousel */}
      {/* <JourneyCarousel /> */}

      {/* Featured Tours */}
      <FeaturedTours />

      {/* Popular Destinations */}
      <PopularDestinations />
      
      {/* Featured Blogs */}
      <section className="py-20 bg-white">
        <Container>
          <SectionHeader
            title="Featured Blogs"
            subtitle="Discover travel stories, tips, and insights from our adventure experts"
          />
          <FeaturedBlogs />
          <div className="text-center mt-12">
            <Button
              href="/our-blogs"
              variant="primary"
              size="lg"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              }
              iconPosition="right"
            >
              View All Blogs
            </Button>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Contact Section */}
      <ContactSection />

      {/* Ready to Start Your Next Adventure? */}
      <CTASection />
    </Layout>
  );
}
