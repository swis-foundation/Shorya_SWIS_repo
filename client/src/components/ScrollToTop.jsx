import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component will automatically scroll the window to the top on every route change.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // The effect runs every time the pathname changes

  return null; // This component does not render anything to the DOM
};

export default ScrollToTop;
