import { useState } from "react";
import {
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  Map,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  BarChart,
  BookOpen,
  MapPin,
  Package,
  Settings,
} from "lucide-react";

const stats = [
  {
    name: "Total Bookings",
    value: "2,543",
    change: "+12.5%",
    trend: "up",
    icon: Calendar,
  },
  {
    name: "Total Users",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: Users,
  },
  {
    name: "Revenue This Month",
    value: "₹45,231",
    change: "+23.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    name: "New Signups",
    value: "156",
    change: "-2.4%",
    trend: "down",
    icon: Users,
  },
];

const topDestinations = [
  {
    name: "Goa",
    bookings: 234,
    revenue: "₹12,450",
    change: "+15.3%",
    trend: "up",
  },
  {
    name: "Kerala",
    bookings: 189,
    revenue: "₹9,850",
    change: "+8.7%",
    trend: "up",
  },
  {
    name: "Rajasthan",
    bookings: 156,
    revenue: "₹8,230",
    change: "-3.2%",
    trend: "down",
  },
  {
    name: "Himachal",
    bookings: 143,
    revenue: "₹7,450",
    change: "+12.1%",
    trend: "up",
  },
];

const recentBookings = [
  {
    id: "BK001",
    customer: "John Doe",
    destination: "Goa",
    amount: "₹12,500",
    status: "Confirmed",
    date: "2024-03-15",
  },
  {
    id: "BK002",
    customer: "Jane Smith",
    destination: "Kerala",
    amount: "₹15,800",
    status: "Pending",
    date: "2024-03-14",
  },
  {
    id: "BK003",
    customer: "Mike Johnson",
    destination: "Rajasthan",
    amount: "₹18,200",
    status: "Completed",
    date: "2024-03-13",
  },
];

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("week");

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Bookings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-emerald-100 rounded-full p-3 text-emerald-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 text-blue-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹1,23,45,678</p>
            </div>
          </div>
        </div>

        {/* Card 3: Total Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-full p-3 text-purple-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">5,678</p>
            </div>
          </div>
        </div>

        {/* Card 4: Active Itineraries */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-full p-3 text-yellow-600">
              <Package className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Active Itineraries
              </p>
              <p className="text-2xl font-bold text-gray-900">150</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Recent Activities
          </h2>
          <ul className="divide-y divide-gray-200">
            <li className="py-3 flex justify-between items-center">
              <div className="text-sm text-gray-900">
                New booking for Rajasthan Tour by John Doe
              </div>
              <div className="text-sm text-gray-500">5 mins ago</div>
            </li>
            <li className="py-3 flex justify-between items-center">
              <div className="text-sm text-gray-900">
                New user registered: Jane Smith
              </div>
              <div className="text-sm text-gray-500">1 hour ago</div>
            </li>
            <li className="py-3 flex justify-between items-center">
              <div className="text-sm text-gray-900">
                Itinerary "Kerala Backwater" updated
              </div>
              <div className="text-sm text-gray-500">1 day ago</div>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/admin/itineraries"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <Package className="w-5 h-5 mr-2" /> Manage Itineraries
            </a>
            <a
              href="/admin/bookings"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <BookOpen className="w-5 h-5 mr-2" /> View Bookings
            </a>
            <a
              href="/admin/users"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Users className="w-5 h-5 mr-2" /> Manage Users
            </a>
            <a
              href="/admin/settings"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Settings className="w-5 h-5 mr-2" /> Settings
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
