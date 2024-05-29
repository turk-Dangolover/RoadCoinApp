import { useEffect, useState } from 'react';
import { calcRouteUsingCoords, generateRandomRoute, getCurrentLocationWithPlaceId } from '../services/routeService';
import calcGainableCoins from '../services/coinService';

const useRouteConfig = () => {
  const [route, setRoute] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [routeConfig, setRouteConfig] = useState({
    ManuelleRoute: false,
    FreieRoute: false,
  });
  const [distance, setDistance] = useState(0);
  const [coins, setCoins] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false);
  const [coordinatesFreieRoute, setCoordinatesFreieRoute] = useState([]);

  // useEffect Hook zum Berechnen der Route, wenn Start- und Zielort gesetzt sind (manuelle Route)
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
  
  // useEffect Hook zum Generieren einer Freien Route
  useEffect(() => {
    const getFreieRoute = async () => {
      console.log('Generiere Freie Route');
      const coordinates = await generateRandomRoute(3000);
      setDistance(coordinates.distance);
      setRoute(coordinates.route);
      setCoordinatesFreieRoute(coordinates.route);
      setCoins(await calcGainableCoins(coordinates.distance));
    };

    if(routeConfig.FreieRoute){
      getFreieRoute();
    }
  }, [routeConfig.FreieRoute]); // Überprüfe nur, wenn Freie Route aktiviert wird







  // Funktion zum Ein- und Ausschalten der Sichtbarkeit von Routenmenüs
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

  const hideFreieRoute = () => {
    setRouteConfig((prevState) => ({ ...prevState, FreieRoute: false }));
    setRoute([]);
    setStartLocation(null);
    setDestinationLocation(null);
    setIsNavigating(false);
    setCoins(0);
    setDistance(0);
    setDestinationLocation(null);
    setCoordinatesFreieRoute([]);
  }

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
    hideFreieRoute,
    isAnyRouteActive,
    distance,
    coins,
    isNavigating,
    setIsNavigating,
    setCoins,
    coordinatesFreieRoute,
  };
};

export default useRouteConfig;
