import { BarChart, LineChart, PieChart } from "lucide-react";

export default function Analytics() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visualize key metrics and performance data
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Bookings Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 bg-emerald-100 rounded-full p-3 text-emerald-600">
              <BarChart className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-bold text-gray-900">Bookings Trend</h2>
              <p className="text-sm text-gray-500">Last 6 months</p>
            </div>
          </div>
          <div className="h-48 bg-gray-50 rounded-md flex items-center justify-center text-gray-400">
            {/* Placeholder for a chart library like Recharts or Chart.js */}
            <p>Bar Chart: Bookings over time</p>
          </div>
        </div>

        {/* Revenue Growth Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 text-blue-600">
              <LineChart className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-bold text-gray-900">Revenue Growth</h2>
              <p className="text-sm text-gray-500">Year-to-date</p>
            </div>
          </div>
          <div className="h-48 bg-gray-50 rounded-md flex items-center justify-center text-gray-400">
            {/* Placeholder for a chart library like Recharts or Chart.js */}
            <p>Line Chart: Revenue over time</p>
          </div>
        </div>

        {/* User Demographics Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 bg-purple-100 rounded-full p-3 text-purple-600">
              <PieChart className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-bold text-gray-900">User Demographics</h2>
              <p className="text-sm text-gray-500">By region or age group</p>
            </div>
          </div>
          <div className="h-48 bg-gray-50 rounded-md flex items-center justify-center text-gray-400">
            {/* Placeholder for a chart library like Recharts or Chart.js */}
            <p>Pie Chart: User distribution</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Key Performance Indicators (KPIs)</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">3.5%</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-sm font-medium text-gray-500">Average Booking Value</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">₹18,500</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-sm font-medium text-gray-500">Website Visitors (Monthly)</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">45,000</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-sm font-medium text-gray-500">Customer Retention</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">72%</p>
          </div>
        </div>
      </div>
    </div>
  );
} 