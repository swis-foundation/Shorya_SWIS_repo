import React from "react";
import Banner from "../Banner";
import WhyTrustUs from "./WhyTrustUs";
import BeTheChange from "./BeTheChange";
import ActiveCampaigns from "./ActiveCampaigns";
import CompletedCampaigns from "./CompletedCampaigns";


const Home = () => {
  return (
    <div className="bg-brand-background">
      <Banner />
      <WhyTrustUs />
      <ActiveCampaigns />
      <BeTheChange />
      <CompletedCampaigns />
    </div>
  );
};

export default Home;

