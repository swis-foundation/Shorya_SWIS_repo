import React, { useState } from "react";
import { FaUser, FaBuilding } from "react-icons/fa";

const StartCampaign = () => {
  const [accountType, setAccountType] = useState("individual");

  return (
    <div className="min-h-screen bg-[#f9f8f4] flex justify-center items-center px-4 py-10">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h2 className="text-[#64a600] text-2xl font-semibold text-center mb-1">
          Start Your Campaign
        </h2>
        <p className="text-center text-[#626262] text-sm mb-6">
          Create an account to begin making an impact
        </p>

        {/* Account Type Switch */}
        <div className="flex space-x-3 mb-6">
          <div
            onClick={() => setAccountType("individual")}
            className={`flex-1 cursor-pointer border rounded-lg px-4 py-3 ${
              accountType === "individual"
                ? "border-[#64a600] bg-[#f3fbe9]"
                : "border-[#ccc] bg-white"
            }`}
          >
            <div className="flex items-center space-x-2">
              <FaUser
                className={`text-sm ${
                  accountType === "individual"
                    ? "text-[#64a600]"
                    : "text-gray-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  accountType === "individual"
                    ? "text-[#64a600]"
                    : "text-gray-700"
                }`}
              >
                Individual
              </span>
            </div>
            <p className="text-xs text-gray-500 ml-6 mt-1">
              Personal fundraising campaigns
            </p>
          </div>

          <div
            onClick={() => setAccountType("organization")}
            className={`flex-1 cursor-pointer border rounded-lg px-4 py-3 ${
              accountType === "organization"
                ? "border-[#64a600] bg-[#f3fbe9]"
                : "border-[#ccc] bg-white"
            }`}
          >
            <div className="flex items-center space-x-2">
              <FaBuilding
                className={`text-sm ${
                  accountType === "organization"
                    ? "text-[#64a600]"
                    : "text-gray-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  accountType === "organization"
                    ? "text-[#64a600]"
                    : "text-gray-700"
                }`}
              >
                Organization (NGO)
              </span>
            </div>
            <p className="text-xs text-gray-500 ml-6 mt-1">
              Institutional fundraising
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#64a600]"
          />
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#64a600]"
          />
          <input
            type="password"
            placeholder="Create a password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#64a600]"
          />
          <input
            type="text"
            placeholder="Enter your address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#64a600]"
          />

          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Enter city"
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-[#64a600]"
            />
            <input
              type="text"
              placeholder="PIN Code"
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-[#64a600]"
            />
          </div>

          <input
            type="text"
            placeholder="Enter country"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#64a600]"
          />

          <button
            type="submit"
            className="w-full py-2 bg-[#64a600] hover:bg-[#599300] text-white font-medium rounded-md mt-2"
          >
            Create Campaign Account
          </button>
          <a
            href="/Paynow"
            className="w-full max-w-xs mx-auto block py-2 bg-pink-600 hover:bg-red-700 text-white font-medium text-center rounded-md mt-2"
          >
            Paynow
          </a>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/Login" className="text-[#64a600] hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default StartCampaign;
