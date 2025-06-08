import React from "react";
import { MapPin, Clock, Users, Star, Share2 } from "lucide-react";

import type { TourData } from "~/types/tour";

const TourHeader = ({ tourData }: { tourData: TourData }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tourData?.title,
        text: tourData?.subtitle,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };
  return (
    <div className="relative h-96 bg-gray-900">
      <img
        src="https://images.pexels.com/photos/4428291/pexels-photo-4428291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt={tourData.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-white">
          <div className="flex items-center space-x-2 mb-3">
            <MapPin className="h-5 w-5 text-[#339966]" />
            <span className="text-sm font-medium">{tourData.location}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
            {tourData.title}
          </h1>
          <p className="text-xl text-gray-200 mb-6 max-w-3xl">
            {tourData.subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="font-semibold">{tourData.rating}</span>
              <span className="text-gray-300">
                ({tourData.reviewCount} reviews)
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
              <Clock className="h-5 w-5 text-[#339966]" />
              <span>{tourData.duration}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
              <Users className="h-5 w-5 text-[#339966]" />
              <span>Max {tourData.maxGroupSize} people</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-6 right-6 flex space-x-3">
        <button
          onClick={handleShare}
          className="p-3 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white transition-all duration-200 shadow-lg"
          aria-label="Share tour"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TourHeader;
