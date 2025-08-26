import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const AdminDashboard = () => {
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPendingCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/admin/campaigns/pending`);
      const data = await response.json();
      if (data.success) {
        setPendingCampaigns(data.campaigns);
      } else {
        setError(data.message || 'Failed to fetch campaigns.');
      }
    } catch (err) {
      setError('An error occurred while fetching campaigns.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCampaigns();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/campaigns/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`Campaign successfully ${status}!`);
        // Refresh the list after updating
        fetchPendingCampaigns();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      alert('An error occurred while updating the campaign.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Admin Dashboard</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pending Campaigns for Approval</h2>
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Campaign Title</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Creator</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Goal (₹)</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingCampaigns.length > 0 ? (
              pendingCampaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <Link to={`/campaigns/${campaign.id}`} className="text-blue-600 hover:underline">{campaign.title}</Link>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{campaign.creator_name}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{Number(campaign.target_amount).toLocaleString()}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button onClick={() => handleStatusUpdate(campaign.id, 'approved')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2">Approve</button>
                    <button onClick={() => handleStatusUpdate(campaign.id, 'rejected')} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">Reject</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-10">No pending campaigns.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
