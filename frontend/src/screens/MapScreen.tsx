import { useState, useEffect, useRef } from 'react';
import { View, Button, Text } from 'react-native';
import MapViewComponent from '../components/MapView/MapViewComponent';
import useRouteConfig from '../hooks/useRouteConfig';
import * as Location from 'expo-location';
import ManuelleRouteComponent from '../components/MapView/manuelle route/ManuelleRouteComponent';
import RouteConfigButtonComponent from '../components/MapView/RouteConfigButtonComponent';
import { calcRouteUsingCoords, getCurrentLocationWithPlaceId } from '../services/routeService';

const MapScreen = ({verification_id}) => {
  const {
    route,
    routeConfig,
    setStartLocation,
    setDestinationLocation,
    startLocation, 
    destinationLocation, 
    toggleVisibility,
    hideManuelleRoute,
    isAnyRouteActive,
    distance,
    coins,
    isNavigating,
    setIsNavigating,
  } = useRouteConfig();

  const [currentLocation, setCurrentLocation] = useState(null);
  const mapViewRef = useRef(null);


  const handleStartPress = () => {
    setIsNavigating(true);
    console.log('Route started');
  };

// useEffect Hook zum Abfragen der aktuellen Position in einem Intervall
useEffect(() => {
  if (isNavigating) {
    const interval = setInterval(async () => {
      const location = await getCurrentLocationWithPlaceId();
      if (location) {
        setCurrentLocation(location);
        checkIfRouteCompleted(location.placeId);
      }
    }, 5000);

    return () => clearInterval(interval);
  }
}, [isNavigating]);

const checkIfRouteCompleted = async (startLocationPlaceId) => {
  if (destinationLocation) {
    const distanceToDestination = (await calcRouteUsingCoords(startLocationPlaceId, destinationLocation.place_id));
    console.log('Distance to destination:', distanceToDestination.distance);
    if (distanceToDestination.distance < 15) {
      setIsNavigating(false);
      console.log('Route completed');
      alert('Route abgeschlossen!');
      
    }
  }
};

  return (
    <View style={styles.container}>
      <MapViewComponent route={route} mapViewRef={mapViewRef}/>

      {routeConfig.ManuelleRoute && (
        <ManuelleRouteComponent
          hideManuelleRoute={hideManuelleRoute}
          handleLocationSelect={setStartLocation}
          handleLocationSelect2={setDestinationLocation}
          startLocation={startLocation}
          destinationLocation={destinationLocation}
          onStartPress={handleStartPress}
          distance={distance}
          coins={coins}
          isNavigating={isNavigating}
        />
      )}
      {!isAnyRouteActive() && (
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