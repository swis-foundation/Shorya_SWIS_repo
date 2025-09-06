import React from "react";
import { FaSearch, FaHeart, FaPlus } from "react-icons/fa";

const AboutSection = () => {
  return (
    <div className="flex flex-col">
      {/* About Section */}
     
      {/* Join Section */}
      <section className="bg-[#f4f5ea] text-center py-12 px-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
          Join the Community
        </h2>
        <p className="text-sm max-w-xl mx-auto text-gray-600 mb-6">
          Ready to take your journey to new heights? Connect with like-minded
          individuals who share your passion for making the world a better
          place.
        </p>
        <button className="bg-[#8DBD40] text-white px-6 py-2 rounded shadow hover:bg-[#7aac39] transition duration-200">
          Sign Up
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-[#8DBD40] text-white text-center py-8 px-4">
        <div className="flex flex-col items-center">
          <span className="font-semibold mb-2">🌱 SeedTheChange</span>
          <p className="text-sm max-w-md mb-2">
            Connecting compassionate people with causes that matter. <br />
            Together, we’re building a better world.
          </p>
          <p className="text-xs text-white/80 mt-2">
            © 2024 Seed The Change. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutSection;
