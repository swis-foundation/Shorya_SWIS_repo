import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// A custom, redesigned input component for a modern look
const FloatingLabelInput = ({ label, name, value, onChange, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative pt-4">
      <label
        className={`absolute left-0 transition-all duration-300 pointer-events-none ${
          isFocused || hasValue
            ? "top-0 text-xs text-brand-primary"
            : "top-7 text-base text-brand-text-light"
        }`}
      >
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full py-2 bg-transparent border-b-2 transition-colors duration-300 focus:outline-none ${
          error
            ? "border-red-500"
            : isFocused
            ? "border-brand-primary"
            : "border-gray-300"
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

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
        theme: { color: "#9C3353" },
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
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-semibold text-center text-brand-text-light mb-1">
          You are donating to
        </h2>
        <p className="text-2xl font-bold text-center text-brand-primary mb-8 line-clamp-2">
          {campaign ? campaign.title : "..."}
        </p>

        <div className="space-y-6">
            <FloatingLabelInput label="Full Name *" name="name" value={formData.name} onChange={handleChange} error={errors.name} />
            <FloatingLabelInput label="Email *" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
            <FloatingLabelInput label="Phone Number *" name="phone" type="number" value={formData.phone} onChange={handleChange} error={errors.phone} />
            <FloatingLabelInput label="PAN Number *" name="pan" value={formData.pan} onChange={handleChange} error={errors.pan} className="uppercase" />
            <FloatingLabelInput label="Amount (Min ₹50) *" name="amount" type="number" value={formData.amount} onChange={handleChange} error={errors.amount} />
        </div>

        <button onClick={handlePayment} className="w-full py-3 mt-8 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg font-semibold uppercase transition-colors">
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Paynow;
