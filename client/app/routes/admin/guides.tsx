import { useState } from "react";
import { Search, Edit, Trash2, Plus } from "lucide-react";

const mockGuides = [
  {
    id: "1",
    name: "Rahul Sharma",
    specialization: "Adventure Tours",
    contact: "rahul.s@example.com",
    status: "Active",
  },
  {
    id: "2",
    name: "Priya Singh",
    specialization: "Cultural Heritage",
    contact: "priya.s@example.com",
    status: "Active",
  },
  {
    id: "3",
    name: "Amit Kumar",
    specialization: "Wildlife Safaris",
    contact: "amit.k@example.com",
    status: "Inactive",
  },
];

export default function Guides() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredGuides = mockGuides.filter((guide) => {
    const matchesSearch =
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || guide.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tour Guides</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your tour guides and their availability
          </p>
        </div>
        <button
          onClick={() => console.log("Add new guide")}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Guide
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200">
          <div className="relative w-full sm:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            />
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full sm:w-auto border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          {filteredGuides.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No guides found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Specialization
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGuides.map((guide) => (
                    <tr key={guide.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {guide.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {guide.specialization}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {guide.contact}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            guide.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {guide.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => console.log("Edit guide:", guide.id)}
                          className="text-emerald-600 hover:text-emerald-900 mr-3"
                        >
                          <Edit className="w-5 h-5 inline" />
                        </button>
                        <button
                          onClick={() => console.log("Delete guide:", guide.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
