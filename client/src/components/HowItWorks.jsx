import React from 'react';
import Navbar from './Navabr';
import Footer from './Footer';
import { FaSearch, FaHeart, FaUsers } from 'react-icons/fa';

const HowItWorks = () => {
  return (
    <>
      <Navbar />
      <div className="bg-[#f9f8f3] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-lime-600 sm:text-5xl">
            How It Works
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            A simple, transparent, and powerful way to make a difference.
          </p>
        </div>

        <div className="mt-16 max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <FaSearch className="text-5xl text-lime-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">1. Discover a Cause</h3>
            <p className="text-gray-600">
              Browse through a wide range of verified campaigns. Find a cause that resonates with you, from education and healthcare to disaster relief and animal welfare.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <FaHeart className="text-5xl text-lime-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">2. Make a Donation</h3>
            <p className="text-gray-600">
              Our secure payment system makes it easy to contribute. Every donation, big or small, goes directly to the campaign and helps them reach their goal.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <FaUsers className="text-5xl text-lime-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">3. See Your Impact</h3>
            <p className="text-gray-600">
              Follow the progress of the campaigns you support. See updates from the creators and witness the real-world impact of your generosity.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HowItWorks;
