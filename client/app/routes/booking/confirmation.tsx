import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { Calendar, Users, Download } from "lucide-react";
import Layout from "~/components/layout/Layout";

interface BookingDetails {
  bookingId: string;
  itineraryName: string;
  date: string;
  guests: number;
  amount: number;
  status: string;
}

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookingId = searchParams.get("bookingId");
    if (!bookingId) {
      setLoading(false);
      return;
    }

    // TODO: Replace with actual API call
    // For now, using mock data
    setBookingDetails({
      bookingId,
      itineraryName: "Rajasthan Heritage Tour",
      date: new Date().toLocaleDateString(),
      guests: 2,
      amount: 91998,
      status: "Confirmed"
    });
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </Layout>
    );
  }

  if (!bookingDetails) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
            <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist or has been removed.</p>
            <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Return to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600">Your tour has been successfully booked.</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Booking ID</span>
                  <span className="font-medium text-gray-900">{bookingDetails.bookingId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tour Package</span>
                  <span className="font-medium text-gray-900">{bookingDetails.itineraryName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {bookingDetails.date}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Number of Guests</span>
                  <span className="font-medium text-gray-900 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {bookingDetails.guests}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="font-medium text-gray-900">₹{bookingDetails.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                    {bookingDetails.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  A confirmation email has been sent to your registered email address. Please keep your booking ID for future reference.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/"
                  className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 text-center"
                >
                  Return to Home
                </Link>
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingConfirmation; 