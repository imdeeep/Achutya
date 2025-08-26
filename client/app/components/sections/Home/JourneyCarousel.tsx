import { useState, useEffect } from "react";
import { Link } from "react-router";
import { destinationApi } from "~/services/userApi";
import SectionHeader from "~/components/ui/SectionHeader";
import LoadingSpinner from "~/components/ui/LoadingSpinner";
import Container from "~/components/ui/Container";

interface Destination {
  _id: string;
  name: string;
  country: string;
  countryName?: string;
  image: string;
  heroImage?: string;
  city?: string;
}

export default function JourneyCarousel() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await destinationApi.getAllDestination({ 
          isPopular: true, 
          page: 1, 
          limit: 8 
        });
        if (response.data) {
          setDestinations(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === destinations.length - 4 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? destinations.length - 4 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <section className="py-20">
        <Container>
          <SectionHeader
            title="JOURNEY IN FRAMES"
            subtitle="Pictures Perfect Moments"
          />
          <LoadingSpinner size="md" />
        </Container>
      </section>
    );
  }

  const visibleDestinations = destinations.slice(currentIndex, currentIndex + 4);

  return (
    <section className="py-20">
      <Container>
        <SectionHeader
          title="JOURNEY IN FRAMES"
          subtitle="Pictures Perfect Moments"
        />

        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors duration-300 shadow-lg"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors duration-300 shadow-lg"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Container with Curved Perspective */}
          <div className="relative px-16">
            <div className="flex gap-6 transform perspective-1000">
              {visibleDestinations.map((destination, index) => {
                const isCenter = index === 1 || index === 2;
                const isEdge = index === 0 || index === 3;
                
                return (
                  <div
                    key={destination._id}
                    className={`flex-shrink-0 transition-all duration-500 ${
                      isCenter 
                        ? 'transform scale-100 z-20' 
                        : 'transform scale-95 z-10'
                    } ${
                      isEdge 
                        ? 'transform rotate-y-3' 
                        : ''
                    }`}
                    style={{
                      width: '280px',
                      transform: isEdge 
                        ? `perspective(1000px) rotateY(${index === 0 ? '-5deg' : '5deg'})` 
                        : 'perspective(1000px) rotateY(0deg)'
                    }}
                  >
                    <Link to={`/destinations/${destination._id}`}>
                      <div className="relative group cursor-pointer">
                        {/* Destination Image */}
                        <div className="w-full h-64 bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
                          <img
                            src={destination.image || destination.heroImage}
                            alt={destination.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                            }}
                          />
                        </div>

                        {/* Location Label */}
                        <div className="absolute bottom-4 left-4 bg-gray-800 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          {destination.city || destination.name}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(destinations.length / 4) }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * 4)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  currentIndex === i * 4 ? 'bg-teal-500' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
} 