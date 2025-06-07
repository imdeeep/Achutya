import { div } from "framer-motion/client";
import React from "react";
import Layout from "~/components/layout/Layout";

const tourdetails = () => {
  return (
    <div>
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen text-black">
          <h1 className="text-4xl font-bold mb-4">Tour Details</h1>
          <p className="text-lg">
            Details about the selected tour will be displayed here.
          </p>
        </div>
      </Layout>
    </div>
  );
};

export default tourdetails;
