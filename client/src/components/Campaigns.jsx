import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// MODIFIED: Import icons to replace emojis.
import { FaHeart, FaClock } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // This endpoint on your server only returns campaigns with status = 'approved'
        const response = await fetch(`${backendUrl}/api/campaigns`);
        const data = await response.json();
        if (data.success) {
          // So, only approved campaigns will ever be stored in this state
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
      <div className="flex justify-center items-center h-48">
        Loading latest campaigns...
      </div>
    );
  }

  return (
    <div className="bg-[#fdfdf8] py-12 px-4 md:px-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl mt-10 font-bold text-green-700">
          Latest Campaigns
        </h2>
        <p className="text-gray-600 mt-5">
          Recently launched campaigns seeking your support to create positive
          change.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => {
          const isGoalAchieved = parseFloat(campaign.raised_amount) >= parseFloat(campaign.target_amount);
          const progressPercentage = campaign.target_amount > 0 ? ((campaign.raised_amount / campaign.target_amount) * 100).toFixed(0) : 0;

          return (
            <div
              key={campaign.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group hover:shadow-2xl hover:scale-[1.01] relative"
            >
              <div className="relative">
                <img
                  src={`${backendUrl}/uploads/${campaign.image}`}
                  alt={campaign.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null; // prevents looping
                    e.currentTarget.src = `https://placehold.co/600x400/EEE/31343C?text=${encodeURIComponent(campaign.title)}`;
                  }}
                />
                <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {campaign.category}
                </span>
                <Link
                  to={`/campaigns/${campaign.id}`}
                  className="absolute inset-0 flex items-center justify-center bg-brand-primary bg-opacity-0 hover:bg-opacity-80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <button className="bg-brand-primary hover:bg-brand-primary-hover text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Donate Now
                  </button>
                </Link>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {campaign.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {campaign.description.replace(/<[^>]*>/g, '')}
                </p>

                <div className="text-sm font-medium mb-2">
                  <span className="text-green-700">
                    ₹{Number(campaign.raised_amount).toLocaleString()}
                  </span>
                  <span className="text-gray-500">
                    {" "}
                    raised of ₹{Number(campaign.target_amount).toLocaleString()}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={progressStyle(
                      campaign.raised_amount,
                      campaign.target_amount
                    )}
                  ></div>
                </div>
                 <div className="text-right text-xs font-semibold text-brand-primary mb-2">
                    {isGoalAchieved ? "Goal Achieved!" : `${progressPercentage}% raised`}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  {/* MODIFIED: Replaced ❤️ emoji with FaHeart icon */}
                  <span className="flex items-center gap-1"><FaHeart /> {campaign.supporters} Supporters</span>
                  {/* MODIFIED: Replaced 👥 emoji with FaClock icon */}
                  <span className="flex items-center gap-1"><FaClock /> {campaign.days_left} Days Left</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <Link to="/campaigns">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition">
            Explore More
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Campaigns;
