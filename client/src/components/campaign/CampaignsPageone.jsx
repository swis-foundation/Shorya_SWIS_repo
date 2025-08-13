import React from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const campaigns = [
  {
    id: 1,
    category: "Education",
    title: "Help Ravi Become a Doctor – Support His Education Today",
    description:
      "Ravi, a bright 16-year-old from a small village in Odisha, dreams of becoming a doctor...",
    raised: "₹8K",
    goal: "₹22K",
    donors: 1037,
    comments: 12,
    image:
      "https://cdn.pixabay.com/photo/2021/02/12/13/40/boy-6008608_1280.jpg",
  },
  {
    id: 2,
    category: "Animal Welfare",
    title: "Help Us Save Innocent Lives",
    description:
      "We are out of funds. Our dogs are starving. We're drowning in debt.",
    raised: "₹5.7L",
    goal: "₹10.0L",
    donors: 2873,
    comments: 455,
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
  },
  // Add more campaigns as needed...
];

const CampaignsPageone = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-6 md:px-16 py-8 bg-[#f9f8f3] min-h-screen">
      <h1 className="text-3xl text-center font-bold text-lime-600 mb-2">
        All Campaigns
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Discover and support campaigns that are making a real difference.
      </p>

      {/* Search & Filters */}
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
                src={c.image}
                alt={c.title}
                className="w-full h-48 object-cover"
              />
              <span className="absolute top-2 left-2 bg-lime-600 text-white text-xs px-2 py-1 rounded">
                {c.category}
              </span>

              <div className="absolute inset-0 flex items-center justify-center  bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() =>
                    navigate(`/campaign/${c.id}`, { state: { campaign: c } })
                  }
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
                <div className="h-full bg-lime-500 w-[70%] rounded-full"></div>
              </div>
              <div className="text-sm text-gray-500 mb-1">
                <strong>{c.raised}</strong> raised of <strong>{c.goal}</strong>
              </div>
              <div className="text-xs text-gray-400 flex justify-between">
                <span>{c.comments} comments</span>
                <span>{c.donors} donors</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignsPageone;
