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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [visitedLocations, setVisitedLocations] = useState([]);
  const mapViewRef = useRef(null);

  const handleStartPress = () => {
    setIsNavigating(true);
    setVisitedLocations([]);
    console.log("Route started");
  };

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
        setIsModalVisible(true);
      }
    }
  };

  const handleVisitedLocationsChange = (locations) => {
    if (isNavigating) {
      setVisitedLocations(locations);
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
  };

  return (
    <View style={styles.container}>
      <MapViewComponent
        route={route}
        mapViewRef={mapViewRef}
        onVisitedLocationsChange={handleVisitedLocationsChange}
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

      {routeConfig.FreieRoute && (
        <FreieRouteComponent
          hideFreieRoute={hideManuelleRoute}
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
        visitedLocations={visitedLocations}
        verification_id={verification_id}      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },
};

export default MapScreen;
