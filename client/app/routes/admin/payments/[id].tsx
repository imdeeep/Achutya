import { useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Edit, CreditCard, Calendar, User, Receipt } from "lucide-react";

// Mock data - replace with actual API call
const payment = {
  id: 1,
  bookingId: "BK001",
  customer: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
  },
  amount: 45999,
  date: "2024-03-15",
  status: "Completed",
  paymentMethod: "Credit Card",
  transactionId: "TXN123456",
  cardLast4: "4242",
  cardBrand: "Visa",
  refundAmount: 0,
  refundReason: "",
  notes: "Payment processed successfully",
};

export default function PaymentDetail() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPayment, setEditedPayment] = useState(payment);

  const handleSave = () => {
    // Handle save logic here
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPayment(payment);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          to="/admin/payments"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Payments
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Payment
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={editedPayment.status}
                    onChange={(e) => setEditedPayment({ ...editedPayment, status: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Refund Amount</label>
                  <input
                    type="number"
                    value={editedPayment.refundAmount}
                    onChange={(e) => setEditedPayment({ ...editedPayment, refundAmount: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Refund Reason</label>
                  <textarea
                    value={editedPayment.refundReason}
                    onChange={(e) => setEditedPayment({ ...editedPayment, refundReason: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={editedPayment.notes}
                    onChange={(e) => setEditedPayment({ ...editedPayment, notes: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Booking ID</div>
                    <div className="mt-1 text-sm text-gray-900">{payment.bookingId}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Transaction ID</div>
                    <div className="mt-1 text-sm text-gray-900">{payment.transactionId}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Amount</div>
                    <div className="mt-1 text-sm text-gray-900">₹{payment.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Date</div>
                    <div className="mt-1 text-sm text-gray-900">
                      {new Date(payment.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Status</div>
                    <div className="mt-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === "Completed" ? "bg-green-100 text-green-800" :
                        payment.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                        payment.status === "Failed" ? "bg-red-100 text-red-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Name</div>
                    <div className="mt-1 text-sm text-gray-900">{payment.customer.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Email</div>
                    <div className="mt-1 text-sm text-gray-900">{payment.customer.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Phone</div>
                    <div className="mt-1 text-sm text-gray-900">{payment.customer.phone}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Payment Method</div>
                    <div className="mt-1 text-sm text-gray-900">{payment.paymentMethod}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Card Details</div>
                    <div className="mt-1 text-sm text-gray-900">
                      {payment.cardBrand} ending in {payment.cardLast4}
                    </div>
                  </div>
                  {payment.refundAmount > 0 && (
                    <>
                      <div>
                        <div className="text-sm font-medium text-gray-500">Refund Amount</div>
                        <div className="mt-1 text-sm text-gray-900">₹{payment.refundAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">Refund Reason</div>
                        <div className="mt-1 text-sm text-gray-900">{payment.refundReason}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Notes</div>
                    <div className="mt-1 text-sm text-gray-900">{payment.notes}</div>
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