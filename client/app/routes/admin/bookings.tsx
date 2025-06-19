import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Search,
  Calendar,
  User,
  CreditCard,
  MapPin,
  Eye,
  X,
  CheckCircle,
  Clock,
  XCircle,
  Phone,
  Mail,
  Users,
} from "lucide-react";
import { BookingApi } from "~/services/adminApi";

interface Booking {
  _id: string;
  primaryContact: {
    name: string;
    phone: string;
    email: string;
  };
  user: any;
  tour: {
    _id: string;
    title: string;
    location: string;
    id: string;
  };
  tourDate: {
    _id: string;
    startDate: string;
    endDate: string;
  };
  numberOfGuests: number;
  totalAmount: number;
  pricePerPerson: number;
  status: string;
  paymentStatus: string;
  transactionId: string;
  paidAmount: number;
  confirmationDate: string;
  refundAmount: number;
  bookingId: string;
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingStats {
  _id: string;
  count: number;
  totalAmount: number;
}

interface ApiResponse {
  success: boolean;
  data: Booking[];
  stats: BookingStats[];
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response: ApiResponse = await BookingApi.getAllBookings();
      if (response.success) {
        setBookings(response.data);
        setStats(response.stats);
      }
    } catch (err) {
      setError("Failed to fetch bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      await BookingApi.cancelBooking(bookingId);
      fetchBookings(); // Refresh the list
    } catch (err) {
      console.error("Error canceling booking:", err);
      alert("Failed to cancel booking");
    }
  };


  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.primaryContact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || booking.status === selectedStatus;
    const matchesPaymentStatus =
      selectedPaymentStatus === "All" ||
      booking.paymentStatus === selectedPaymentStatus;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const statuses = ["All", "Confirmed", "Pending", "Completed", "Cancelled"];
  const paymentStatuses = ["All", "Completed", "Pending", "Failed", "Refunded"];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(stat._id)}`}>
                    {stat._id === "Completed" && <CheckCircle className="w-5 h-5" />}
                    {stat._id === "Pending" && <Clock className="w-5 h-5" />}
                    {stat._id === "Cancelled" && <XCircle className="w-5 h-5" />}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat._id} Bookings
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.count}
                      </div>
                      <div className="ml-2 text-sm text-gray-600">
                        {formatCurrency(stat.totalAmount)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tour name, customer, or booking ID..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              Status: {status}
            </option>
          ))}
        </select>
        <select
          value={selectedPaymentStatus}
          onChange={(e) => setSelectedPaymentStatus(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
        >
          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              Payment: {status}
            </option>
          ))}
        </select>
      </div>

      {/* Bookings Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tour Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {booking.tour.title}
                      </div>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        <div className="text-sm text-gray-500">
                          {booking.tour.location}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        ID: {booking.bookingId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <div className="text-sm font-medium text-gray-900">
                          {booking.primaryContact.name}
                        </div>
                      </div>
                      <div className="flex items-center mt-1">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <div className="text-sm text-gray-500">
                          {booking.primaryContact.email}
                        </div>
                      </div>
                      <div className="flex items-center mt-1">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <div className="text-sm text-gray-500">
                          {booking.primaryContact.phone}
                        </div>
                      </div>
                      <div className="flex items-center mt-1">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        <div className="text-sm text-gray-500">
                          {booking.numberOfGuests} guest{booking.numberOfGuests > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.tourDate.startDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          to {formatDate(booking.tourDate.endDate)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(booking.totalAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(booking.pricePerPerson)} per person
                      </div>
                      {booking.paidAmount !== booking.totalAmount && (
                        <div className="text-sm text-yellow-600">
                          Paid: {formatCurrency(booking.paidAmount)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/admin/bookings/${booking.bookingId}`}
                        className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 p-2 rounded-md transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {booking.status !== "Cancelled" && (
                        <button
                          onClick={() => handleCancelBooking(booking.bookingId)}
                          className="bg-red-100 text-red-700 hover:bg-red-200 p-2 rounded-md transition-colors"
                          aria-label="cancel"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No bookings found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}