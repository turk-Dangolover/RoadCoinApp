import { useEffect, useState } from 'react';
import { calcRouteUsingCoords, generateRandomRoute, getCurrentLocationWithPlaceId } from '../services/routeService';
import calcGainableCoins from '../services/coinService';

const useRouteConfig = () => {
  const [route, setRoute] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [routeConfig, setRouteConfig] = useState({
    ManuelleRoute: false,
    SchnelleRoute: false,
  });
  const [distance, setDistance] = useState(0);
  const [coins, setCoins] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false);
  const [coordinatesSchnelleRoute, setCoordinatesSchnelleRoute] = useState([]);

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
  
  // useEffect Hook zum Generieren einer Schnellen Route
  useEffect(() => {
    const getSchnelleRoute = async () => {
      console.log('Generiere Schnelle Route');
      const coordinates = await generateRandomRoute(3000);
      setDistance(coordinates.distance);
      setRoute(coordinates.route);
      setCoordinatesSchnelleRoute(coordinates.route);
      setCoins(await calcGainableCoins(coordinates.distance));
    };

    if(routeConfig.SchnelleRoute){
      getSchnelleRoute();
    }
  }, [routeConfig.SchnelleRoute]); // Überprüfe nur, wenn Schnelle Route aktiviert wird







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

  const hideSchnelleRoute = () => {
    setRouteConfig((prevState) => ({ ...prevState, SchnelleRoute: false }));
    setRoute([]);
    setStartLocation(null);
    setDestinationLocation(null);
    setIsNavigating(false);
    setCoins(0);
    setDistance(0);
    setDestinationLocation(null);
    setCoordinatesSchnelleRoute([]);
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
    hideSchnelleRoute,
    isAnyRouteActive,
    distance,
    coins,
    isNavigating,
    setIsNavigating,
    setCoins,
    coordinatesSchnelleRoute,
  };
};

export default useRouteConfig;
