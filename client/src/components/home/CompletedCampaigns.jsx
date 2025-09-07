import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const CompletedCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const fetchCompletedCampaigns = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/campaigns/completed`);
                const data = await response.json();
                if (data.success) {
                    // Show only the 3 most recently completed campaigns
                    setCampaigns(data.campaigns.slice(0, 3));
                }
            } catch (error) {
                console.error("Error fetching completed campaigns:", error);
            }
        };
        fetchCompletedCampaigns();
    }, []);

    if (campaigns.length === 0) {
        return null; // Don't render the section if there are no completed campaigns
    }

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-brand-primary mb-4">Success Stories</h2>
                <p className="text-brand-text-light max-w-2xl mx-auto mb-12">
                    Thanks to our generous donors, these campaigns have successfully met their goals and created real change.
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                    {campaigns.map(campaign => (
                        <div key={campaign.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img src={`${backendUrl}/uploads/${campaign.image}`} alt={campaign.title} className="w-full h-48 object-cover" />
                            <div className="p-4 text-left">
                                <p className="text-sm font-semibold text-brand-primary">{campaign.category}</p>
                                <h3 className="font-bold text-brand-text mt-1 truncate">{campaign.title}</h3>
                                <p className="text-sm text-green-600 font-bold mt-2">
                                    Successfully Raised ₹{Number(campaign.raised_amount).toLocaleString()}!
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CompletedCampaigns;
