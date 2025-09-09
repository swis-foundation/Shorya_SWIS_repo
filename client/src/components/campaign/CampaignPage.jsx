import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import RealTimeProgressBar from "./RealTimeProgressBar";
import DOMPurify from 'dompurify';
// Icons are imported from react-icons to replace the emojis for a cleaner look.
import { FaShareAlt, FaCheckCircle, FaClock, FaUsers, FaTag, FaUserCircle } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const SectionCard = ({ title, children }) => (
  <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
    <h3 className="text-xl md:text-2xl font-semibold text-brand-primary mb-4">
      {title}
    </h3>
    {children}
  </div>
);

const Detail = ({ label, value }) => (
  <p className="text-base text-brand-text-light mb-1">
    <span className="font-semibold">{label}:</span> {value}
  </p>
);

const CommunityFooter = () => (
  <div className="bg-brand-background py-16 mt-20 text-center px-4">
    <h2 className="text-3xl md:text-4xl font-bold text-brand-text">
      Join the Community
    </h2>
    <p className="text-lg md:text-xl text-brand-text-light max-w-2xl mx-auto mt-4">
      Ready to take your journey to new heights? Connect with like-minded
      individuals who share your passion for making the world a better place.
    </p>
    <Link to="/signup">
      <button className="mt-8 bg-brand-primary hover:bg-brand-primary-hover text-white text-lg font-medium py-3 px-8 rounded-xl shadow-md transition-all duration-300">
        Sign Up →
      </button>
    </Link>
  </div>
);

// This new component contains the donation card, making it reusable for different screen sizes.
const DonationCard = ({ campaign, handleShare, showCopiedMessage }) => (
    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl space-y-8 border-2 border-brand-secondary/50 w-full max-w-lg mx-auto">
        <h3 className="text-lg text-brand-text-light mb-2">
            <span className="text-3xl font-extrabold text-brand-text">
                ₹{Number(campaign.raised_amount).toLocaleString()}
            </span>{" "}
            raised of ₹{Number(campaign.target_amount).toLocaleString()} Goal
        </h3>
        <RealTimeProgressBar
            campaignId={campaign.id}
            initialRaised={campaign.raised_amount}
            initialGoal={campaign.target_amount}
        />
        <p className="text-lg text-brand-text-light">
            <span className="font-bold text-brand-text">{campaign.supporters}</span> Donors
        </p>
        <Link to={`/campaigns/${campaign.id}/donate`}>
            <button className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xl font-bold py-4 rounded-2xl transition duration-300 shadow-lg">
                DONATE NOW
            </button>
        </Link>
        <button
            onClick={handleShare}
            className="w-full mt-2 bg-white border border-brand-primary text-brand-primary hover:bg-brand-secondary/20 font-bold py-3 rounded-2xl transition duration-300 flex items-center justify-center gap-2"
        >
            <FaShareAlt />
            <span>Share</span>
        </button>
        {showCopiedMessage && (
            <p className="text-center text-sm text-green-600 -mt-2">Link copied to clipboard!</p>
        )}
        <div className="text-sm text-brand-text-light space-y-2 pt-2 text-center">
            <p className="flex items-center justify-center gap-2"><FaUsers /><span>{campaign.supporters} people have donated</span></p>
            <p className="flex items-center justify-center gap-2"><FaTag /><span>Category: {campaign.category}</span></p>
        </div>
    </div>
);


const CampaignPage = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

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

  const handleShare = async () => {
    const shareData = {
      title: campaign.title,
      text: getShortDescription(campaign.description),
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000); // Hide message after 2 seconds
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy link.');
      });
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-brand-background">
        Loading campaign details...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex justify-center items-center h-screen bg-brand-background">
        Campaign not found.
      </div>
    );
  }

  return (
    <div className="bg-brand-background min-h-screen font-sans">
      {/* Header */}
      <div className="bg-white py-12 px-4 sm:px-10 lg:px-24 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-text leading-snug">
          {campaign.title}
        </h1>
        <p className="text-lg md:text-xl text-brand-text-light mt-4 max-w-3xl">
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
              alt={campaign.title}
              className="w-full h-[300px] md:h-[400px] object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null; // prevents looping
                e.currentTarget.src = `https://placehold.co/800x400/EEE/31343C?text=${encodeURIComponent(campaign.title)}`;
              }}
            />
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-text">
              {campaign.title}
            </h2>
            <p className="mt-2 text-base md:text-lg text-brand-text-light">
              Fundraiser by{" "}
              <span className="font-semibold text-brand-text">{campaign.creator_name}</span>
            </p>
          </div>

          {/* MODIFIED: Donation card is now shown here on mobile screens for a better layout flow. */}
          <div className="lg:hidden">
            <DonationCard campaign={campaign} handleShare={handleShare} showCopiedMessage={showCopiedMessage} />
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b pb-2 text-lg">
            {["details", "donors"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize ${activeTab === tab
                    ? "text-brand-primary font-semibold border-b-2 border-brand-primary"
                    : "text-gray-500 hover:text-brand-primary"
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
                <div 
                    className="prose max-w-none text-brand-text-light" 
                    dangerouslySetInnerHTML={createMarkup(campaign.description)} 
                />
              </SectionCard>
              <div className="flex items-center gap-2 bg-brand-secondary/20 border border-brand-secondary text-brand-primary font-medium text-base p-4 rounded-xl shadow-md">
                 <FaCheckCircle />
                 <span>This campaign is eligible for 80G Tax Exemption.</span>
              </div>
              <SectionCard title="Campaign Information">
                <Detail label="Location" value={campaign.location || 'Not specified'} />
                <Detail label="End Date" value={new Date(campaign.end_date).toLocaleDateString()} />
                <p className="flex items-center gap-2 text-red-500 font-semibold mt-2">
                  <FaClock />
                  <span>{campaign.days_left} Days Left</span>
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

        {/* MODIFIED: Right sidebar is now hidden on mobile and only appears on large screens. */}
        <div className="hidden lg:block sticky top-24">
            <DonationCard campaign={campaign} handleShare={handleShare} showCopiedMessage={showCopiedMessage} />
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
    return <div className="text-brand-text-light">Loading donations...</div>;
  }

  if (donations.length === 0) {
    return <div className="text-brand-text-light">No donations yet. Be the first to donate!</div>;
  }

  return (
    <ul className="space-y-4 text-brand-text-light text-base">
      {donations.map((d, index) => (
        <li key={index} className="flex items-center gap-2">
            <FaUserCircle className="text-brand-primary" />
            <span>
                {d.is_anonymous ? "Anonymous Donor" : d.donor_name} – ₹{Number(d.amount).toLocaleString()}
            </span>
        </li>
      ))}
    </ul>
  );
};


export default CampaignPage;
