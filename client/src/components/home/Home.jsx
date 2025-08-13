import React from "react";
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
import Banner from "../Banner.jsx";
import Help from "../Help.jsx";
import Campaigns from "../Campaigns.jsx";
import Footer from "../Footer.jsx";
import Navbar from "../Navabr.jsx";

function Home() {
  return (
    <>
      <Navbar />
      <Banner />
      <Help />
      <Campaigns />
      <Footer />
    </>
  );
}

export default Home;
