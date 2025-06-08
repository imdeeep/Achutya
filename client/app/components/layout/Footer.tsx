import { useState } from "react";
import {
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

const Footer = () => {
  const footerData = {
    "International Trips": [
      "Europe",
      "Bali",
      "Vietnam",
      "Thailand",
      "Kazakhstan",
      "Singapore",
      "Bhutan",
      "Maldives",
      "Dubai",
      "Malaysia",
    ],
    "India Trips": [
      "Ladakh",
      "Spiti Valley",
      "Meghalaya",
      "Kashmir",
      "Himachal Pradesh",
      "Andaman",
      "Kerala",
      "Rajasthan",
    ],
    "Achyuta Special": [
      "Community Trips",
      "Honeymoon Trips",
      "Corporate Trips",
      "Weekend Getaways",
    ],
    "Quick Links": [
      "About Us",
      "Privacy Policy",
      "Cancellation Policy",
      "Terms & Conditions",
      "Disclaimer",
      "Blogs",
      "Payments",
    ],
  };

  const socialLinks = [
    { icon: Facebook, color: "hover:text-blue-500" },
    { icon: Instagram, color: "hover:text-pink-500" },
    { icon: Twitter, color: "hover:text-sky-500" },
    { icon: Youtube, color: "hover:text-red-500" },
  ];

  return (
    <footer
      style={{ backgroundColor: "#277A55" }}
      className="backdrop-blur border-t border-white/20"
    >
      {/* Main Footer Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* International Trips */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-white">
              International Trips
            </h3>
            <ul className="space-y-1">
              {footerData["International Trips"].map((destination) => (
                <li key={destination}>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-200 text-sm group"
                  >
                    <span className="relative after:bg-white after:transition-all group-hover:after:w-full">
                      {destination}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* India Trips */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-white">India Trips</h3>
            <ul className="space-y-1">
              {footerData["India Trips"].map((destination) => (
                <li key={destination}>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-200 text-sm group"
                  >
                    <span className="relative after:bg-white after:transition-all group-hover:after:w-full">
                      {destination}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Achyuta Special */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-white">
              Achyuta Special
            </h3>
            <ul className="space-y-1">
              {footerData["Achyuta Special"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-200 text-sm group"
                  >
                    <span className="relative after:bg-white after:transition-all group-hover:after:w-full">
                      {item}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-white">Quick Links</h3>
            <ul className="space-y-1">
              {footerData["Quick Links"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors duration-200 text-sm group"
                  >
                    <span className="relative after:bg-white after:transition-all group-hover:after:w-full">
                      {link}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Company Info Section */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="text-center space-y-4">
            {/* Company Name */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                ACHYUTA EXPERIENCES PVT LTD
              </h2>
              <p className="text-white/80 text-sm max-w-2xl mx-auto">
                3rd Floor, Building No-436, Phase IV, Udyog Vihar, Sector-18,
                Gurugram, Haryana-122015
              </p>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <a
                href="mailto:hello@Achyuta.in"
                className="flex items-center text-white/80 hover:text-white transition-colors group"
              >
                <Mail size={16} className="mr-2" />
                hello@achyuta.in
              </a>
              <div className="hidden sm:block w-px h-4 bg-white/30"></div>
              <a
                href="tel:+919090403075"
                className="flex items-center text-white/80 hover:text-white transition-colors group"
              >
                <Phone size={16} className="mr-2" />
                +91-9090403075
              </a>
              <div className="hidden sm:block w-px h-4 bg-white/30"></div>
              <a
                href="https://www.Achyuta.in"
                className="flex items-center text-white/80 hover:text-white transition-colors group"
              >
                <Globe size={16} className="mr-2" />
                www.achyuta.in
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center justify-center gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href="#"
                    className={`p-2 rounded-full bg-white/10 text-white/80 transition-all duration-200 hover:bg-white/20 hover:text-white hover:shadow-sm`}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Simple decorative border */}
      <div className="border-t border-white/20 bg-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <p className="text-center text-white/80 text-sm">
            © ACHYUTA EXPERIENCES PVT LTD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
