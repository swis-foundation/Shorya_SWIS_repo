import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Paynow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    amount: "",
  });
  const [amountError, setAmountError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "amount") {
      setAmountError("");
    }
  };

  const handlePayment = async () => {
    const { name, phone, email, amount } = formData;

    // **MODIFIED:** Added validation for minimum donation amount
    if (parseFloat(amount) < 50) {
      setAmountError("Minimum donation amount is ₹50.");
      return; // Stop the payment process
    }

    if (name && phone && email && amount >= 50) {
      setAmountError(""); // Clear any previous errors
      try {
        const orderResponse = await fetch(
          `${backendUrl}/api/payments/create-order`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: amount,
              campaignId: id,
              donorName: name,
            }),
          }
        );

        const orderData = await orderResponse.json();

        if (!orderData.success) {
          alert(`Error creating order: ${orderData.message}`);
          return;
        }

        const options = {
          key: orderData.keyId,
          name: "SeedTheChange",
          description: `Donation for Campaign: ${id}`,
          amount: orderData.amount,
          currency: orderData.currency,
          order_id: orderData.orderId,
          handler: async function (response) {
            const verifyResponse = await fetch(
              `${backendUrl}/api/payments/verify-payment`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  amount: amount,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              alert("Payment successful!");
              navigate(`/campaigns/${id}`);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name,
            email,
            contact: phone,
          },
          theme: {
            color: "#84cc16",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          console.error("Payment Failed:", response.error);
          alert(`Payment failed: ${response.error.description}`);
        });
        rzp.open();
      } catch (error) {
        console.error("Error during payment process:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 relative mb-6">
          Donate to Campaign ID: {id}
          <span className="block text-xs text-lime-600 uppercase tracking-wide absolute top-[-20px] left-1/2 transform -translate-x-1/2">
            help us
          </span>
          <span className="block h-1 w-24 bg-lime-600 rounded absolute bottom-[-10px] left-1/2 transform -translate-x-1/2"></span>
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Name*"
          value={formData.name}
          onChange={handleChange}
          className="w-full py-3 px-6 mb-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-600"
        />
        <input
          type="number"
          name="phone"
          placeholder="Phone Number*"
          value={formData.phone}
          onChange={handleChange}
          className="w-full py-3 px-6 mb-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-600"
        />
        <input
          type="email"
          name="email"
          placeholder="Email*"
          value={formData.email}
          onChange={handleChange}
          className="w-full py-3 px-6 mb-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-600"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount*"
          value={formData.amount}
          onChange={handleChange}
          className="w-full py-3 px-6 mb-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-600"
        />
        
        {/* **MODIFIED:** Display the error message if the amount is invalid */}
        {amountError && <p className="text-red-500 text-sm text-center -mt-2 mb-2">{amountError}</p>}

        <button
          onClick={handlePayment}
          className="w-full py-3 mt-4 bg-lime-600 hover:bg-lime-700 text-white rounded-full font-medium uppercase"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Paynow;
