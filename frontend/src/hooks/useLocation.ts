// src/hooks/useLocation.js
import { useState, useEffect } from 'react';
import { getCurrentLocationWithPlaceId } from '../services/routeService';

const useLocation = () => {
  const [location, setLocation] = useState(null);

  const fetchLocation = async () => {
    const fetchedLocation = await getCurrentLocationWithPlaceId();
    setLocation(fetchedLocation);
    return fetchedLocation;
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return { location, fetchLocation };
};

export default useLocation;
