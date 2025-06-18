import Layout from "~/components/layout/Layout";
import ProtectedRoute from "~/components/ProtectedRoute";

const booking = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="text-black min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  My Bookings
                </h1>
                <p className="text-gray-600">
                  Welcome back,! Here are your booking details.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    No Bookings Found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You haven't made any bookings yet. Start exploring our
                    amazing destinations!
                  </p>
                  <a
                    href="/"
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
                  >
                    Explore Destinations
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default booking;
