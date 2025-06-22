import { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Thermometer, DollarSign, Globe, Calendar, Eye, Plus } from 'lucide-react';
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
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Explore Destinations
                </h1>
                <p className="text-gray-600 text-sm">
                  Discover amazing places around the world
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
            
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, country, or highlights..."
                  className="w-full pl-9 pr-4 text-black py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="md:w-48">
                <select
                  value={selectedCountryType}
                  onChange={(e) => setSelectedCountryType(e.target.value)}
                  className="w-full px-3 py-2.5 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-sm"
                >
                  {getCountryTypes().map((type) => (
                    <option key={type} value={type}>
                      {type === 'All' ? 'All Countries' : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 text-sm">
              Showing {filteredDestinations.length} of {destinations.length} destinations
            </p>
          </div>
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
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDestinations.map((destination) => (
                <div
                  key={destination._id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={destination.heroImage || destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          destination.country === 'International'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        <Globe size={10} className="mr-1" />
                        {destination.country}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
                        {highlightSearchTerm(destination.name, searchQuery)}
                      </h3>
                      <div className="flex items-center text-gray-600 text-xs">
                        <MapPin size={12} className="mr-1" />
                        {highlightSearchTerm(destination.countryName, searchQuery)}
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
                      {highlightSearchTerm(destination.description, searchQuery)}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-start text-xs text-gray-600">
                        <Calendar size={10} className="mr-1.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900 text-xs">Best Time</div>
                          <div className="text-xs">{formatBestTime(destination.bestTimeToVisit)}</div>
                        </div>
                      </div>
                      <div className="flex items-start text-xs text-gray-600">
                        <Thermometer size={10} className="mr-1.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900 text-xs">Climate</div>
                          <div className="text-xs line-clamp-1">{destination.climate}</div>
                        </div>
                      </div>
                      <div className="flex items-start text-xs text-gray-600">
                        <Clock size={10} className="mr-1.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900 text-xs">Time Zone</div>
                          <div className="text-xs">{formatTimeZone(destination.timeZone)}</div>
                        </div>
                      </div>
                      <div className="flex items-start text-xs text-gray-600">
                        <DollarSign size={10} className="mr-1.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900 text-xs">Currency</div>
                          <div className="text-xs line-clamp-1">{destination.currency}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        to={`/destination/${destination.name}?q=${destination._id}`}
                        className="flex-1 bg-emerald-600 text-white text-center py-1.5 px-3 rounded-md hover:bg-emerald-700 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <Eye size={12} />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}   
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Destinations;