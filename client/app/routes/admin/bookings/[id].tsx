import { useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Edit, Calendar, User, CreditCard, MapPin, Clock } from "lucide-react";

// Mock data - replace with actual API call
const booking = {
  id: 1,
  tourName: "Rajasthan Heritage Tour",
  customer: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
  },
  date: "2024-04-15",
  status: "Confirmed",
  amount: 45999,
  paymentStatus: "Paid",
  paymentMethod: "Credit Card",
  bookingDate: "2024-03-01",
  numberOfGuests: 2,
  specialRequests: "Vegetarian meals preferred",
};

export default function BookingDetail() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBooking, setEditedBooking] = useState(booking);

  const handleSave = () => {
    // Handle save logic here
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedBooking(booking);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          to="/admin/bookings"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bookings
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Booking
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tour Name</label>
                  <input
                    type="text"
                    value={editedBooking.tourName}
                    onChange={(e) => setEditedBooking({ ...editedBooking, tourName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={editedBooking.status}
                    onChange={(e) => setEditedBooking({ ...editedBooking, status: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    value={editedBooking.amount}
                    onChange={(e) => setEditedBooking({ ...editedBooking, amount: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                  <select
                    value={editedBooking.paymentStatus}
                    onChange={(e) => setEditedBooking({ ...editedBooking, paymentStatus: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tour Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Tour Name</div>
                    <div className="mt-1 text-sm text-gray-900">{booking.tourName}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Date</div>
                    <div className="mt-1 text-sm text-gray-900">
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Number of Guests</div>
                    <div className="mt-1 text-sm text-gray-900">{booking.numberOfGuests}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Special Requests</div>
                    <div className="mt-1 text-sm text-gray-900">{booking.specialRequests}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Name</div>
                    <div className="mt-1 text-sm text-gray-900">{booking.customer.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Email</div>
                    <div className="mt-1 text-sm text-gray-900">{booking.customer.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Phone</div>
                    <div className="mt-1 text-sm text-gray-900">{booking.customer.phone}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Amount</div>
                    <div className="mt-1 text-sm text-gray-900">₹{booking.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Payment Status</div>
                    <div className="mt-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.paymentStatus === "Paid" ? "bg-green-100 text-green-800" :
                        booking.paymentStatus === "Pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Payment Method</div>
                    <div className="mt-1 text-sm text-gray-900">{booking.paymentMethod}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Booking Date</div>
                    <div className="mt-1 text-sm text-gray-900">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Status</div>
                    <div className="mt-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === "Confirmed" ? "bg-green-100 text-green-800" :
                        booking.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 