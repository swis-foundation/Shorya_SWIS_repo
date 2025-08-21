import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const CampaignsDetails = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/campaigns`); // Use dynamic URL
        const data = await response.json();
        if (data.success) {
          setCampaigns(data.campaigns);
        } else {
          console.error("Failed to fetch campaigns:", data.message);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const progressStyle = (raised, goal) => {
    const percentage = goal > 0 ? (raised / goal) * 100 : 0;
    return { width: `${Math.min(percentage, 100)}%` };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f9f8f3]">
        Loading campaigns...
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-16 py-8 bg-[#f9f8f3] min-h-screen">
      <h1 className="text-3xl text-center font-bold text-lime-600 mb-2">
        All Campaigns
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Discover and support campaigns that are making a real difference.
      </p>

      {/* Search & Filters (unchanged for now) */}
      <div className="bg-white rounded-lg p-4 shadow mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded px-4 py-2 w-full md:w-1/2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent outline-none"
            />
          </div>
          <select className="border px-3 py-2 rounded w-full md:w-auto">
            <option>Newest</option>
            <option>Most Donated</option>
            <option>Ending Soon</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-3 mb-4">
          {[
            "Education",
            "Healthcare",
            "Food & Nutrition",
            "Environment",
            "Disaster Relief",
            "Women Empowerment",
            "Animal Welfare",
          ].map((tag, i) => (
            <button
              key={i}
              className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-lime-100"
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select className="border px-3 py-2 rounded w-full sm:w-1/3">
            <option>Select city</option>
          </select>
          <select className="border px-3 py-2 rounded w-full sm:w-1/3">
            <option>Select range</option>
          </select>
          <select className="border px-3 py-2 rounded w-full sm:w-1/3">
            <option>Select time</option>
          </select>
        </div>
      </div>

      {/* Campaign Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group relative"
          >
            <div className="relative">
              <img
                src={`${backendUrl}/uploads/${c.image}`} // Updated to use dynamic backend URL
                alt={c.title}
                className="w-full h-48 object-cover"
              />
              <span className="absolute top-2 left-2 bg-lime-600 text-white text-xs px-2 py-1 rounded">
                {c.category}
              </span>
              <div className="absolute inset-0 flex items-center justify-center bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => navigate(`/campaigns/${c.id}`)}
                  className="bg-lime-600 text-white px-4 py-2 rounded-full shadow hover:bg-lime-700"
                >
                  Donate Now
                </button>
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1">{c.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-3">
                {c.description}
              </p>
              <div className="my-3 h-2 w-full bg-gray-200 rounded-full">
                <div
                  className="h-full bg-lime-500 rounded-full"
                  style={progressStyle(c.raised_amount, c.target_amount)}
                ></div>
              </div>
              <div className="text-sm text-gray-500 mb-1">
                <strong>₹{c.raised_amount}</strong> raised of{" "}
                <strong>₹{c.target_amount}</strong>
              </div>
              <div className="text-xs text-gray-400 flex justify-between">
                <span>{c.comments || 0} comments</span>
                <span>{c.supporters} donors</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignsDetails;
