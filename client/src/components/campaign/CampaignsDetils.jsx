import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { FaArrowLeft } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const CategoryCard = ({ category, onClick }) => {
    const progressPercentage = (category.total_raised / category.total_goal) * 100;
    const progressStyle = {
      width: `${Math.min(progressPercentage, 100)}%`
    };

    return (
        <div
            onClick={() => onClick(category.category)}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 cursor-pointer flex flex-col justify-between"
        >
            <div>
                <h3 className="text-lg font-semibold text-lime-600 mb-2">{category.category}</h3>
                <p className="text-xs text-gray-500 mb-4">{category.campaign_count} active campaigns</p>
            </div>
            <div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className="bg-lime-500 h-2.5 rounded-full" style={progressStyle}></div>
                </div>
                <div className="text-sm text-gray-700">
                    <span className="font-bold">₹{Number(category.total_raised).toLocaleString()}</span> raised of ₹{Number(category.total_goal).toLocaleString()}
                    <span className="text-lime-600 font-semibold ml-2">({Math.floor(progressPercentage)}%)</span>
                </div>
            </div>
        </div>
    )
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
  const location = useLocation(); // Get location object from router

  // **MODIFIED:** Check for a category passed from another page (like the homepage)
  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);


  // Fetch categories on component mount if no category is pre-selected
  useEffect(() => {
    if (!selectedCategory) {
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
    }
  }, [selectedCategory]); // Re-fetch categories if we go back

  // Fetch campaigns when a category is selected
  useEffect(() => {
    if (!selectedCategory) {
      setCampaigns([]);
      return;
    }
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError(''); // Clear previous errors
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
          onClick={() => {
            setSelectedCategory(null);
            // Clear category from navigation state to prevent re-triggering
            window.history.replaceState({}, document.title)
          }}
          className="flex items-center gap-2 mb-8 text-lime-600 hover:underline"
        >
          <FaArrowLeft /> Back to Categories
        </button>
      )}

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {/* **MODIFIED:** Logic to handle empty campaigns in a selected category */}
          {selectedCategory && campaigns.length === 0 && (
            <div className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">No Active Campaigns</h3>
              <p>All campaigns under the "{selectedCategory}" category have been completed or there are no campaigns in this category yet. Thank you for your support!</p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {!selectedCategory 
              ? categories.map(cat => <CategoryCard key={cat.category} category={cat} onClick={setSelectedCategory} />)
              : campaigns.map(camp => <CampaignCard key={camp.id} campaign={camp} />)
            }
          </div>
        </>
      )}
    </div>
  );
};

export default CampaignsDetails;
