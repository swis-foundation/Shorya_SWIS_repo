import React from 'react';
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <div className="relative h-screen bg-cover bg-center flex items-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop')" }}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          India's Most Trusted Crowdfunding Platform
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Raise funds for medical emergencies and social causes, with 0% platform fees.
        </p>
        <Link
          to="/start-campaign"
          className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
        >
          Start a Fundraiser for FREE
        </Link>
        <div className="mt-12 flex justify-center items-center space-x-8 md:space-x-12">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold">8 Lakh+</p>
            <p className="text-sm">Donations</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold">2 Lakh+</p>
            <p className="text-sm">Campaigns</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold">₹2000 Cr+</p>
            <p className="text-sm">Raised</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;

