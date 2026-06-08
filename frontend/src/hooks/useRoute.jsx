import { useState, useEffect } from 'react';

export const useRoute = () => {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(window.location.pathname);
    };

    // Listen to browser popstate (back/forward buttons)
    window.addEventListener('popstate', handleLocationChange);
    
    // Listen to custom navigation changes
    window.addEventListener('pushstate-change', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate-change', handleLocationChange);
    };
  }, []);

  const navigate = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new Event('pushstate-change'));
    }
  };

  return [route, navigate];
};
