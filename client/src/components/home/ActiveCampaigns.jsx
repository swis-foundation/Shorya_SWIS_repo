import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const ActiveCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/campaigns`);
        const data = await response.json();
        if (data.success) {
          setCampaigns(data.campaigns);
        }
      } catch (error) {
        console.error("Error fetching active campaigns:", error);
      }
    };
    fetchCampaigns();
  }, []);

  const scroll = (scrollOffset) => {
    containerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-white">
        <style>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-brand-primary">Active Campaigns</h2>
            <div>
                <button onClick={() => scroll(-300)} className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 mx-1 transition">‹</button>
                <button onClick={() => scroll(300)} className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 mx-1 transition">›</button>
            </div>
        </div>
        <div ref={containerRef} className="flex space-x-6 overflow-x-auto scrollbar-hide">
          {campaigns.map(campaign => (
            <Link to={`/campaigns/${campaign.id}`} key={campaign.id} className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <img src={`${backendUrl}/uploads/${campaign.image}`} alt={campaign.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                    <p className="text-sm font-semibold text-brand-primary">{campaign.category}</p>
                    <h3 className="font-bold text-brand-text mt-1 truncate">{campaign.title}</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2 my-2">
                        <div className="bg-brand-primary h-2 rounded-full" style={{ width: `${(campaign.raised_amount / campaign.target_amount) * 100}%` }}></div>
                    </div>
                    <p className="text-sm text-brand-text-light">
                        <span className="font-bold text-brand-text">₹{Number(campaign.raised_amount).toLocaleString()}</span> raised
                    </p>
                </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActiveCampaigns;
