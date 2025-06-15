
import { useEffect } from "react";
import { useLocation } from "react-router";

const ScrollToTopAuto = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Add a class to the body to trigger page transition animations
    document.body.classList.add('page-transition-out');
    
    // Scroll to top with smooth animation
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // After small delay, switch classes to trigger entrance animations
    const timeout = setTimeout(() => {
      document.body.classList.remove('page-transition-out');
      document.body.classList.add('page-transition-in');
      
      // Remove the entrance class after animations complete
      const cleanupTimeout = setTimeout(() => {
        document.body.classList.remove('page-transition-in');
      }, 1000);
      
      return () => clearTimeout(cleanupTimeout);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

export default ScrollToTopAuto;
