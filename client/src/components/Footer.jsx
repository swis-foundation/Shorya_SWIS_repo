import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    // MODIFIED: Changed background to brand-primary and text to a light gray
    <footer className="bg-brand-primary text-gray-200 pt-16 pb-8 px-4 sm:px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center">
          {/* Basic Info & Links Section */}
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Get in Touch
            </h3>
            <div className="text-gray-300 space-y-3">
              <p>
                <strong>Email:</strong> support@seedthechange.com
              </p>
              <p>
                <strong>Phone:</strong> +91-123-456-7890
              </p>
              <div className="flex justify-center space-x-4 mt-4 text-xl">
                {/* MODIFIED: Social icon colors updated */}
                <a href="#" className="hover:text-white transition"><FaFacebookF /></a>
                <a href="#" className="hover:text-white transition"><FaTwitter /></a>
                <a href="#" className="hover:text-white transition"><FaInstagram /></a>
                <a href="#" className="hover:text-white transition"><FaLinkedinIn /></a>
              </div>
            </div>
          </div>
        </div>

        {/* MODIFIED: Bottom border and text colors updated */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} SeedTheChange. All Rights Reserved.</p>
          <div className="mt-4 space-x-6">
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
