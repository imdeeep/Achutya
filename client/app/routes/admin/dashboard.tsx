import { Users, Calendar, TrendingUp, DollarSign } from "lucide-react";

const stats = [
  {
    name: "Total Users",
    value: "2,543",
    change: "+12.5%",
    icon: Users,
  },
  {
    name: "Active Bookings",
    value: "156",
    change: "+8.2%",
    icon: Calendar,
  },
  {
    name: "Revenue",
    value: "₹45,231",
    change: "+23.1%",
    icon: DollarSign,
  },
  {
    name: "Conversion Rate",
    value: "3.2%",
    change: "+4.3%",
    icon: TrendingUp,
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to your admin dashboard. Here's an overview of your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <stat.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-emerald-600">{stat.change}</span>
              <span className="text-sm text-gray-500"> from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <p className="text-sm text-gray-500">
              No recent activity to display.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
