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
  
  // **MODIFIED:** Added a text shadow for better visibility on transparent backgrounds
  const navLinkClasses = sticky 
    ? "text-brand-text hover:text-brand-primary" 
    : "text-white hover:text-gray-200 [text-shadow:0_1px_3px_rgb(0_0_0_/_0.5)]";

  const navItems = (
    <>
      <li><Link to="/" className={`${navLinkClasses} transition block py-2 px-2`}>Home</Link></li>
      <li><Link to="/aboutUs" className={`${navLinkClasses} transition block py-2 px-2`}>About Us</Link></li>
      <li><Link to="/how-it-works" className={`${navLinkClasses} transition block py-2 px-2`}>How it Works</Link></li>
      <li><Link to="/campaigns" className={`${navLinkClasses} transition block py-2 px-2`}>Campaigns</Link></li>
      {user && user.user_type === 'admin' && (
        <li><Link to="/admin" className={`${navLinkClasses} transition block py-2 px-2`}>Admin</Link></li>
      )}
    </>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        sticky 
          ? "bg-brand-background/95 backdrop-blur-sm shadow-md" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img
              src="/swis-logo.jpg"
              alt="Seed The Change Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex flex-1 justify-center">
            <ul className="flex gap-4 md:gap-6 text-sm md:text-base font-medium">
              {navItems}
            </ul>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/start-campaign" className="bg-brand-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-primary-hover transition">
                  Start Campaign
                </Link>
                <button onClick={handleLogout} className="border border-brand-primary text-brand-primary px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-primary hover:text-white transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* **MODIFIED:** Added text shadow to login/signup buttons for visibility */}
                <Link to="/login" className={`px-4 py-2 rounded-md text-sm font-semibold transition ${sticky ? 'text-brand-primary border border-brand-primary hover:bg-brand-primary hover:text-white' : 'bg-white/20 hover:bg-white/30 text-white [text-shadow:0_1px_2px_rgb(0_0_0_/_0.4)]'}`}>
                  Login
                </Link>
                 <Link to="/signup" className={`px-4 py-2 rounded-md text-sm font-semibold transition ${sticky ? 'text-brand-primary border border-brand-primary hover:bg-brand-primary hover:text-white' : 'bg-white/20 hover:bg-white/30 text-white [text-shadow:0_1px_2px_rgb(0_0_0_/_0.4)]'}`}>
                  Sign Up
                </Link>
                <Link to="/start-campaign" className="bg-brand-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-primary-hover transition">
                  Start Campaign
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`focus:outline-none transition-all ${sticky ? 'text-brand-text' : 'text-white [filter:drop-shadow(0_1px_2px_rgb(0_0_0_/_0.5))]'}`}
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
          <div className="md:hidden mt-2 bg-brand-background rounded-md shadow-lg px-4 py-3 text-sm text-brand-text">
            <ul className="flex flex-col gap-1">
              {/* Re-applying the classes here for mobile menu */}
              <li><Link to="/" className="text-brand-text hover:text-brand-primary transition block py-2 px-2">Home</Link></li>
              <li><Link to="/aboutUs" className="text-brand-text hover:text-brand-primary transition block py-2 px-2">About Us</Link></li>
              <li><Link to="/how-it-works" className="text-brand-text hover:text-brand-primary transition block py-2 px-2">How it Works</Link></li>
              <li><Link to="/campaigns" className="text-brand-text hover:text-brand-primary transition block py-2 px-2">Campaigns</Link></li>
              {user && user.user_type === 'admin' && (
                <li><Link to="/admin" className="text-brand-text hover:text-brand-primary transition block py-2 px-2">Admin</Link></li>
              )}
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
              {user ? (
                 <>
                    <Link to="/start-campaign" className="bg-brand-primary text-white py-2 text-center rounded-md hover:bg-brand-primary-hover transition">Start Campaign</Link>
                    <button onClick={handleLogout} className="border border-brand-primary text-brand-primary py-2 text-center rounded-md hover:bg-brand-primary hover:text-white transition">Logout</button>
                 </>
              ) : (
                 <>
                    <Link to="/login" className="border border-brand-primary text-brand-primary py-2 text-center rounded-md hover:bg-brand-primary hover:text-white transition">Login</Link>
                     <Link to="/signup" className="border border-brand-primary text-brand-primary py-2 text-center rounded-md hover:bg-brand-primary hover:text-white transition">Sign Up</Link>
                    <Link to="/start-campaign" className="bg-brand-primary text-white py-2 text-center rounded-md hover:bg-brand-primary-hover transition">Start Campaign</Link>
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

