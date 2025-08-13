import React from "react";
import { FaSearch, FaHeart, FaPlus } from "react-icons/fa";

const AboutSection = () => {
  return (
    <div className="flex flex-col">
      {/* About Section */}
      <section className="bg-white text-center py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#8DBD40] mb-4">
          About Seed The Change
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700 mb-12">
          We believe in the power of collective action to create meaningful
          change. Our platform connects passionate donors with verified social
          and humanitarian causes, ensuring every contribution makes a real
          difference in communities that need it most.
        </p>

        {/* Features */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-12">
          <div className="flex flex-col items-center">
            <div className="bg-[#EEF5DC] p-4 rounded-full text-[#8DBD40] text-2xl">
              <FaSearch />
            </div>
            <h3 className="mt-3 font-medium text-gray-800">Explore</h3>
            <p className="text-sm text-gray-500">Discover verified campaigns</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-[#EEF5DC] p-4 rounded-full text-[#8DBD40] text-2xl">
              <FaHeart />
            </div>
            <h3 className="mt-3 font-medium text-gray-800">How it Works</h3>
            <p className="text-sm text-gray-500">Simple, transparent giving</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-[#EEF5DC] p-4 rounded-full text-[#8DBD40] text-2xl">
              <FaPlus />
            </div>
            <h3 className="mt-3 font-medium text-gray-800">
              Start Your Campaign
            </h3>
            <p className="text-sm text-gray-500">
              Create impact in your community
            </p>
          </div>
        </div>
      </section>

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
