import { useState, useEffect } from "react";
import Layout from "~/components/layout/Layout";
import ProtectedRoute from "~/components/ProtectedRoute";
import { bookingApi } from "~/services/userApi";
import { useAuth } from "~/hooks/auth";
import { Link, useLocation, useNavigate } from "react-router";

// Type definitions
interface User {
  id: string;
  // Add other user properties as needed
}

interface Tour {
  id: string;
  title: string;
  subtitle: string;
  heroImage?: string;
  image?: string;
  duration: string;
  location: string;
  groupType: string;
  difficulty: string;
  rating: number;
  reviewCount: number;
  discount: number;
  originalPrice: number;
  price: number;
}

interface TourDate {
  startDate: string;
  endDate: string;
  availableSlots: number;
  bookedSlots: number;
}

interface PrimaryContact {
  name: string;
  phone: string;
  email: string;
}

interface BookingData {
  bookingId: string;
  status: string;
  numberOfGuests: number;
  pricePerPerson: number;
  totalAmount: number;
  paidAmount: number;
  refundAmount: number;
  bookingDate: string;
  confirmationDate: string;
  tour: Tour;
  tourDate: TourDate;
  primaryContact: PrimaryContact;
}

interface Payment {
  status: string;
  paymentMethod: string;
  transactionId: string;
  paymentDate: string;
  amount: number;
}

interface BookingResponse {
  booking: BookingData;
  payment: Payment;
}

const Booking: React.FC = () => {
  const { user }: { user: User | null } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const bookingId: string | null = searchParams.get("bId");
  
  const [bookingData, setBookingData] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<boolean>(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

  useEffect(() => {
    const getSingleBooking = async (id: string): Promise<void> => {
      try {
        setLoading(true);
        const response = await bookingApi.getSingleBooking(id);
        console.log(response.data);
        setBookingData(response.data);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    if (!bookingId) {
      setError("No booking ID provided");
      setLoading(false);
      return;
    }

    if (user?.id) {
      getSingleBooking(bookingId);
    }
  }, [bookingId, user]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingId) return;
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
    setCancelling(true);
    setCancelError(null);
    setCancelSuccess(null);
    try {
      const response = await bookingApi.cancelBooking(bookingId, {});
      setCancelSuccess('Booking cancelled successfully. Refund (if any) will be processed.');
      // Refresh booking data
      if (user?.id) {
        const refreshed = await bookingApi.getSingleBooking(bookingId);
        setBookingData(refreshed.data);
      }
    } catch (err: any) {
      setCancelError(err?.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
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
          <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Not Found</h3>
                  <p className="text-gray-600 mb-6">{error || "The booking you're looking for doesn't exist."}</p>
                  <Link
                    to="/bookings"
                    className="inline-flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors duration-200"
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
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <button
                    onClick={() => navigate('/bookings')}
                    className="flex items-center text-emerald-600 hover:text-emerald-700 mb-4 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Bookings
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">Booking Details</h1>
                  <p className="text-sm text-gray-500">Booking ID: {booking.bookingId}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                    Payment {payment.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tour Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Tour Details Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Tour Information</h2>
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={booking.tour.heroImage || booking.tour.image}
                      alt={booking.tour.title}
                      className="w-full md:w-64 h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{booking.tour.title}</h3>
                      <p className="text-gray-600 mb-4">{booking.tour.subtitle}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Duration:</span>
                          <div className="text-gray-600 mt-1">{booking.tour.duration}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Location:</span>
                          <div className="text-gray-600 mt-1">{booking.tour.location}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Group Type:</span>
                          <div className="text-gray-600 mt-1">{booking.tour.groupType}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Difficulty:</span>
                          <div className="text-gray-600 mt-1">{booking.tour.difficulty}</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(booking.tour.rating) ? 'text-amber-400' : 'text-gray-300'}`}
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
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Tour Schedule</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Start Date</h4>
                      <p className="text-gray-600">{formatDate(booking.tourDate.startDate)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                      <h4 className="font-medium text-gray-900 mb-2">End Date</h4>
                      <p className="text-gray-600">{formatDate(booking.tourDate.endDate)}</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-emerald-50 rounded-lg border border-emerald-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-emerald-900">Available Slots</h4>
                        <p className="text-emerald-700">{booking.tourDate.availableSlots} slots remaining</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-emerald-900">Booked Slots</h4>
                        <p className="text-emerald-700">{booking.tourDate.bookedSlots} slots booked</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Primary Contact</h4>
                      <p className="text-gray-600">{booking.primaryContact.name}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Phone</h4>
                      <p className="text-gray-600">{booking.primaryContact.phone}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Email</h4>
                      <p className="text-gray-600 break-all">{booking.primaryContact.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Summary Sidebar */}
              <div className="space-y-6">
                {/* Booking Summary */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Number of Guests</span>
                      <span className="font-semibold text-gray-900">{booking.numberOfGuests}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price per Person</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(booking.pricePerPerson)}</span>
                    </div>
                    {booking.tour.discount > 0 && (
                      <div className="flex justify-between items-center text-emerald-600">
                        <span>Discount ({booking.tour.discount}%)</span>
                        <span className="font-semibold">-{formatCurrency((booking.tour.originalPrice - booking.tour.price) * booking.numberOfGuests)}</span>
                      </div>
                    )}
                    <hr className="border-gray-200" />
                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                      <span>Total Amount</span>
                      <span>{formatCurrency(booking.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-600">
                      <span>Paid Amount</span>
                      <span className="font-semibold">{formatCurrency(booking.paidAmount)}</span>
                    </div>
                    {booking.refundAmount > 0 && (
                      <div className="flex justify-between items-center text-blue-600">
                        <span>Refund Amount</span>
                        <span className="font-semibold">{formatCurrency(booking.refundAmount)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-600 block text-sm">Payment Method</span>
                      <span className="font-semibold text-gray-900">{payment.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block text-sm">Transaction ID</span>
                      <span className="font-semibold text-gray-900 text-sm break-all">{payment.transactionId}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block text-sm">Payment Date</span>
                      <span className="font-semibold text-gray-900">{formatDateTime(payment.paymentDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block text-sm">Amount Paid</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Timeline */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Timeline</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Booking Created</h4>
                        <p className="text-gray-500 text-sm">{formatDateTime(booking.bookingDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Payment Completed</h4>
                        <p className="text-gray-500 text-sm">{formatDateTime(payment.paymentDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Booking Confirmed</h4>
                        <p className="text-gray-500 text-sm">{formatDateTime(booking.confirmationDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="space-y-3">
                    <button 
                      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                      type="button"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Invoice
                    </button>
                    <button 
                      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                      type="button"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Contact Support
                    </button>
                    {booking.status.toLowerCase() === 'confirmed' && (
                      <button 
                        className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
                        type="button"
                        onClick={handleCancelBooking}
                        disabled={cancelling}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
                {cancelSuccess && (
                  <div className="mt-2 text-green-600 text-sm text-center">{cancelSuccess}</div>
                )}
                {cancelError && (
                  <div className="mt-2 text-red-600 text-sm text-center">{cancelError}</div>
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