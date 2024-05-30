// src/screens/MapScreen.tsx
import { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import MapViewComponent from "../components/MapView/MapViewComponent";
import useRouteConfig from "../hooks/useRouteConfig";
import ManuelleRouteComponent from "../components/MapView/manuelle route/ManuelleRouteComponent";
import RouteConfigButtonComponent from "../components/MapView/RouteConfigButtonComponent";
import { calcRouteUsingCoords, getPlaceIdFromCoords } from "../services/routeService";
import SuccessModal from "../components/MapView/manuelle route/SuccessModal";
import SchnelleRouteComponent from "../components/MapView/schnelle route/SchnelleRouteComponent";
import useLocation from "../hooks/useLocation";

const MapScreen = ({ verification_id }) => {
  const {
    route,
    routeConfig,
    setStartLocation,
    setDestinationLocation,
    startLocation,
    destinationLocation,
    toggleVisibility,
    hideManuelleRoute,
    hideSchnelleRoute,
    isAnyRouteActive,
    distance,
    coins,
    isNavigating,
    setIsNavigating,
    coordinatesSchnelleRoute
  } = useRouteConfig();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [visitedLocations, setVisitedLocations] = useState([]);
  const mapViewRef = useRef(null);
  const { location, fetchLocation } = useLocation();

  const handleStartPress = () => {
    setIsNavigating(true);
    setVisitedLocations([]);
    console.log("Route started");
  };

  useEffect(() => {
    const setDestination = async () => {
      if (!destinationLocation && routeConfig.SchnelleRoute && coordinatesSchnelleRoute.length > 0) {
        console.log('Set destination location');
        const destinationCoords = coordinatesSchnelleRoute[coordinatesSchnelleRoute.length - 1];
        const placeId = await getPlaceIdFromCoords(destinationCoords.latitude, destinationCoords.longitude);
        
        const destination = {
          ...destinationCoords,
          place_id: placeId
        };
  
        setDestinationLocation(destination);
        console.log(destination);
      }
    };
  
    setDestination();
  }, [routeConfig.SchnelleRoute, coordinatesSchnelleRoute, destinationLocation]);
  
  useEffect(() => {
    if (isNavigating && destinationLocation) {
      const interval = setInterval(async () => {
        const newLocation = await fetchLocation();
        if (newLocation) {
          console.log("Current location: ", newLocation.placeId);
          checkIfRouteCompleted(newLocation.placeId);
          setVisitedLocations(prevLocations => [...prevLocations, newLocation]);
        }
      }, 2000);
  
      return () => clearInterval(interval);
    }
  }, [isNavigating, destinationLocation, fetchLocation]);
  
  const checkIfRouteCompleted = async (startLocationPlaceId) => {
    console.log('Hier: ' + JSON.stringify(destinationLocation));
    if (destinationLocation) {
      const distanceToDestination = await calcRouteUsingCoords(
        startLocationPlaceId,
        destinationLocation.place_id
      );
      console.log("Distance to destination:", distanceToDestination.distance);
      if (distanceToDestination.distance <= 15) {
        setIsNavigating(false);
        console.log("Route completed");
        setIsModalVisible(true);
      }
    }
  };

  const handleHideManuelleRoute = () => {
    hideManuelleRoute();
    setVisitedLocations([]);
  };

  const handleCloseModal = () => {
    setVisitedLocations([]);
    setIsModalVisible(false);
    setStartLocation(null);
    setDestinationLocation(null);
    setIsNavigating(false);
  };

  return (
    <View style={styles.container}>
      <MapViewComponent
        route={route}
        mapViewRef={mapViewRef}
        onVisitedLocationsChange={setVisitedLocations}
        isNavigating={isNavigating}
        visitedLocations={visitedLocations}
      />

      {routeConfig.ManuelleRoute && (
        <ManuelleRouteComponent
          hideManuelleRoute={handleHideManuelleRoute}
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

      {routeConfig.SchnelleRoute && (
        <SchnelleRouteComponent
          hideSchnelleRoute={hideSchnelleRoute}
          onStartPress={handleStartPress}
          distance={distance}
          coins={coins}
          isNavigating={isNavigating}
        />
      )}

      {!isAnyRouteActive() && (
        <RouteConfigButtonComponent
          routeConfig={routeConfig}
          toggleVisibility={toggleVisibility}
        />
      )}
      <SuccessModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        visitedLocations={visitedLocations}
        verification_id={verification_id}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },
};

export default MapScreen;
