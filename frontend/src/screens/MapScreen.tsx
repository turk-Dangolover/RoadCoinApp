import { useState, useEffect, useRef } from "react";
import { View, Button, Text } from "react-native";
import MapViewComponent from "../components/MapView/MapViewComponent";
import useRouteConfig from "../hooks/useRouteConfig";
import * as Location from "expo-location";
import ManuelleRouteComponent from "../components/MapView/manuelle route/ManuelleRouteComponent";
import RouteConfigButtonComponent from "../components/MapView/RouteConfigButtonComponent";
import {
  calcRouteUsingCoords,
  getCurrentLocationWithPlaceId,
} from "../services/routeService";
import SuccessModal from "../components/MapView/manuelle route/SuccessModal";
import FreieRouteComponent from "../components/MapView/freie route/FreieRouteComponent";

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
    isAnyRouteActive,
    distance,
    coins,
    isNavigating,
    setIsNavigating,
    setCoins,
  } = useRouteConfig();

  const [isModalVisible, setIsModalVisible] = useState(false); // State to handle modal visibility
  const [visitedLocations, setVisitedLocations] = useState([]); // State to store visited locations
  const mapViewRef = useRef(null);

  const handleStartPress = () => {
    setIsNavigating(true);
    setVisitedLocations([]); // Reset visited locations when navigation starts
    console.log("Route started");
  };

  // useEffect Hook zum Abfragen der aktuellen Position in einem Intervall
  useEffect(() => {
    if (isNavigating) {
      const interval = setInterval(async () => {
        const location = await getCurrentLocationWithPlaceId();
        if (location) {
          checkIfRouteCompleted(location.placeId);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isNavigating]);

  const checkIfRouteCompleted = async (startLocationPlaceId) => {
    if (destinationLocation) {
      const distanceToDestination = await calcRouteUsingCoords(
        startLocationPlaceId,
        destinationLocation.place_id
      );
      console.log("Distance to destination:", distanceToDestination.distance);
      if (distanceToDestination.distance < 7) {
        setIsNavigating(false);
        console.log("Route completed");
        setIsModalVisible(true); // Show the success modal
      }
    }
  };

  const handleVisitedLocationsChange = (locations) => {
    if (isNavigating) {
      // Only update visited locations if navigating
      setVisitedLocations(locations);
    }
  };

  const handleHideManuelleRoute = () => {
    hideManuelleRoute();
    setVisitedLocations([]); // Reset visited locations when navigation stops
  };

  const handleCloseModal = () => {
    setVisitedLocations([]); // Reset visited locations when modal closes
    setIsModalVisible(false); // Hide modal
    setStartLocation(null);
    setDestinationLocation(null);
  };

  return (
    <View style={styles.container}>
      <MapViewComponent
        route={route}
        mapViewRef={mapViewRef}
        onVisitedLocationsChange={handleVisitedLocationsChange}
        isNavigating={isNavigating} // Pass isNavigating to MapViewComponent
        visitedLocations={visitedLocations} // Pass visitedLocations to MapViewComponent
      />

      {routeConfig.ManuelleRoute && (
        <ManuelleRouteComponent
          hideManuelleRoute={handleHideManuelleRoute} // Use updated hide function
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

      {routeConfig.FreieRoute && (
        <FreieRouteComponent
          hideFreieRoute={hideManuelleRoute} // Use updated hide function
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
        onClose={() => handleCloseModal()}
        visitedLocations={visitedLocations} // Pass the visited locations to the modal
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
