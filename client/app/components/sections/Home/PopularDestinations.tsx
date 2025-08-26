import { useEffect, useState } from "react";
import { Link } from "react-router";
import { destinationApi } from "~/services/userApi";
import Button from "~/components/ui/Button";
import SectionHeader from "~/components/ui/SectionHeader";
import LoadingSpinner from "~/components/ui/LoadingSpinner";
import Card from "~/components/ui/Card";
import Container from "~/components/ui/Container";

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

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <Container>
          <SectionHeader
            title="Popular Destinations"
            subtitle="Discover amazing places and create unforgettable memories"
          />
          <LoadingSpinner size="md" />
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
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
    <section className="py-20 bg-gray-50">
      <Container>
        <SectionHeader
          title="Popular Destinations"
          subtitle="Discover amazing places and create unforgettable memories"
        />
        
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.map((dest, index) => (
                <div key={dest._id || index} className="group cursor-pointer">
                  <Link to={`/destinations/${dest._id}`}>
                    <Card shadow="lg" hover={true}>
                      <div className="relative overflow-hidden">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-bold">{dest.name}</h3>
                          <p className="text-sm opacity-90">{dest.tours ? `${dest.tours} Tours` : ''}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-3">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="primary"
                  size="md"
                >
                  Previous
                </Button>
                <span className="px-6 py-3 bg-white rounded-lg border border-gray-200 text-gray-700 font-medium">
                  Page {page} of {totalPages}
                </span>
                <Button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  variant="primary"
                  size="md"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
  