import { useEffect, useState } from "react";
import { Link } from "react-router";
import { destinationApi } from "~/services/userApi";

export default function PopularDestinations() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    destinationApi
      .getAllDestination({ isPopular: true, page, limit: 8 })
      .then((res) => {
        setDestinations(res.data || []);
        setTotalPages(res.pages || 1);
      })
      .catch(() => setError("Failed to load popular destinations"))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Popular Destinations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover amazing places and create unforgettable memories
          </p>
        </div>
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.map((dest, index) => (
                <div key={dest._id || index} className="group cursor-pointer">
                  <Link to={`/destinations/${dest._id}`}>
                  <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{dest.name}</h3>
                      <p className="text-sm opacity-90">{dest.tours ? `${dest.tours} Tours` : ''}</p>
                    </div>
                  </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded bg-emerald-600 text-white disabled:bg-gray-300"
              >
                Previous
              </button>
              <span className="px-4 py-2">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded bg-emerald-600 text-white disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
  