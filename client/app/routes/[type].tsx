import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { tourApi } from "~/services/userApi";
import { Link } from "react-router";

export default function TypeToursPage() {
  const { type } = useParams();
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type) return;
    setLoading(true);
    setError(null);
    tourApi.getToursByTypes([decodeURIComponent(type as string)])
      .then((res) => {
        setTours(res.data || []);
      })
      .catch((err) => {
        setError("Failed to load tours");
      })
      .finally(() => setLoading(false));
  }, [type]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-emerald-700">
        {type ? decodeURIComponent(type as string) : "Tours"}
      </h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && tours.length === 0 && (
        <div>No tours found for this type.</div>
      )}
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
            <h2 className="text-lg font-semibold text-gray-900 mb-1 truncate">
              {tour.title}
            </h2>
            <div className="text-sm text-gray-500 mb-1">
              {tour.location || tour.city}
            </div>
            <div className="text-emerald-600 font-bold">
              ₹{tour.price ? (tour.price / 1000).toFixed(0) + 'K' : 'N/A'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 