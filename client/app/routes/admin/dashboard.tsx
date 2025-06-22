import React, { useState, useEffect } from "react";
import {
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { statsApi } from "~/services/adminApi";

interface UserStats {
  total: number;
  admins: number;
  normalUsers: number;
  latest: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
}

interface TourStats {
  total: number;
  averageRating: number;
  topRated: Array<{
    _id: string;
    title: string;
    slug: string;
    rating: number;
  }>;
}

interface DestinationStats {
  total: number;
  india: number;
  international: number;
  recent: Array<{
    _id: string;
    name: string;
    country: string;
    countryName: string;
    image: string;
    createdAt: string;
  }>;
}

interface PaymentStats {
  revenue: number;
  success: number;
}

interface BookingStats {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  recent: Array<{
    _id: string;
    bookingId: string;
    tourName: string;
    userName: string;
    status: string;
    totalAmount: number;
    bookingDate: string;
    primaryContact: {
      name: string;
      email: string;
      phone: string;
    };
    tour: {
      title: string;
    };
    numberOfGuests: number;
    paymentStatus: string;
  }>;
}

interface StatsData {
  users: UserStats;
  tours: TourStats;
  destinations: DestinationStats;
  payments: PaymentStats;
  bookings: BookingStats;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await statsApi();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      setError("Failed to fetch stats");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "text-emerald-600 bg-emerald-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "completed":
        return "text-blue-600 bg-blue-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Users Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.users.total}
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-xs text-gray-500">
                    {stats.users.admins} Admins
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {stats.users.normalUsers} Users
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Tours Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tours</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.tours.total}
                </p>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-600">
                    {stats.tours.averageRating} avg rating
                  </span>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <Package className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Destinations Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Destinations
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.destinations.total}
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-xs text-gray-500">
                    {stats.destinations.india} India
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {stats.destinations.international} International
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatCurrency(stats.payments.revenue)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-sm text-emerald-600">
                    {stats.payments.success} payments
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Rated Tours */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Top Rated Tours
            </h3>
            <div className="space-y-4">
              {stats.tours.topRated.map((tour, index) => (
                <div
                  key={tour._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-emerald-600">
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {tour.title}
                      </h4>
                      <p className="text-sm text-gray-500 capitalize">
                        {tour.slug.replace(/-/g, " ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">
                      {tour.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Destinations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Recent Destinations
            </h3>
            <div className="space-y-4">
              {stats.destinations.recent.slice(0, 3).map((destination) => (
                <div
                  key={destination._id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900">
                      {destination.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {destination.countryName}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Added {formatDate(destination.createdAt)}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        {stats.bookings.recent.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Bookings
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Total: {stats.bookings.total}</span>
                  <span>•</span>
                  <span>Cancelled: {stats.bookings.cancelled}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Booking ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Tour
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.bookings.recent.map((booking) => (
                      <tr
                        key={booking._id}
                        className="border-b border-gray-100"
                      >
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm text-gray-600">
                            {booking.bookingId.slice(0, 8)}...
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {booking.primaryContact.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.primaryContact.email}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-900">{booking.tour.title}</p>
                          <p className="text-sm text-gray-500">
                            {booking.numberOfGuests} guests
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900">
                            {formatCurrency(booking.totalAmount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.paymentStatus}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-900">
                            {formatDate(booking.bookingDate)}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Latest Users */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Latest Users
            </h3>
            <div className="space-y-4">
              {stats.users.latest.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
