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

  // MODIFIED: This function will be called by links in the mobile menu to close it on navigation.
  const closeMobileMenu = () => {
    setMenuOpen(false);
  };
  
  const navLinkClasses = "text-brand-text hover:text-brand-primary";

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
          ? "bg-brand-background shadow-md" 
          : "bg-brand-background/80 backdrop-blur-sm"
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
            <Link to="/start-campaign" className="bg-brand-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-primary-hover transition">
                Start Campaign
            </Link>
            {user ? (
              <>
                <Link to="/my-transactions" className="border border-brand-primary text-brand-primary px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-primary hover:text-white transition">
                  My Transactions
                </Link>
                <button onClick={handleLogout} className="border border-brand-primary text-brand-primary px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-primary hover:text-white transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="border border-brand-primary text-brand-primary px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-primary hover:text-white transition">
                  Login
                </Link>
                 <Link to="/signup" className="border border-brand-primary text-brand-primary px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-primary hover:text-white transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none transition-all text-brand-text"
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
              {/* MODIFIED: Added onClick to each link to close the menu */}
              <li><Link to="/" onClick={closeMobileMenu} className="text-brand-text hover:text-brand-primary transition block py-2 px-2">Home</Link></li>
              <li><Link to="/aboutUs" onClick={closeMobileMenu} className="text-brand-text hover:text-brand-primary transition block py-2 px-2">About Us</Link></li>
              <li><Link to="/how-it-works" onClick={closeMobileMenu} className="text-brand-text hover:text-brand-primary transition block py-2 px-2">How it Works</Link></li>
              <li><Link to="/campaigns" onClick={closeMobileMenu} className="text-brand-text hover:text-brand-primary transition block py-2 px-2">Campaigns</Link></li>
              {user && user.user_type === 'admin' && (
                <li><Link to="/admin" onClick={closeMobileMenu} className="text-brand-text hover:text-brand-primary transition block py-2 px-2">Admin</Link></li>
              )}
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
                <Link to="/start-campaign" onClick={closeMobileMenu} className="bg-brand-primary text-white py-2 text-center rounded-md hover:bg-brand-primary-hover transition">Start Campaign</Link>
              {user ? (
                 <>
                    <Link to="/my-transactions" onClick={closeMobileMenu} className="border border-brand-primary text-brand-primary py-2 text-center rounded-md hover:bg-brand-primary hover:text-white transition">My Transactions</Link>
                    {/* MODIFIED: The logout button now also closes the menu */}
                    <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="border border-brand-primary text-brand-primary py-2 text-center rounded-md hover:bg-brand-primary hover:text-white transition">Logout</button>
                 </>
              ) : (
                 <>
                    <Link to="/login" onClick={closeMobileMenu} className="border border-brand-primary text-brand-primary py-2 text-center rounded-md hover:bg-brand-primary hover:text-white transition">Login</Link>
                     <Link to="/signup" onClick={closeMobileMenu} className="border border-brand-primary text-brand-primary py-2 text-center rounded-md hover:bg-brand-primary hover:text-white transition">Sign Up</Link>
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

