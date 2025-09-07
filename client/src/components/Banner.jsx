import React from 'react';
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    // Uses the new vector landscape SVG as the background
    <div className="relative h-screen bg-cover bg-center flex items-center" style={{ backgroundImage: "url('/hero-landscape.svg')" }}>
      {/* A subtle overlay to help text stand out */}
      <div className="absolute inset-0 bg-brand-primary opacity-20"></div>
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        {/* Text is styled with the new brand colors for better contrast */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 text-brand-primary [text-shadow:0_2px_4px_rgb(255_255_255_/_0.5)]">
          India's Most Trusted Crowdfunding Platform
        </h1>
        <p className="text-lg md:text-xl mb-8 text-brand-text-light">
          Raise funds for medical emergencies and social causes, with 0% platform fees.
        </p>
        <Link
          to="/start-campaign"
          className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
        >
          Start a Fundraiser for FREE
        </Link>
        {/* Social proof section with updated text color */}
        <div className="mt-12 flex justify-center items-center space-x-8 md:space-x-12 text-brand-text">
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

