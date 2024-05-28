import { useState, useEffect, useRef } from 'react';
import { View, Button, Text } from 'react-native';
import MapViewComponent from '../components/MapView/MapViewComponent';
import useRouteConfig from '../hooks/useRouteConfig';
import * as Location from 'expo-location';
import ManuelleRouteComponent from '../components/MapView/manuelle route/ManuelleRouteComponent';
import RouteConfigButtonComponent from '../components/MapView/RouteConfigButtonComponent';

const MapScreen = () => {
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
  } = useRouteConfig();

  const [isNavigating, setIsNavigating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapViewRef = useRef(null);

  const handleStartPress = () => {
    setIsNavigating(true);
    console.log('Route started');
  };

  useEffect(() => {
    if (isNavigating) {
      const interval = setInterval(async () => {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setCurrentLocation(location.coords);
        checkIfRouteCompleted(location.coords);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isNavigating]);

  const checkIfRouteCompleted = (currentCoords) => {
    if (destinationLocation) {
      const distanceToDestination = haversineDistance(currentCoords, destinationLocation);
      if (distanceToDestination < 50) { // 50 Meter als Schwellenwert
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

const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // Erdradius in km
  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);

  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c * 1000; // Distanz in Metern
  return d;
};
