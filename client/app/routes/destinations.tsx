import { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Thermometer, DollarSign, Globe, Calendar, Eye, Plus, Star, Users, ArrowRight } from 'lucide-react';
import Layout from '~/components/layout/Layout';
import { destinationApi } from '~/services/userApi';
import { Link } from 'react-router';

interface Destination {
  _id: string;
  name: string;
  country: string;
  countryName: string;
  description: string;
  image: string;
  heroImage: string;
  highlights: string[];
  bestTimeToVisit: string;
  climate: string;
  currency: string;
  language: string;
  timeZone: string;
  isActive: boolean;
  slug: string;
  createdAt: string;
}

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryType, setSelectedCountryType] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setIsLoading(true);
      const response = await destinationApi.getAllDestination();
      if (response.success) {
        setDestinations(response.data);
        setFilteredDestinations(response.data);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setError('Failed to load destinations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    filterDestinations();
  }, [searchQuery, selectedCountryType, destinations]);

  const filterDestinations = () => {
    let filtered = destinations;

    if (searchQuery.trim()) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.highlights.some(highlight => 
          highlight.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (selectedCountryType !== 'All') {
      filtered = filtered.filter(dest => dest.country === selectedCountryType);
    }

    setFilteredDestinations(filtered);
  };

  const getCountryTypes = () => {
    const types = ['All', ...new Set(destinations.map(dest => dest.country))];
    return types;
  };

  const formatTimeZone = (timeZone: string) => {
    const match = timeZone.match(/\(([^)]+)\)/);
    return match ? match[1] : timeZone;
  };

  const formatBestTime = (bestTime: string) => {
    const months = bestTime.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/g);
    return months ? months[0] : bestTime.split(' ')[0];
  };

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Helper function to get destinations by category
  const getDestinationsByCategory = (category: string, limit?: number) => {
    let filtered = destinations;
    
    switch (category) {
      case 'International':
        filtered = destinations.filter(dest => dest.country === 'International');
        break;
      case 'India':
        filtered = destinations.filter(dest => dest.country === 'India');
        break;
      case 'Weekend':
        // For weekend trips, you might want to add a specific field in your destination model
        // For now, we'll show a subset of destinations
        filtered = destinations.slice(0, 4);
        break;
      case 'Group':
        // For group tours, you might want to add a specific field in your destination model
        // For now, we'll show a subset of destinations
        filtered = destinations.slice(0, 4);
        break;
      default:
        filtered = destinations;
    }
    
    return limit ? filtered.slice(0, limit) : filtered;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading destinations...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center py-20">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchDestinations}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Section */}
          <div className="mb-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Explore Amazing Destinations
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover incredible places around the world, from exotic international locations to beautiful destinations in India
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, country, or highlights..."
                  className="w-full pl-10 pr-4 text-black py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="md:w-48">
                <select
                  value={selectedCountryType}
                  onChange={(e) => setSelectedCountryType(e.target.value)}
                  className="w-full px-3 py-3 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                >
                  {getCountryTypes().map((type) => (
                    <option key={type} value={type}>
                      {type === 'All' ? 'All Countries' : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-gray-600">
                Showing {filteredDestinations.length} of {destinations.length} destinations
              </p>
            </div>
          </div>

          {/* All Destinations Grid */}
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No destinations found</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Try adjusting your search criteria or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCountryType('All');
                }}
                className="text-teal-600 hover:text-teal-700 font-medium text-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {filteredDestinations.map((destination) => (
                <div
                  key={destination._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={destination.heroImage || destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          destination.country === 'International'
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-500 text-white'
                        }`}
                      >
                        <Globe size={10} className="mr-1" />
                        {destination.country}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                        {highlightSearchTerm(destination.name, searchQuery)}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin size={14} className="mr-1" />
                        {highlightSearchTerm(destination.countryName, searchQuery)}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {highlightSearchTerm(destination.description, searchQuery)}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-start text-xs text-gray-600">
                        <Calendar size={12} className="mr-1.5 text-teal-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900 text-xs">Best Time</div>
                          <div className="text-xs">{formatBestTime(destination.bestTimeToVisit)}</div>
                        </div>
                      </div>
                      <div className="flex items-start text-xs text-gray-600">
                        <Thermometer size={12} className="mr-1.5 text-teal-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900 text-xs">Climate</div>
                          <div className="text-xs line-clamp-1">{destination.climate}</div>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/destinations/${destination.slug}`}
                      className="w-full bg-teal-600 text-white text-center py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Eye size={14} />
                      View Details
                    </Link>
                  </div>
                </div>
              ))}   
            </div>
          )}

          {/* Category Sections */}
          <div className="space-y-16">
            {/* International Trips Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">International Trips</h2>
                  <p className="text-gray-600">Explore exotic destinations around the world</p>
                </div>
                <Link
                  to="/destinations?country=International"
                  className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
                >
                  View All International
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getDestinationsByCategory('International', 4).map((destination) => (
                  <div
                    key={destination._id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={destination.heroImage || destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          International
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{destination.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{destination.description}</p>
                      <Link
                        to={`/destinations/${destination.slug}`}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                      >
                        Explore Destination →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* India Trips Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">India Trips</h2>
                  <p className="text-gray-600">Discover the beauty and diversity of India</p>
                </div>
                <Link
                  to="/destinations?country=India"
                  className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
                >
                  View All India
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getDestinationsByCategory('India', 4).map((destination) => (
                  <div
                    key={destination._id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={destination.heroImage || destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          India
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{destination.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{destination.description}</p>
                      <Link
                        to={`/destinations/${destination.slug}`}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                      >
                        Explore Destination →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Weekend Trips Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Weekend Trips</h2>
                  <p className="text-gray-600">Perfect getaways for your weekends</p>
                </div>
                <Link
                  to="/destinations"
                  className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
                >
                  View All Weekend
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getDestinationsByCategory('Weekend', 4).map((destination) => (
                  <div
                    key={destination._id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={destination.heroImage || destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Weekend
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{destination.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{destination.description}</p>
                      <Link
                        to={`/destinations/${destination.slug}`}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                      >
                        Explore Destination →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Group Tours Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Group Tours</h2>
                  <p className="text-gray-600">Travel together with like-minded adventurers</p>
                </div>
                <Link
                  to="/destinations"
                  className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
                >
                  View All Group Tours
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getDestinationsByCategory('Group', 4).map((destination) => (
                  <div
                    key={destination._id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={destination.heroImage || destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Group Tour
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{destination.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{destination.description}</p>
                      <Link
                        to={`/destinations/${destination.slug}`}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                      >
                        Explore Destination →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Call to Action */}
          <section className="text-center py-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-3xl text-white mt-16">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Adventure?</h2>
            <p className="text-xl mb-8 opacity-90">
              Explore our destinations and find your next unforgettable journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/tour"
                className="bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse All Tours
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Destinations;