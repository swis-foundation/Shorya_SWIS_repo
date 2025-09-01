import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Paynow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    amount: "",
    pan: "", // Added PAN field
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch campaign details on component mount to get the title
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/campaigns/${id}`);
        const data = await response.json();
        if (data.success) {
          setCampaign(data.campaign);
        } else {
          console.error("Failed to fetch campaign details");
        }
      } catch (error) {
        console.error("Error fetching campaign details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Convert PAN to uppercase as the user types
      [name]: name === "pan" ? value.toUpperCase() : value,
    }));
    // Clear error on change
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.phone) newErrors.phone = "Phone number is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.amount) newErrors.amount = "Amount is required.";
    else if (parseFloat(formData.amount) < 50) newErrors.amount = "Minimum donation is ₹50.";

    // PAN is optional, but if filled, it must be valid
    if (formData.pan && !panRegex.test(formData.pan)) {
        newErrors.pan = "Invalid PAN number format.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validate()) return;
    
    try {
      const { name, phone, email, amount, pan } = formData;
      const orderResponse = await fetch(`${backendUrl}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          campaignId: id,
          donorName: name,
          donorPan: pan, // Send PAN to backend
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderData.success) {
        alert(`Error: ${orderData.message}`);
        return;
      }
      
      const options = {
        key: orderData.keyId,
        name: "SeedTheChange",
        description: `Donation for ${campaign.title}`,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        handler: async function (response) {
          const verifyResponse = await fetch(`${backendUrl}/api/payments/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            alert("Payment successful!");
            navigate(`/campaigns/${id}`);
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: { name, email, contact: phone },
        theme: { color: "#84cc16" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => alert(`Payment failed: ${response.error.description}`));
      rzp.open();

    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  if (loading) {
    return <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <style>{`
            .input { @apply w-full py-3 px-6 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-600; }
            .error-text { @apply text-red-500 text-xs px-4 -mt-2 mb-1; }
      `}</style>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Donating to:
        </h2>
        <p className="text-xl font-semibold text-center text-lime-600 mb-6 line-clamp-2">
          {campaign ? campaign.title : "..."}
        </p>

        <div className="space-y-3">
            <div>
                <input type="text" name="name" placeholder="Name*" value={formData.name} onChange={handleChange} className={`input ${errors.name && 'border border-red-500'}`} />
                {errors.name && <p className="error-text">{errors.name}</p>}
            </div>
            <div>
                <input type="email" name="email" placeholder="Email*" value={formData.email} onChange={handleChange} className={`input ${errors.email && 'border border-red-500'}`} />
                {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            <div>
                <input type="number" name="phone" placeholder="Phone Number*" value={formData.phone} onChange={handleChange} className={`input ${errors.phone && 'border border-red-500'}`} />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>
            <div>
                <input type="text" name="pan" placeholder="PAN Number (Optional)" value={formData.pan} onChange={handleChange} className={`input uppercase ${errors.pan && 'border border-red-500'}`} />
                {errors.pan && <p className="error-text">{errors.pan}</p>}
            </div>
            <div>
                <input type="number" name="amount" placeholder="Amount* (Min ₹50)" value={formData.amount} onChange={handleChange} className={`input ${errors.amount && 'border border-red-500'}`} />
                {errors.amount && <p className="error-text">{errors.amount}</p>}
            </div>
        </div>

        <button onClick={handlePayment} className="w-full py-3 mt-6 bg-lime-600 hover:bg-lime-700 text-white rounded-full font-medium uppercase">
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Paynow;

