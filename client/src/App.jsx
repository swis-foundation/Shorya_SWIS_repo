import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/home/Home";
import CampaignsDetils from "./components/campaign/CampaignsDetils";
import CampaignPage from "./components/campaign/CampaignPage";
import Startcampaign from "./components/campaign/Startcampaign";
import Paynow from "./components/Paynow";
import Layout from "./components/Layout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AboutUs from "./components/AboutUs";
import HowItWorks from "./components/HowItWorks";
import ScrollToTop from "./components/ScrollToTop"; // Import the new component

const App = () => {
  return (
    <Router>
      <ScrollToTop /> {/* Add the component here to manage scroll position */}
      <Routes>
        {/* All page routes are now nested inside the Layout route */}
        <Route path="/" element={<Layout />}>
          {/* The index route displays the Home component at the root path "/" */}
          <Route index element={<Home />} />
          
          {/* Other page routes */}
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="campaigns" element={<CampaignsDetils />} />
          <Route path="campaigns/:id" element={<CampaignPage />} />
          <Route path="start-campaign" element={<Startcampaign />} />
          <Route path="campaigns/:id/donate" element={<Paynow />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="aboutUs" element={<AboutUs />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          
          {/* Catch-all route for 404 Not Found pages */}
          <Route path="*" element={<div className="text-center p-10">404 Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
