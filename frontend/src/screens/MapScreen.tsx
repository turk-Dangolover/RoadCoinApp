import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MapViewComponent from '../components/MapViewComponent';
import RouteConfigButtonComponent from "../components/RouteConfigButtonComponent";
import GooglePlacesInputComponent from '../components/GooglePlacesInputComponent';
import SearchBarDestinationComponent from '../components/SearchBarDestinationComponent';
import { calcRouteUsingCoords } from '../services/routeService';

const MapScreen = ({ verification_id }) => {
  const [route, setRoute] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);

  const [routeConfig, setRouteConfig] = useState({
    ManuelleRoute: false,
    FilterRoute: false,
    SchnelleRoute: false,
    FreieRoute: false
  });

  const toggleVisibility = (key) => {
    setRouteConfig(prevState => ({ ...prevState, [key]: !prevState[key] }));
  };

  const isAnyRouteActive = routeConfig => {
    return Object.values(routeConfig).some(visible => visible);
  };

  useEffect(() => {
    const getRoute = async () => {
      console.log(startLocation, destinationLocation);
      if (startLocation && destinationLocation) {
        const coordinates = await calcRouteUsingCoords(startLocation.place_id, destinationLocation.place_id);
        console.log('Route: ', coordinates);
        setRoute(coordinates);
      }
    };

    if (startLocation && destinationLocation) {
      getRoute();
    }
  }, [startLocation, destinationLocation]);

  const handleLocationSelect = (location) => {
    console.log('Start Standort:', location);
    setStartLocation(location);
  };

  const handleLocationSelect2 = (location) => {
    console.log('Ziel Standort:', location);
    setDestinationLocation(location);
  };

  return (
    <View style={styles.container}>
      <MapViewComponent route={route} />
      {routeConfig.ManuelleRoute && (
        <>
          <GooglePlacesInputComponent onLocationSelect={handleLocationSelect} />
          <SearchBarDestinationComponent onLocationSelect={handleLocationSelect2} />
        </>
      )}
      {!isAnyRouteActive(routeConfig) && (
        <RouteConfigButtonComponent routeConfig={routeConfig} toggleVisibility={toggleVisibility} />
      )}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },
};

export default MapScreen;
