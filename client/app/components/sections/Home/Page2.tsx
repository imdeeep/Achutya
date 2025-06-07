import React from "react";

const Page2 = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Popular Destinations
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12">
          Explore the World's Best Destinations. Discover the most beautiful and
          exciting destinations around the world. From stunning beaches to
          majestic mountains, we have the perfect trip for you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Santorini */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="/images/santorini.jpg"
              alt="Santorini, Greece"
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  Santorini
                </h3>
                <div className="text-yellow-500">4.8</div>
              </div>
              <p className="text-gray-600">Greece</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-blue-500 font-bold">From $899 / person</p>
                <a
                  href="#"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Explore Now
                </a>
              </div>
            </div>
          </div>

          {/* Dubai */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="/images/dubai.jpg"
              alt="Dubai, United Arab Emirates"
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-800">Dubai</h3>
                <div className="text-yellow-500">4.7</div>
              </div>
              <p className="text-gray-600">United Arab Emirates</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-blue-500 font-bold">From $1299 / person</p>
                <a
                  href="#"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Explore Now
                </a>
              </div>
            </div>
          </div>

          {/* Kyoto */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="/images/kyoto.jpg"
              alt="Kyoto, Japan"
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-800">Kyoto</h3>
                <div className="text-yellow-500">4.9</div>
              </div>
              <p className="text-gray-600">Japan</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-blue-500 font-bold">From $1099 / person</p>
                <a
                  href="#"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Explore Now
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <a
            href="#"
            className="text-blue-500 hover:text-blue-600 font-semibold"
          >
            View All Destinations
          </a>
        </div>
      </div>
    </section>
  );
};

export default Page2;
