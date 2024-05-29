import { useEffect, useState } from 'react';
import { calcRouteUsingCoords, getCurrentLocationWithPlaceId } from '../services/routeService';
import calcGainableCoins from '../services/coinService';

const useRouteConfig = () => {
  const [route, setRoute] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [routeConfig, setRouteConfig] = useState({
    ManuelleRoute: false,
    FilterRoute: false,
    SchnelleRoute: false,
    FreieRoute: false,
  });
  const [distance, setDistance] = useState(0);
  const [coins, setCoins] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false);


  useEffect(() => {
    const getRoute = async () => {
      if (startLocation && destinationLocation) {
        if (startLocation.description === 'Aktueller Standort') {
          startLocation.place_id = (await getCurrentLocationWithPlaceId()).placeId;
        }
        const coordinates = await calcRouteUsingCoords(startLocation.place_id, destinationLocation.place_id);
        setDistance(coordinates.distance);
        setRoute(coordinates.route);
        setCoins(await calcGainableCoins(coordinates.distance));
      }
    };
  
    if (startLocation && destinationLocation) {
      getRoute();
    }
  }, [startLocation, destinationLocation]); // Überprüfe nur, wenn Start- und Zielort sich ändern
  

  const toggleVisibility = (key) => {
    setRouteConfig((prevState) => ({ ...prevState, [key]: !prevState[key] }));
  };

  const hideManuelleRoute = () => {
    setRouteConfig((prevState) => ({ ...prevState, ManuelleRoute: false }));
    setRoute([]);
    setStartLocation(null);
    setDestinationLocation(null);
    setIsNavigating(false);
    setCoins(0);
    setDistance(0);
  };

  const isAnyRouteActive = () => {
    return Object.values(routeConfig).some((visible) => visible);
  };

  return {
    route,
    routeConfig,
    startLocation,
    destinationLocation,
    setStartLocation,
    setDestinationLocation,
    toggleVisibility,
    hideManuelleRoute,
    isAnyRouteActive,
    distance,
    coins,
    isNavigating,
    setIsNavigating,
    setCoins,
  };
};

export default useRouteConfig;
