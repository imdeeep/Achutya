import Layout from "../components/layout/Layout";

export function meta({}) {
  return [
    { title: "Achutya - Discover Your Next Adventure" },
    {
      name: "description",
      content:
        "Achutya is your ultimate travel companion. Explore the world's most breathtaking destinations and plan unforgettable journeys.",
    },
  ];
}

export default function Home() {
  return (
    <Layout>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[100vh] sm:h-[90vh]"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
            Discover the World's Most Breathtaking Destinations
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            Unforgettable journeys, expertly crafted for the modern explorer.
            Find your perfect trip with Wanderlux.
          </p>
          <div className="w-full max-w-md">
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                placeholder="Where are you going?"
                className="w-1/2 px-4 py-3 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Add dates"
                className="w-1/4 px-4 py-3 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Add guests"
                className="w-1/4 px-4 py-3 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="mt-4 w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Search
            </button>
          </div>
          <div className="mt-8 space-x-4">
            <button className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Popular
            </button>
            <button className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Adventure
            </button>
            <button className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Beach
            </button>
            <button className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Mountains
            </button>
            <button className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
              City Breaks
            </button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Popular Destinations
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Explore the World's Best Destinations. Discover the most beautiful
            and exciting destinations around the world. From stunning beaches to
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
                  <div className="text-yellow-500">
                    4.8
                  </div>
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
                  <div className="text-yellow-500">
                    4.7
                  </div>
                </div>
                <p className="text-gray-600">United Arab Emirates</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-blue-500 font-bold">
                    From $1299 / person
                  </p>
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
                  <div className="text-yellow-500">
                    4.9
                  </div>
                </div>
                <p className="text-gray-600">Japan</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-blue-500 font-bold">
                    From $1099 / person
                  </p>
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

     

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            What Our Travelers Say
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Real experiences from real travelers. Hear what people have to say
            about their unforgettable journeys with Wanderlux.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 italic mb-4">
                "My trip to Japan was absolutely flawless. The attention to
                detail from Wanderlux was exceptional. Every hotel, every tour
                guide, and every experience was carefully selected. I couldn't
                have asked for a better vacation!"
              </p>
              <div className="flex items-center">
                <div className="ml-4">
                  <p className="text-gray-800 font-semibold">Emma Wilson</p>
                  <p className="text-gray-600">London, UK</p>
                  <p className="text-gray-600">Trip: Japan Cultural Tour</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Start Your Next Adventure? */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Ready to Start Your Next Adventure?
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            From pristine beaches to majestic mountains, vibrant cities to
            serene countryside, we have the perfect destination waiting for you.
          </p>
          <div className="flex justify-center space-x-4 mb-8">
            <a
              href="#"
              className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Plan Your Trip
            </a>
            <a
              href="#"
              className="bg-gray-300 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Contact an Expert
            </a>
          </div>
          <div className="w-full max-w-md mx-auto">
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                placeholder="Where are you going?"
                className="w-1/2 px-4 py-3 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Add dates"
                className="w-1/4 px-4 py-3 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Add guests"
                className="w-1/4 px-4 py-3 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="mt-4 w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Find Your Perfect Trip
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}