import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navabr"; // Corrected filename
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* This 'main' element now has padding-top to prevent content from overlapping with the fixed navbar */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

