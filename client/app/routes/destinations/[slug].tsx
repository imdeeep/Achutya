// akash bhaiya is page ka ui pure project jaisa kar dena 
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { destinationApi } from "~/services/userApi";

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

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!destination) return <div className="p-8 text-center">Destination not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row gap-8 items-start">
        <img
          src={destination.heroImage || destination.image}
          alt={destination.name}
          className="w-full md:w-96 h-64 object-cover rounded-xl shadow"
        />
        <div>
          <h1 className="text-3xl font-bold text-emerald-700 mb-2">{destination.name}</h1>
          <div className="text-gray-600 mb-2">{destination.countryName} ({destination.country})</div>
          <div className="mb-4 text-gray-700">{destination.description}</div>
          {destination.highlights?.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold text-gray-800">Highlights:</span>
              <ul className="list-disc ml-6 text-gray-600">
                {destination.highlights.map((h: string, i: number) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
          {destination.bestTimeToVisit && (
            <div className="text-sm text-gray-500 mb-1">Best time to visit: {destination.bestTimeToVisit}</div>
          )}
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-emerald-700">Tours in {destination.name}</h2>
      {tours.length === 0 ? (
        <div className="text-gray-500">No tours found for this destination.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <Link
              key={tour._id}
              to={`/tour?q=${tour._id}`}
              className="block bg-white rounded-xl shadow hover:shadow-lg transition p-4 border border-gray-100"
            >
              <img
                src={tour.image || tour.heroImage}
                alt={tour.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{tour.title}</h3>
              <div className="text-sm text-gray-500 mb-1">{tour.location || tour.city}</div>
              <div className="text-emerald-600 font-bold">
                ₹{tour.price ? (tour.price / 1000).toFixed(0) + 'K' : 'N/A'}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 