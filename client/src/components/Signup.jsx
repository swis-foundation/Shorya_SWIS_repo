import React, { useState } from "react";

const Signup = () => {
  // Initialize formData with all fields expected by the backend,
  // including new ones like city, pincode, country, userType, accountType, ngoId.
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    dob: "",
    address: "",
    city: "", // Added for backend
    pincode: "", // Added for backend
    country: "", // Added for backend
    occupation: "",
    userType: "user", // Default to 'user', consider making it selectable if needed
    accountType: null, // Default to null, will be set if userType is 'campaign_owner'
    ngoId: null, // Default to null, will be set if accountType is 'organization'
  });

  const [errors, setErrors] = useState({
    mobile: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear error as user types
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    // Added 'async' keyword here
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted:", formData);

      try {
        const response = await fetch(
          "https://testing-8h1z.onrender.com/signup",
          {
            // Your backend endpoint
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // Map frontend state names to backend expected names
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
          }
        );

        const data = await response.json(); // Parse the JSON response from the backend

        if (response.ok) {
          // Check for a successful HTTP status (2xx range)
          console.log("Signup successful:", data.message);
          alert(data.message); // Show success message to the user
          // You might want to redirect the user here, e.g., to a login page
          // window.location.href = '/login';
        } else {
          // Handle errors from the backend (e.g., email already registered)
          console.error("Signup failed:", data.message);
          alert(`Signup failed: ${data.message}`);
        }
      } catch (error) {
        // Handle network errors (e.g., server not reachable)
        console.error("Error during signup:", error);
        alert("An error occurred during signup. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f8f3] px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-lime-600 mb-2">
          Join Seed The Change
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Create your account to start making a difference
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
              required // Added 'required' attribute for basic client-side validation
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Mobile Number
            </label>
            <input
              name="mobile"
              type="tel"
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.mobile ? "border-red-500" : "focus:ring-lime-500"
              }`}
              required // Added 'required' attribute
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email ID
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500" : "focus:ring-lime-500"
              }`}
              required // Added 'required' attribute
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
              required // Added 'required' attribute
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Date of Birth
            </label>
            <input
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Address
            </label>
            <input
              name="address"
              type="text"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          {/* New fields added to match backend schema */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">City</label>
            <input
              name="city"
              type="text"
              placeholder="Enter your city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Pincode
            </label>
            <input
              name="pincode"
              type="text"
              placeholder="Enter your pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Country
            </label>
            <input
              name="country"
              type="text"
              placeholder="Enter your country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Occupation
            </label>
            <input
              name="occupation"
              type="text"
              placeholder="Enter your occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          {/* Example of how you might add userType selection.
              If most users are 'user', you can keep userType as default 'user' in state
              and not expose these fields unless necessary for 'campaign_owner' registration.
          */}
          {/*
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              I am signing up as:
            </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              <option value="user">Individual User</option>
              <option value="campaign_owner">Campaign Owner (NGO/Individual)</option>
            </select>
          </div>

          {formData.userType === 'campaign_owner' && (
            <>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Account Type
                </label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                >
                  <option value="">Select Account Type</option>
                  <option value="individual">Individual</option>
                  <option value="organization">Organization</option>
                </select>
              </div>

              {formData.accountType === 'organization' && (
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    NGO ID (if applicable)
                  </label>
                  <input
                    name="ngoId"
                    type="text"
                    placeholder="Enter NGO ID"
                    value={formData.ngoId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
              )}
            </>
          )}
          */}

          <button
            type="submit"
            className="w-full mt-4 bg-lime-500 hover:bg-lime-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-lime-600 font-medium hover:underline"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
