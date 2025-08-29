import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const StartCampaign = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    creator_name: "",
    creator_email: "",
    creator_phone: "",
    creator_pan: "",
    // Step 2: Campaign Details
    title: "",
    description: "",
    target_amount: "",
    category: "",
    days_left: "",
    location: "",
    image: null,
    // Step 2: NGO Details (Optional)
    is_ngo: false,
    ngo_name: "",
    ngo_address: "",
    ngo_website: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear validation error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!formData.creator_name.trim()) newErrors.creator_name = "Full name is required.";
    if (!formData.creator_email.trim()) newErrors.creator_email = "Email is required.";
    if (!formData.creator_phone.trim()) newErrors.creator_phone = "Phone number is required.";
    if (!formData.creator_pan.trim()) newErrors.creator_pan = "PAN number is required.";
    else if (!panRegex.test(formData.creator_pan.toUpperCase())) newErrors.creator_pan = "Invalid PAN number format.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Campaign title is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (!formData.target_amount) newErrors.target_amount = "Goal amount is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.days_left) newErrors.days_left = "Duration is required.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!formData.image) newErrors.image = "Campaign image is required.";
    if (formData.is_ngo) {
      if (!formData.ngo_name.trim()) newErrors.ngo_name = "NGO name is required.";
      if (!formData.ngo_address.trim()) newErrors.ngo_address = "NGO address is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) {
      return;
    }
    setLoading(true);

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
        submissionData.append(key, formData[key]);
    });
    
    try {
        const response = await fetch(`${backendUrl}/api/campaigns`, {
            method: 'POST',
            body: submissionData,
        });
        const result = await response.json();
        if (result.success) {
            alert("Campaign submitted for approval!");
            navigate('/campaigns');
        } else {
            setErrors({ form: result.message || 'Failed to create campaign.' });
        }
    } catch (err) {
        setErrors({ form: 'An error occurred. Please try again.' });
    } finally {
        setLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">Step 1: Your Details</h3>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Full Name</label>
        <input type="text" name="creator_name" value={formData.creator_name} onChange={handleChange} placeholder="Enter your full name" className={`w-full input ${errors.creator_name && 'border-red-500'}`} />
        {errors.creator_name && <p className="text-red-500 text-sm mt-1">{errors.creator_name}</p>}
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <input type="email" name="creator_email" value={formData.creator_email} onChange={handleChange} placeholder="Enter your email" className={`w-full input ${errors.creator_email && 'border-red-500'}`} />
        {errors.creator_email && <p className="text-red-500 text-sm mt-1">{errors.creator_email}</p>}
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
        <input type="tel" name="creator_phone" value={formData.creator_phone} onChange={handleChange} placeholder="Enter your 10-digit phone number" className={`w-full input ${errors.creator_phone && 'border-red-500'}`} />
        {errors.creator_phone && <p className="text-red-500 text-sm mt-1">{errors.creator_phone}</p>}
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">PAN Number</label>
        <input type="text" name="creator_pan" value={formData.creator_pan} onChange={handleChange} placeholder="Enter your PAN number" className={`w-full input uppercase ${errors.creator_pan && 'border-red-500'}`} />
        {errors.creator_pan && <p className="text-red-500 text-sm mt-1">{errors.creator_pan}</p>}
      </div>
      <button type="button" onClick={nextStep} className="w-full btn-primary">Next</button>
    </>
  );

  const renderStep2 = () => (
    <>
      <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">Step 2: Campaign Details</h3>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Campaign Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Help Rebuild the Local Library" className={`w-full input ${errors.title && 'border-red-500'}`} />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Tell a compelling story" className={`w-full input ${errors.description && 'border-red-500'}`} rows="4"></textarea>
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className="block text-gray-700 font-medium mb-1">Goal Amount (₹)</label>
            <input type="number" name="target_amount" value={formData.target_amount} onChange={handleChange} placeholder="e.g., 50000" className={`w-full input ${errors.target_amount && 'border-red-500'}`} />
            {errors.target_amount && <p className="text-red-500 text-sm mt-1">{errors.target_amount}</p>}
        </div>
        <div>
            <label className="block text-gray-700 font-medium mb-1">Campaign Duration (Days)</label>
            <input type="number" name="days_left" value={formData.days_left} onChange={handleChange} placeholder="e.g., 30" className={`w-full input ${errors.days_left && 'border-red-500'}`} />
            {errors.days_left && <p className="text-red-500 text-sm mt-1">{errors.days_left}</p>}
        </div>
      </div>
       <div>
        <label className="block text-gray-700 font-medium mb-1">Category</label>
        <select name="category" value={formData.category} onChange={handleChange} className={`w-full input ${errors.category && 'border-red-500'}`}>
            <option value="">Select a category</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Environment">Environment</option>
            <option value="Animal Welfare">Animal Welfare</option>
            <option value="Disaster Relief">Disaster Relief</option>
            <option value="Other">Other</option>
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Location</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Bhopal, Madhya Pradesh" className={`w-full input ${errors.location && 'border-red-500'}`} />
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Campaign Image</label>
        <input type="file" name="image" onChange={handleChange} accept="image/*" className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100 ${errors.image && 'border-red-500'}`} />
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" name="is_ngo" checked={formData.is_ngo} onChange={handleChange} id="is_ngo_checkbox" className="h-4 w-4 rounded" />
        <label htmlFor="is_ngo_checkbox" className="text-gray-700">This campaign is on behalf of an NGO.</label>
      </div>
      {formData.is_ngo && (
        <div className="space-y-4 border-l-4 border-lime-500 pl-4 mt-4">
            <div>
                <label className="block text-gray-700 font-medium mb-1">NGO Name</label>
                <input type="text" name="ngo_name" value={formData.ngo_name} onChange={handleChange} placeholder="Name of the organization" className={`w-full input ${errors.ngo_name && 'border-red-500'}`} />
                {errors.ngo_name && <p className="text-red-500 text-sm mt-1">{errors.ngo_name}</p>}
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-1">NGO Address</label>
                <input type="text" name="ngo_address" value={formData.ngo_address} onChange={handleChange} placeholder="Full address of the NGO" className={`w-full input ${errors.ngo_address && 'border-red-500'}`} />
                {errors.ngo_address && <p className="text-red-500 text-sm mt-1">{errors.ngo_address}</p>}
            </div>
             <div>
                <label className="block text-gray-700 font-medium mb-1">NGO Website/Facebook Link (Optional)</label>
                <input type="text" name="ngo_website" value={formData.ngo_website} onChange={handleChange} placeholder="https://..." className="w-full input" />
            </div>
        </div>
      )}
      {errors.form && <p className="text-red-500 text-sm text-center">{errors.form}</p>}
      <div className="flex gap-4 mt-6">
        <button type="button" onClick={prevStep} className="w-full btn-secondary">Back</button>
        <button type="submit" disabled={loading} className="w-full btn-primary">{loading ? "Submitting..." : "Submit for Approval"}</button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f9f8f4] flex justify-center items-center px-4 py-10">
        <style>{`
            .input { @apply px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500; }
            .btn-primary { @apply py-3 bg-lime-600 hover:bg-lime-700 text-white font-bold rounded-lg transition duration-300 disabled:bg-gray-400; }
            .btn-secondary { @apply py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition duration-300; }
        `}</style>
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
            <h2 className="text-lime-600 text-3xl font-bold text-center mb-2">Start a Campaign</h2>
            <p className="text-center text-gray-600 text-sm mb-8">Let's get started on making a difference.</p>
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                {step === 1 ? renderStep1() : renderStep2()}
            </form>
        </div>
    </div>
  );
};

export default StartCampaign;

