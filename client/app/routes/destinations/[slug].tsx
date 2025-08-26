import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { destinationApi } from "~/services/userApi";
import { MapPin, Clock, Thermometer, DollarSign, Globe, Calendar, Star, Users, ArrowLeft, ArrowRight } from "lucide-react";
import Layout from "~/components/layout/Layout";

export default function DestinationSlugPage() {
  const { slug } = useParams();
  const [destination, setDestination] = useState<any>(null);
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    destinationApi.getDestinationBySlug(slug as string)
      .then(res => {
        setDestination(res.data.destination);
        setTours(res.data.tours || []);
      })
      .catch(() => setError("Failed to load destination"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading destination...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🌍</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!destination) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Destination not found</h1>
            <p className="text-gray-600 mb-6">The destination you're looking for doesn't exist.</p>
            <Link
              to="/destinations"
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Browse All Destinations
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(0)}K`;
    }
    return `₹${price}`;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-96 lg:h-[500px] overflow-hidden">
        <img
          src={destination.heroImage || destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link
            to="/destinations"
            className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 rounded-lg hover:bg-white transition-all duration-200 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Destinations
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                destination.country === 'International' 
                  ? 'bg-blue-500/90 text-white' 
                  : 'bg-green-500/90 text-white'
              }`}>
                <Globe className="w-4 h-4 mr-1" />
                {destination.country}
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                {destination.countryName}
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
              {destination.name}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 max-w-3xl leading-relaxed">
              {destination.description}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Destination Details */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About {destination.name}</h2>
              
              {destination.highlights?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {destination.highlights.map((highlight: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg border border-teal-100">
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {destination.description && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {destination.description}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar - Quick Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Info</h3>
                
                <div className="space-y-4">
                  {destination.bestTimeToVisit && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">Best Time to Visit</div>
                        <div className="text-sm text-gray-600">{destination.bestTimeToVisit}</div>
                      </div>
                    </div>
                  )}

                  {destination.climate && (
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <Thermometer className="w-5 h-5 text-orange-600" />
                      <div>
                        <div className="font-medium text-gray-900">Climate</div>
                        <div className="text-sm text-gray-600">{destination.climate}</div>
                      </div>
                    </div>
                  )}

                  {destination.currency && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">Currency</div>
                        <div className="text-sm text-gray-600">{destination.currency}</div>
                      </div>
                    </div>
                  )}

                  {destination.timeZone && (
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-medium text-gray-900">Time Zone</div>
                        <div className="text-sm text-gray-600">{destination.timeZone}</div>
                      </div>
                    </div>
                  )}

                  {destination.language && (
                    <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                      <Globe className="w-5 h-5 text-indigo-600" />
                      <div>
                        <div className="font-medium text-gray-900">Language</div>
                        <div className="text-sm text-gray-600">{destination.language}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tours Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Tours in {destination.name}
              </h2>
              <p className="text-gray-600 text-lg">
                Discover amazing experiences and adventures
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-teal-600">{tours.length}</div>
              <div className="text-sm text-gray-500">Available Tours</div>
            </div>
          </div>

          {tours.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No tours found</h3>
              <p className="text-gray-600 mb-6">
                We don't have any tours available for this destination yet.
              </p>
              <Link
                to="/destinations"
                className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
              >
                Explore Other Destinations
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <Link
                  key={tour._id}
                  to={`/tour?q=${tour._id}`}
                  className="group block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={tour.image || tour.heroImage}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {tour.isFeatured && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                        {tour.duration || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium">
                        {tour.groupType || 'Group Tour'}
                      </span>
                      {tour.maxGroupSize && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          Max {tour.maxGroupSize}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                      {tour.title}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{tour.location || tour.city || 'N/A'}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">
                          {tour.rating || 4.5} ({tour.reviewCount || 0} reviews)
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-teal-600">
                          {formatPrice(tour.price)}
                        </div>
                        {tour.originalPrice && tour.originalPrice > tour.price && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(tour.originalPrice)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{tour.groupType || 'Group'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{tour.duration || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center text-teal-600 group-hover:text-teal-700 transition-colors">
                      <span className="text-sm font-medium">View Details</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-3xl text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore {destination.name}?</h2>
          <p className="text-xl mb-8 opacity-90">
            Book your next adventure and create unforgettable memories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/destinations"
              className="bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore More Destinations
            </Link>
            <Link
              to="/tour"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition-colors"
            >
              Browse All Tours
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
} 