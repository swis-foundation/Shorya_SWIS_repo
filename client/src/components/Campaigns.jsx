import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/campaigns");
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
          return (
            <div
              key={campaign.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group hover:shadow-2xl hover:scale-[1.01] relative"
            >
              <div className="relative">
                <img
                  src={`http://localhost:3000/uploads/${campaign.image}`}
                  alt={campaign.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {campaign.category}
                </span>
                <Link
                  to={`/campaigns/${campaign.id}`}
                  className="absolute inset-0 flex items-center justify-center bg-lime-600 bg-opacity-0 hover:bg-opacity-80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <button className="bg-lime-600 hover:bg-lime-700 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Donate Now
                  </button>
                </Link>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {campaign.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {campaign.description}
                </p>

                <div className="text-sm font-medium mb-2">
                  <span className="text-green-700">
                    ₹{campaign.raised_amount}
                  </span>
                  <span className="text-gray-500">
                    {" "}
                    raised of ₹{campaign.target_amount}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={progressStyle(
                      campaign.raised_amount,
                      campaign.target_amount
                    )}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>❤️ {campaign.supporters}</span>
                  <span>👥 {campaign.supporters}</span>
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