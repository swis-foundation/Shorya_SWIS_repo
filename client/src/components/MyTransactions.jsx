import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const MyTransactions = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user info from session storage
    const loggedInUser = sessionStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      // If no user is logged in, we can't fetch transactions
      setError('You must be logged in to view your transactions.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch donations only if the user is logged in
    if (user && user.email) {
      const fetchDonations = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${backendUrl}/api/user/donations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email }),
          });
          const data = await response.json();
          if (data.success) {
            setDonations(data.donations);
          } else {
            setError(data.message || 'Failed to fetch donations.');
          }
        } catch (err) {
          setError('An error occurred while fetching your transactions.');
        } finally {
          setLoading(false);
        }
      };
      fetchDonations();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-brand-background py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-brand-primary mb-8">My Donations</h1>
        
        {loading && <p className="text-center text-brand-text-light">Loading your donations...</p>}
        {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}

        {!loading && !error && donations.length === 0 && (
          <div className="text-center bg-white p-8 rounded-xl shadow-md">
            <p className="text-brand-text-light mb-4">You haven't made any donations yet.</p>
            <Link to="/campaigns" className="text-brand-primary font-semibold hover:underline">
              Find a cause to support
            </Link>
          </div>
        )}

        {!loading && !error && donations.length > 0 && (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-brand-text uppercase tracking-wider">Campaign</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-brand-text uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-brand-text uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-brand-text uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <Link to={`/campaigns/${donation.campaign_id}`} className="text-brand-primary hover:underline font-semibold">{donation.campaign_title}</Link>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm text-brand-text-light">{new Date(donation.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm text-right font-medium text-brand-text">₹{Number(donation.amount).toLocaleString()}</td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                      <span className="capitalize px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTransactions;
