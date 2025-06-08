import { Mountain } from "lucide-react";
import Layout from "~/components/layout/Layout";

const TourNotFound = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8">
          <Mountain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tour Not Found
          </h2>
          <p className="text-gray-600">
            The tour you're looking for doesn't exist.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TourNotFound;
