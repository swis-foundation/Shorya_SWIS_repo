import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/home/Home";
import CampaignsDetils from "./components/campaign/CampaignsDetils";
import CampaignPage from "./components/campaign/CampaignPage";
import Startcampaign from "./components/campaign/Startcampaign";
import Paynow from "./components/Paynow";

import AboutUs from "./components/AboutUs";
import HowItWorks from "./components/HowItWorks";
import AdminDashboard from "./components/admin/AdminDashboard"; // Import the new component


const App = () => {
        return (
                <Router>
                        <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/aboutUs" element={<AboutUs />} />
                                <Route path="/how-it-works" element={<HowItWorks />} />
                                <Route path="/aboutUs" element={<AboutUs />} /> {/* Add the new route */}
                                <Route path="/how-it-works" element={<HowItWorks />} /> {/* Add the new route */}
                                <Route path="/campaigns" element={<CampaignsDetils />} />
                                <Route path="/campaigns/:id" element={<CampaignPage />} />
                                <Route path="/start-campaign" element={<Startcampaign />} />
                                <Route path="/campaigns/:id/donate" element={<Paynow />} />


                                {/* ADD THE ADMIN ROUTE */}
                                <Route path="/admin" element={<AdminDashboard />} />

                                <Route path="*" element={<div>404, Page Not Found</div>} />
                        </Routes>
                </Router>
        );
};

export default App;
