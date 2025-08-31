import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import RealTimeProgressBar from "./RealTimeProgressBar";
import DOMPurify from 'dompurify'; // Import DOMPurify for security

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const SectionCard = ({ title, children }) => (
  <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl">
    <h3 className="text-xl md:text-2xl font-semibold text-lime-600 mb-4">
      {title}
    </h3>
    {children}
  </div>
);

const Detail = ({ label, value }) => (
  <p className="text-base text-gray-700 mb-1">
    <span className="font-semibold">{label}:</span> {value}
  </p>
);

const CommunityFooter = () => (
  <div className="bg-[#f5f6ec] py-16 mt-20 text-center px-4">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
      Join the Community
    </h2>
    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mt-4">
      Ready to take your journey to new heights? Connect with like-minded
      individuals who share your passion for making the world a better place.
    </p>
    <Link to="/signup">
      <button className="mt-8 bg-lime-500 hover:bg-lime-600 text-white text-lg font-medium py-3 px-8 rounded-xl shadow-md transition-all duration-300">
        Sign Up →
      </button>
    </Link>
  </div>
);


const CampaignPage = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/campaigns/${id}`);
        const data = await response.json();
        if (data.success) {
          setCampaign(data.campaign);
        } else {
          console.error("Failed to fetch campaign:", data.message);
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);
  
  // Helper to create sanitized HTML for rendering
  const createMarkup = (htmlContent) => {
    // Sanitize the HTML content to prevent XSS attacks before rendering
    return { __html: DOMPurify.sanitize(htmlContent) };
  };
  
  // Helper to create a plain text short description from HTML
  const getShortDescription = (htmlContent) => {
      if (!htmlContent) return "";
      // Create a temporary div to parse the HTML and get its text content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      const text = tempDiv.textContent || tempDiv.innerText || "";
      // Take the first 150 characters for a concise summary
      return text.substring(0, 150) + (text.length > 150 ? "..." : "");
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f9f8f3]">
        Loading campaign details...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f9f8f3]">
        Campaign not found.
      </div>
    );
  }

  return (
    <div className="bg-[#f9f8f3] min-h-screen font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-lime-100 via-lime-50 to-white py-12 px-4 sm:px-10 lg:px-24 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-snug">
          {campaign.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-3xl">
          {getShortDescription(campaign.description)}
        </p>
      </div>

      {/* Main Grid */}
      <div className="py-10 px-4 sm:px-10 lg:px-24 max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
        {/* Left Side */}
        <div className="lg:col-span-2 space-y-10">
          {/* Cover Image */}
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src={`${backendUrl}/uploads/${campaign.image}`}
              alt="Campaign Cover"
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {campaign.title}
            </h2>
            <p className="mt-2 text-base md:text-lg text-gray-600">
              Fundraiser by{" "}
              <span className="font-semibold">{campaign.creator_name}</span>
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b pb-2 text-lg">
            {["details", "donors"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize ${activeTab === tab
                    ? "text-lime-600 font-semibold border-b-2 border-lime-600"
                    : "text-gray-500 hover:text-lime-600"
                  } transition pb-1`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "details" && (
            <>
              <SectionCard title="About the Campaign">
                {/* **MODIFIED:** Render the sanitized HTML description */}
                <div 
                    className="prose max-w-none" 
                    dangerouslySetInnerHTML={createMarkup(campaign.description)} 
                />
              </SectionCard>
              <div className="bg-green-50 border border-green-300 text-green-800 text-base p-4 rounded-xl shadow-md">
                ✅ This campaign is eligible for 80G Tax Exemption.
              </div>
              <SectionCard title="Campaign Information">
                <Detail label="Location" value={campaign.location || 'Not specified'} />
                <Detail label="End Date" value={new Date(campaign.end_date).toLocaleDateString()} />
                <p className="text-red-500 font-semibold mt-2">
                  🕒 {campaign.days_left} Days Left
                </p>
              </SectionCard>
            </>
          )}

          {activeTab === "donors" && (
            <SectionCard title="Recent Donors">
              <DonorsList campaignId={campaign.id} />
            </SectionCard>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="sticky top-24">
          <div className="bg-white p-10 md:p-12 rounded-3xl shadow-2xl space-y-8 border-2 border-lime-200 w-full max-w-lg mx-auto">
            <h3 className="text-lg text-gray-600 mb-2">
              <span className="text-3xl font-extrabold text-gray-800">
                ₹{Number(campaign.raised_amount).toLocaleString()}
              </span>{" "}
              raised of ₹{Number(campaign.target_amount).toLocaleString()} Goal
            </h3>
            <RealTimeProgressBar
              campaignId={campaign.id}
              initialRaised={campaign.raised_amount}
              initialGoal={campaign.target_amount}
            />
            <p className="text-lg text-gray-600">
              <span className="font-bold">{campaign.supporters}</span> Donors
            </p>
            <Link to={`/campaigns/${campaign.id}/donate`}>
              <button className="w-full bg-lime-600 hover:bg-lime-700 text-white text-xl font-bold py-4 rounded-2xl transition duration-300 shadow-lg">
                DONATE NOW
              </button>
            </Link>
            <div className="text-sm text-gray-500 space-y-1 pt-2 text-center">
              <p>📌 {campaign.supporters} people have donated</p>
              <p>📚 Category: {campaign.category}</p>
            </div>
          </div>
        </div>
      </div>
      <CommunityFooter />
    </div>
  );
};

const DonorsList = ({ campaignId }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/campaigns/${campaignId}/donations`);
        const data = await response.json();
        if (data.success) {
          setDonations(data.donations);
        }
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, [campaignId]);

  if (loading) {
    return <div>Loading donations...</div>;
  }

  if (donations.length === 0) {
    return <div>No donations yet. Be the first to donate!</div>;
  }

  return (
    <ul className="space-y-4 text-gray-700 text-base">
      {donations.map((d, index) => (
        <li key={index}>
          🧑‍💼 {d.donor_name} – ₹{Number(d.amount).toLocaleString()}
        </li>
      ))}
    </ul>
  );
};


export default CampaignPage;

