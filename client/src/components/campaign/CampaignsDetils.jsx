import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const CategoryCard = ({ categoryData, onClick }) => {
  const { category, total_goal, total_raised } = categoryData;
  const percentage = total_goal > 0 ? (total_raised / total_goal) * 100 : 0;
  const progressStyle = {
    width: `${Math.min(percentage, 100)}%`
  };

  return (
    <div 
      onClick={() => onClick(category)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <h3 className="text-lg font-semibold text-lime-600 mb-3">{category}</h3>
      </div>
      <div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div className="bg-lime-500 h-2.5 rounded-full" style={progressStyle}></div>
        </div>
        <p className="text-sm text-gray-600">
          <strong>₹{Number(total_raised).toLocaleString()}</strong> raised of ₹{Number(total_goal).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

const CampaignCard = ({ campaign }) => {
  const navigate = useNavigate();
  const progressPercentage = (campaign.raised_amount / campaign.target_amount) * 100;
  const progressStyle = {
    width: `${Math.min(progressPercentage, 100)}%`
  };

  return (
    <div
      onClick={() => navigate(`/campaigns/${campaign.id}`)}
      className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group relative cursor-pointer"
    >
      <div className="relative">
        <img
          src={`${backendUrl}/uploads/${campaign.image}`}
          alt={campaign.title}
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-2 left-2 bg-lime-600 text-white text-xs px-2 py-1 rounded">
          {campaign.category}
        </span>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-1 line-clamp-2">{campaign.title}</h2>
        <div className="my-3 h-2 w-full bg-gray-200 rounded-full">
          <div className="h-full bg-lime-500 rounded-full" style={progressStyle}></div>
        </div>
        <div className="text-sm text-gray-500 mb-1">
          <strong>₹{Number(campaign.raised_amount).toLocaleString()}</strong> raised of <strong>₹{Number(campaign.target_amount).toLocaleString()}</strong>
        </div>
        <div className="text-xs text-gray-400 flex justify-between">
          <span>{campaign.supporters} donors</span>
          <span>{campaign.days_left} days left</span>
        </div>
      </div>
    </div>
  );
};

const CampaignsDetails = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/api/categories`);
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        } else {
          setError('Failed to load categories.');
        }
      } catch (err) {
        setError('An error occurred while fetching categories.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch campaigns when a category is selected
  useEffect(() => {
    if (!selectedCategory) {
      setCampaigns([]);
      return;
    }
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/api/campaigns?category=${encodeURIComponent(selectedCategory)}`);
        const data = await response.json();
        if (data.success) {
          setCampaigns(data.campaigns);
        } else {
          setError(`Failed to load campaigns for ${selectedCategory}.`);
        }
      } catch (err) {
        setError('An error occurred while fetching campaigns.');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [selectedCategory]);

  return (
    <div className="px-4 sm:px-6 md:px-16 py-8 bg-[#f9f8f3] min-h-screen">
      <h1 className="text-3xl text-center font-bold text-lime-600 mb-2">
        {selectedCategory ? `Campaigns in ${selectedCategory}` : "Explore Campaigns by Category"}
      </h1>
      <p className="text-center text-gray-600 mb-8">
        {selectedCategory ? "Support a cause that matters to you." : "Select a category to get started."}
      </p>

      {selectedCategory && (
        <button 
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 mb-8 text-lime-600 hover:underline"
        >
          <FaArrowLeft /> Back to Categories
        </button>
      )}

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {!selectedCategory 
            ? categories.map(catData => <CategoryCard key={catData.category} categoryData={catData} onClick={setSelectedCategory} />)
            : campaigns.map(camp => <CampaignCard key={camp.id} campaign={camp} />)
          }
        </div>
      )}
    </div>
  );
};

export default CampaignsDetails;
