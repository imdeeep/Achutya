import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  Calendar,
  User,
  CreditCard,
  MapPin,
  Clock,
  Phone,
  Mail,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Copy,
  Download,
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

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (id) {
      fetchBooking(id);
    }
  }, [id]);

  const fetchBooking = async (bookingId: string) => {
    try {
      setLoading(true);
      const response = await BookingApi.getBookingById(bookingId);
      if (response.success) {
        setBooking(response.data.booking);
        setSelectedStatus(response.data.booking.status);
      }
    } catch (err) {
      setError("Failed to fetch booking details");
      console.error("Error fetching booking:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!booking || !selectedStatus) return;

    try {
      setUpdating(true);
      await BookingApi.updateBooking(booking._id, selectedStatus);
      setBooking({ ...booking, status: selectedStatus });
      alert("Booking status updated successfully!");
    } catch (err) {
      console.error("Error updating booking:", err);
      alert("Failed to update booking status");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      setUpdating(true);
      await BookingApi.cancelBooking(booking._id);
      setBooking({ ...booking, status: "Cancelled" });
      setSelectedStatus("Cancelled");
      alert("Booking cancelled successfully!");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking");
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
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

  if (error || !booking) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                {error || "Booking not found"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statuses = ["Confirmed", "Pending", "Completed", "Cancelled"];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <Link
          to="/admin/bookings"
          className="inline-flex items-center text-md text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bookings
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Booking Details
            </h1>
            <p className="mt-2 text-gray-600">
              Booking ID: {booking.bookingId}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => copyToClipboard(booking.bookingId)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy ID
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Status Update Section */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Status Management
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleStatusUpdate}
              disabled={updating || selectedStatus === booking.status}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Update Status
            </button>
            {booking.status !== "Cancelled" && (
              <button
                onClick={handleCancelBooking}
                disabled={updating}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tour Information */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                Tour Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Tour Name
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {booking.tour?.title || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Location
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {booking.tour?.location || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Start Date
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {booking.tourDate?.startDate
                      ? formatDate(booking.tourDate.startDate)
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    End Date
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {booking.tourDate?.endDate
                      ? formatDate(booking.tourDate.endDate)
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-emerald-600" />
                Contact Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Primary Contact
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {booking.primaryContact?.name || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Number of Guests
                  </div>
                  <div className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-emerald-600" />
                    {booking.numberOfGuests || 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Phone Number
                  </div>
                  <div className="text-lg font-semibold text-gray-900 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-emerald-600" />
                    {booking.primaryContact?.phone || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Email Address
                  </div>
                  <div className="text-lg font-semibold text-gray-900 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-emerald-600" />
                    {booking.primaryContact?.email || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-emerald-600" />
                Payment Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Total Amount
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(booking.totalAmount || 0)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Price Per Person
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(booking.pricePerPerson || 0)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Paid Amount
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    {formatCurrency(booking.paidAmount || 0)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Payment Status
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(booking.paymentStatus || "pending")}`}
                  >
                    {getStatusIcon(booking.paymentStatus || "pending")}
                    <span className="ml-1">
                      {booking.paymentStatus || "Pending"}
                    </span>
                  </span>
                </div>
                {booking.transactionId && (
                  <div className="md:col-span-2">
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Transaction ID
                    </div>
                    <div className="text-lg font-mono text-gray-900 flex items-center">
                      {booking.transactionId}
                      <button
                        onClick={() => copyToClipboard(booking.transactionId)}
                        className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                {booking.refundAmount > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Refund Amount
                    </div>
                    <div className="text-lg font-semibold text-orange-600">
                      {formatCurrency(booking.refundAmount)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Status & Timeline */}
        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">
                Current Status
              </h3>
            </div>
            <div className="p-6">
              <div className="text-center">
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(booking.status || "pending")}`}
                >
                  {getStatusIcon(booking.status || "pending")}
                  <span className="ml-2">{booking.status || "Pending"}</span>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Last updated:{" "}
                  {booking.updatedAt
                    ? formatDateTime(booking.updatedAt)
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Timeline */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-emerald-600" />
                Booking Timeline
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      Booking Created
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.bookingDate
                        ? formatDateTime(booking.bookingDate)
                        : "N/A"}
                    </div>
                  </div>
                </div>

                {booking.confirmationDate && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        Booking Confirmed
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDateTime(booking.confirmationDate)}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      Tour Scheduled
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.tourDate?.startDate && booking.tourDate?.endDate
                        ? `${formatDate(booking.tourDate.startDate)} - ${formatDate(booking.tourDate.endDate)}`
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={() =>
                  copyToClipboard(booking.primaryContact?.phone || "")
                }
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Phone className="w-4 h-4 mr-2" />
                Copy Phone Number
              </button>
              <button
                onClick={() =>
                  copyToClipboard(booking.primaryContact?.email || "")
                }
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Mail className="w-4 h-4 mr-2" />
                Copy Email
              </button>
              <button
                onClick={() => copyToClipboard(booking.transactionId || "")}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Copy Transaction ID
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
