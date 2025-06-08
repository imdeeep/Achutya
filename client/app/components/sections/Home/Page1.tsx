import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Page1 = () => {
  const [currentSubheading, setCurrentSubheading] = useState(0);
  const [currentDestination, setCurrentDestination] = useState(0);

  const subheadings = [
    "Create Unforgettable Memories",
    "Discover Amazing Destinations",
    "Connect with Fellow Adventurers",
    "Explore the World Together",
  ];

  const destinations = [
    "Bali",
    "America",
    "Himachal",
    "Switzerland",
    "Thailand",
    "Dubai",
  ];

  useEffect(() => {
    const subheadingInterval = setInterval(() => {
      setCurrentSubheading((prev) => (prev + 1) % subheadings.length);
    }, 3000);

    const destinationInterval = setInterval(() => {
      setCurrentDestination((prev) => (prev + 1) % destinations.length);
    }, 1500);

    return () => {
      clearInterval(subheadingInterval);
      clearInterval(destinationInterval);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full  overflow-hidden">
      <motion.div
        initial={{ scale: 1.2 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/2131856/pexels-photo-2131856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
        }}
      />

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center md:-translate-y-10">
        <div className="">
          <motion.p
            key={currentSubheading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white text-lg md:text-2xl font-medium"
          >
            {subheadings[currentSubheading]}
          </motion.p>
        </div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white text-4xl md:text-5xl lg:text-7xl font-bold mb-8  leading-tight"
        >
          Adventure Awaits, <span style={{ color: "#2ca36e" }}>Explore</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-lg"
        >
          <div className="relative bg-white rounded-md shadow-2xl overflow-hidden">
            <div className="flex items-center px-2 py-2">
              <svg
                className="text-gray-400 w-5 h-5 mr-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

              <div className="flex-1">
                <input
                  type="text"
                  className="w-full text-gray-700 text-lg bg-transparent border-none outline-none"
                  placeholder={`Search for ${destinations[currentDestination]}`}
                />
              </div>

              <button
                className="ml-4 p-2 rounded text-white transition-all duration-300 hover:shadow-lg flex-shrink-0 cursor-pointer"
                style={{ backgroundColor: "#277a55" }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Page1;
