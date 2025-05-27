import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  // Get the current location using useLocation from wouter
  const [location] = useLocation();
  const lastLocationRef = useRef(location);
  
  // When location changes, scroll to top
  useEffect(() => {
    if (location !== lastLocationRef.current) {
      window.scrollTo(0, 0);
      lastLocationRef.current = location;
    }
  }, [location]);
  
  // Listen for browser back/forward navigation
  useEffect(() => {
    // Use the History API's popstate event to detect back/forward navigation
    const handlePopState = () => {
      // Force scroll to top immediately
      window.scrollTo(0, 0);
      
      // Also set a small timeout to handle Android delayed rendering
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto' // Use 'auto' for immediate scrolling
        });
      }, 50);
    };

    // Add event listener for popstate (fired when user navigates browser history)
    window.addEventListener('popstate', handlePopState);
    
    // For Android devices, we need to detect the hardware back button
    // which may trigger either popstate or just page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        window.scrollTo(0, 0);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Additional Android specific touch handler for swipe-to-back detection
    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX;
      
      // If swiped right from near the left edge (typical Android back gesture)
      if (touchStartX < 50 && diff > 100) {
        // This might be a back gesture, ensure we scroll to top
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      // Clean up all event listeners
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);
  
  // This component doesn't render anything
  return null;
}