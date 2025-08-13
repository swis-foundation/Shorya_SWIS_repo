import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/home/Home";
import CampaignsDetils from "./components/campaign/CampaignsDetils";
import CampaignPage from "./components/campaign/CampaignPage";
import Startcampaign from "./components/campaign/Startcampaign";
import Paynow from "./components/Paynow";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/campaigns" element={<CampaignsDetils />} />
        {/* Dynamic route for all campaign pages */}
        <Route path="/campaigns/:id" element={<CampaignPage />} />
        <Route path="/start-campaign" element={<Startcampaign />} />
        {/* Dynamic route for the payment page */}
        <Route path="/campaigns/:id/donate" element={<Paynow />} />
        <Route path="*" element={<div>404, Sudipta</div>} />
      </Routes>
    </Router>
  );
};

export default App;