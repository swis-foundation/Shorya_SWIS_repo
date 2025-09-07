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
    pan: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

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
      [name]: name === "pan" ? value.toUpperCase() : value,
    }));
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
    
    if (!formData.pan) {
        newErrors.pan = "PAN number is required.";
    } else if (!panRegex.test(formData.pan)) {
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
          donorPan: pan,
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
        theme: { color: "#9C3353" }, // Using brand-primary color
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => alert(`Payment failed: ${response.error.description}`));
      rzp.open();

    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  if (loading) {
    return <div className="w-full min-h-screen flex items-center justify-center bg-brand-background">Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-brand-background p-4">
        <style>{`
            .input { @apply w-full py-3 px-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary; }
            .error-text { @apply text-red-500 text-xs px-2 mt-1; }
      `}</style>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-semibold text-center text-brand-text-light mb-1">
          You are donating to
        </h2>
        <p className="text-2xl font-bold text-center text-brand-primary mb-6 line-clamp-2">
          {campaign ? campaign.title : "..."}
        </p>

        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium text-brand-text-light ml-1">Full Name *</label>
                <input type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} className={`input ${errors.name && 'border-red-500'}`} />
                {errors.name && <p className="error-text">{errors.name}</p>}
            </div>
            <div>
                <label className="text-sm font-medium text-brand-text-light ml-1">Email *</label>
                <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className={`input ${errors.email && 'border-red-500'}`} />
                {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            <div>
                <label className="text-sm font-medium text-brand-text-light ml-1">Phone Number *</label>
                <input type="number" name="phone" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} className={`input ${errors.phone && 'border-red-500'}`} />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>
            <div>
                <label className="text-sm font-medium text-brand-text-light ml-1">PAN Number *</label>
                <input type="text" name="pan" placeholder="Enter your PAN" value={formData.pan} onChange={handleChange} className={`input uppercase ${errors.pan && 'border-red-500'}`} />
                {errors.pan && <p className="error-text">{errors.pan}</p>}
            </div>
            <div>
                <label className="text-sm font-medium text-brand-text-light ml-1">Amount (Min ₹50) *</label>
                <input type="number" name="amount" placeholder="Enter amount" value={formData.amount} onChange={handleChange} className={`input ${errors.amount && 'border-red-500'}`} />
                {errors.amount && <p className="error-text">{errors.amount}</p>}
            </div>
        </div>

        <button onClick={handlePayment} className="w-full py-3 mt-6 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg font-semibold uppercase transition-colors">
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Paynow;
