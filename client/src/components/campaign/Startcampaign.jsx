import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const campaignCategories = [
  "Education", "Healthcare", "Food & Nutrition", "Environment", 
  "Disaster Relief", "Women Empowerment", "Animal Welfare", "Child Protection", "Community Development"
];

const StartCampaign = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target_amount: "",
    creator_name: "",
    days_left: "",
    location: "",
    category: "", // Added category to the state
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Updated validation to include the category
    if (!formData.title || !formData.description || !formData.target_amount || !formData.creator_name || !formData.days_left || !formData.location || !formData.category || !image) {
      setError("Please fill out all fields, select a category, and upload an image.");
      setLoading(false);
      return;
    }

    const campaignData = new FormData();
    // Append all form data fields to the FormData object
    Object.keys(formData).forEach(key => {
      campaignData.append(key, formData[key]);
    });
    campaignData.append("image", image);

    try {
      const response = await fetch(`${backendUrl}/api/campaigns`, {
        method: "POST",
        body: campaignData,
      });
      const result = await response.json();
      if (result.success) {
        alert("Campaign submitted for approval! You will be notified once it is reviewed.");
        navigate(`/campaigns`);
      } else {
        setError(result.message || "Failed to create campaign.");
      }
    } catch (err) {
      console.error("Error creating campaign:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f8f4] flex justify-center items-center px-4 py-10">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-lime-600 text-3xl font-bold text-center mb-2">
          Start Your Campaign
        </h2>
        <p className="text-center text-gray-600 text-sm mb-8">
          Fill in the details below to launch your fundraising campaign.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Campaign Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Campaign Title</label>
            <input
              type="text" name="title" value={formData.title} onChange={handleChange}
              placeholder="e.g., Help Rebuild the Local Library"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          {/* Location Input Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Location</label>
            <input
              type="text" name="location" value={formData.location} onChange={handleChange}
              placeholder="e.g., Bhopal, Madhya Pradesh"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 bg-white"
            >
              <option value="" disabled>Select a category</option>
              {campaignCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              name="description" value={formData.description} onChange={handleChange}
              placeholder="Tell a compelling story about your cause"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
              rows="4"
            ></textarea>
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Goal Amount (₹)</label>
            <input
              type="number" name="target_amount" value={formData.target_amount} onChange={handleChange}
              placeholder="e.g., 50000"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>
          
          {/* Creator Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Your Name</label>
            <input
              type="text" name="creator_name" value={formData.creator_name} onChange={handleChange}
              placeholder="Enter your full name or organization name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          {/* Days Left */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Campaign Duration (Days)</label>
            <input
              type="number" name="days_left" value={formData.days_left} onChange={handleChange}
              placeholder="e.g., 30"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Campaign Image</label>
            <input
              type="file" name="image" onChange={handleImageChange} accept="image/*"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-lime-600 hover:bg-lime-700 text-white font-bold rounded-lg mt-4 transition duration-300 disabled:bg-gray-400"
          >
            {loading ? "Submitting for Approval..." : "Submit Campaign"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StartCampaign;
