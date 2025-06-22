import { useState, useEffect } from "react";
import Layout from "~/components/layout/Layout";
import ProtectedRoute from "~/components/ProtectedRoute";
import { bookingApi } from "~/services/userApi";
import { useAuth } from "~/hooks/auth";
import { Link, useNavigate } from "react-router";

const Booking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAllUserBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingApi.getUserBooking(user.id);
        console.log(response.data);
        setBookings(response.data || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      getAllUserBookings();
    }
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="text-black min-h-screen">
            <div className="container mx-auto px-4 py-8">
              <div className="bg-white rounded-2xl p-8">
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="text-black min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  My Bookings
                </h1>
                <p className="text-gray-600">
                  Welcome back, {user?.name}! Here are your booking details.
                </p>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <div className="border-t border-gray-200 pt-6">
                {bookings.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      No Bookings Found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      You haven't made any bookings yet. Start exploring our
                      amazing destinations!
                    </p>
                    <button
                      onClick={() => navigate("/")}
                      className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
                    >
                      Explore Destinations
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex-1">
                            <div className="flex items-start space-x-4">
                              <img
                                src={booking.tour.image}
                                alt={booking.tour.title}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                  {booking.tour.title}
                                </h3>
                                <p className="text-gray-600 mb-2">
                                  Booking ID: {booking.bookingId}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                      booking.status
                                    )}`}
                                  >
                                    {booking.status}
                                  </span>
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                                      booking.paymentStatus
                                    )}`}
                                  >
                                    Payment {booking.paymentStatus}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 lg:mt-0 lg:ml-6 lg:text-right">
                            <div className="text-2xl font-bold text-gray-800 mb-1">
                              {formatCurrency(booking.totalAmount)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {booking.numberOfGuests} Guest{booking.numberOfGuests > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Tour Dates:</span>
                              <div className="text-gray-600">
                                {formatDate(booking.tourDate.startDate)} - {formatDate(booking.tourDate.endDate)}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Booking Date:</span>
                              <div className="text-gray-600">
                                {formatDate(booking.bookingDate)}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Primary Contact:</span>
                              <div className="text-gray-600">
                                {booking.primaryContact.name}
                                <br />
                                {booking.primaryContact.phone}
                              </div>
                            </div>
                          </div>

                          {booking.tour.duration && (
                            <div className="mt-3 text-sm">
                              <span className="font-medium text-gray-700">Duration:</span>
                              <span className="text-gray-600 ml-1">
                                {booking.tour.duration} days
                              </span>
                            </div>
                          )}

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Link
                              to = {`/booking?bId=${booking.bookingId}`}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              View Details
                            </Link>
                            
                             
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Booking;