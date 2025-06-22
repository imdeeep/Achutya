import { useState, useEffect } from "react";
import Layout from "~/components/layout/Layout";
import ProtectedRoute from "~/components/ProtectedRoute";
import { bookingApi } from "~/services/userApi";
import { useAuth } from "~/hooks/auth";
import { Link, useLocation, useNavigate } from "react-router";

const Booking = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const bookingId = searchParams.get("bId");
  
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSingleBooking = async () => {
      try {
        setLoading(true);
        const response = await bookingApi.getSingleBooking(bookingId);
        console.log(response.data);
        setBookingData(response.data);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId && user?.id) {
      getSingleBooking();
    }
  }, [bookingId, user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="text-black min-h-screen">
            <div className="container mx-auto px-4 py-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
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

  if (error || !bookingData) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="text-black min-h-screen">
            <div className="container mx-auto px-4 py-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Booking Not Found</h3>
                  <p className="text-gray-600 mb-4">{error || "The booking you're looking for doesn't exist."}</p>
                  <Link
                    to={'/bookings'}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
                  >
                    Back to Bookings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const { booking, payment } = bookingData;

  return (
    <ProtectedRoute>
      <Layout>
        <div className="text-black min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <button
                    onClick={() => navigate('/bookings')}
                    className="flex items-center text-emerald-600 hover:text-emerald-700 mb-4"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Bookings
                  </button>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Details</h1>
                  <p className="text-gray-600">Booking ID: {booking.bookingId}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getPaymentStatusColor(payment.status)}`}>
                    Payment {payment.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tour Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Tour Details Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Tour Information</h2>
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={booking.tour.heroImage || booking.tour.image}
                      alt={booking.tour.title}
                      className="w-full md:w-64 h-48 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{booking.tour.title}</h3>
                      <p className="text-gray-600 mb-4">{booking.tour.subtitle}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Duration:</span>
                          <div className="text-gray-600">{booking.tour.duration}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Location:</span>
                          <div className="text-gray-600">{booking.tour.location}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Group Type:</span>
                          <div className="text-gray-600">{booking.tour.groupType}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Difficulty:</span>
                          <div className="text-gray-600">{booking.tour.difficulty}</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(booking.tour.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {booking.tour.rating} ({booking.tour.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tour Dates */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Tour Schedule</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Start Date</h4>
                      <p className="text-gray-600">{formatDate(booking.tourDate.startDate)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">End Date</h4>
                      <p className="text-gray-600">{formatDate(booking.tourDate.endDate)}</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-emerald-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-emerald-800">Available Slots</h4>
                        <p className="text-emerald-600">{booking.tourDate.availableSlots} slots remaining</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-800">Booked Slots</h4>
                        <p className="text-emerald-600">{booking.tourDate.bookedSlots} slots booked</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Primary Contact</h4>
                      <p className="text-gray-600">{booking.primaryContact.name}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Phone</h4>
                      <p className="text-gray-600">{booking.primaryContact.phone}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Email</h4>
                      <p className="text-gray-600">{booking.primaryContact.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Summary Sidebar */}
              <div className="space-y-6">
                {/* Booking Summary */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of Guests</span>
                      <span className="font-semibold">{booking.numberOfGuests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per Person</span>
                      <span className="font-semibold">{formatCurrency(booking.pricePerPerson)}</span>
                    </div>
                    {booking.tour.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({booking.tour.discount}%)</span>
                        <span className="font-semibold">-{formatCurrency((booking.tour.originalPrice - booking.tour.price) * booking.numberOfGuests)}</span>
                      </div>
                    )}
                    <hr className="border-gray-200" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span>{formatCurrency(booking.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Paid Amount</span>
                      <span className="font-semibold">{formatCurrency(booking.paidAmount)}</span>
                    </div>
                    {booking.refundAmount > 0 && (
                      <div className="flex justify-between text-blue-600">
                        <span>Refund Amount</span>
                        <span className="font-semibold">{formatCurrency(booking.refundAmount)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-600 block">Payment Method</span>
                      <span className="font-semibold">{payment.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Transaction ID</span>
                      <span className="font-semibold text-sm break-all">{payment.transactionId}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Payment Date</span>
                      <span className="font-semibold">{formatDateTime(payment.paymentDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Amount Paid</span>
                      <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Timeline */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Timeline</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Booking Created</h4>
                        <p className="text-gray-600 text-sm">{formatDateTime(booking.bookingDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Payment Completed</h4>
                        <p className="text-gray-600 text-sm">{formatDateTime(payment.paymentDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Booking Confirmed</h4>
                        <p className="text-gray-600 text-sm">{formatDateTime(booking.confirmationDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="space-y-3">
                    <button className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors">
                      Download Invoice
                    </button>
                    <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
                      Contact Support
                    </button>
                    {booking.status.toLowerCase() === 'confirmed' && (
                      <button className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors">
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Booking;