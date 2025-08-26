import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Use the environment variable for the backend URL. This is the critical fix.
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    dob: "",
    address: "",
    city: "",
    pincode: "",
    country: "",
    occupation: "",
    userType: "user",
    accountType: null,
    ngoId: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear validation errors as user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email address.";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required.";
    else if (!phoneRegex.test(formData.mobile)) newErrors.mobile = "Enter a valid 10-digit mobile number.";
    if (!formData.password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(""); // Clear previous server errors
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          mobile_number: formData.mobile,
          email: formData.email,
          password: formData.password,
          dob: formData.dob,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          country: formData.country,
          occupation: formData.occupation,
          user_type: formData.userType,
          account_type: formData.accountType,
          ngo_id: formData.ngoId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful! Please log in.");
        navigate("/login"); // Redirect to login page on success
      } else {
        // Display specific error message from the server
        setServerError(data.message || "An unknown error occurred.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setServerError("Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f8f3] px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-lime-600 mb-2">
          Join Seed The Change
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Create your account to start making a difference
        </p>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.fullName ? "border-red-500" : "focus:ring-lime-500"}`}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mobile Number</label>
            <input
              name="mobile"
              type="tel"
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.mobile ? "border-red-500" : "focus:ring-lime-500"}`}
            />
            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email ID</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? "border-red-500" : "focus:ring-lime-500"}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? "border-red-500" : "focus:ring-lime-500"}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          
          {/* Optional Fields */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Date of Birth (Optional)</label>
            <input
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-1">Address (Optional)</label>
            <input
              name="address"
              type="text"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          {/* Server Error Message */}
          {serverError && (
            <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded-md">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-lime-500 hover:bg-lime-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-400"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-lime-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
