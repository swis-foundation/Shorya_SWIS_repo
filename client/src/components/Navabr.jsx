import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    
    const checkUser = () => {
      const loggedInUser = sessionStorage.getItem("user");
      if (loggedInUser) {
        setUser(JSON.parse(loggedInUser));
      } else {
        setUser(null);
      }
    };

    checkUser();

    window.addEventListener('storageChange', checkUser);
    window.addEventListener('storage', checkUser);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('storageChange', checkUser);
      window.removeEventListener('storage', checkUser);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    window.dispatchEvent(new Event("storageChange"));
    navigate("/");
  };
  
  const navItems = (
    <>
      <li><Link to="/" className="hover:text-green-600 transition block py-2 px-2">Home</Link></li>
      <li><Link to="/aboutUs" className="hover:text-green-600 transition block py-2 px-2">About Us</Link></li>
      <li><Link to="/how-it-works" className="hover:text-green-600 transition block py-2 px-2">How it Works</Link></li>
      <li><Link to="/campaigns" className="hover:text-green-600 transition block py-2 px-2">Campaigns</Link></li>
      {user && user.user_type === 'admin' && (
        <li><Link to="/admin" className="hover:text-green-600 transition block py-2 px-2">Admin</Link></li>
      )}
    </>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        sticky 
          ? "bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-md" 
          : "bg-slate-100 dark:bg-gray-800"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img
              src="https://images.squarespace-cdn.com/content/v1/591fb1cfb3db2b2e45f3350d/1526471032464-SHDL19LWGHHJ4M6KK3BX/Sustainable.jpg"
              alt="Logo"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex flex-1 justify-center">
            {/* MODIFIED: Changed text color for better contrast */}
            <ul className="flex gap-4 md:gap-6 text-sm md:text-base font-medium text-slate-700 dark:text-slate-300">
              {navItems}
            </ul>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/start-campaign" className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition">
                  Start Campaign
                </Link>
                <button onClick={handleLogout} className="border border-red-600 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-600 hover:text-white transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="border border-green-600 text-green-600 px-3 py-1 rounded-md text-sm hover:bg-green-600 hover:text-white transition">
                  Login
                </Link>
                <Link to="/signup" className="border border-green-600 text-green-600 px-3 py-1 rounded-md text-sm hover:bg-green-600 hover:text-white transition">
                  Sign Up
                </Link>
                <Link to="/start-campaign" className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition">
                  Start Campaign
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 dark:text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-2 bg-white dark:bg-slate-800 rounded-md shadow-md px-4 py-3 text-sm text-gray-800 dark:text-white">
            <ul className="flex flex-col gap-1">{navItems}</ul>
            <div className="mt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <Link to="/start-campaign" className="bg-green-600 text-white py-2 text-center rounded-md hover:bg-green-700 transition">
                    Start Campaign
                  </Link>
                  <button onClick={handleLogout} className="border border-red-600 text-red-600 py-2 text-center rounded-md hover:bg-red-600 hover:text-white transition">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="border border-green-600 text-green-600 py-2 text-center rounded-md hover:bg-green-600 hover:text-white transition">
                    Login
                  </Link>
                   <Link to="/signup" className="border border-green-600 text-green-600 py-2 text-center rounded-md hover:bg-green-600 hover:text-white transition">
                    Sign Up
                  </Link>
                  <Link to="/start-campaign" className="bg-green-600 text-white py-2 text-center rounded-md hover:bg-green-700 transition">
                    Start Campaign
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;

