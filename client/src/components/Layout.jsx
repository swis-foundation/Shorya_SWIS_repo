import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navabr';
import Footer from './Footer';

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main>
        {/* The Outlet component will render the specific page component */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
