import { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import MapViewComponent from "../components/MapView/MapViewComponent";
import useRouteConfig from "../hooks/useRouteConfig";
import ManuelleRouteComponent from "../components/MapView/manuelle route/ManuelleRouteComponent";
import RouteConfigButtonComponent from "../components/MapView/RouteConfigButtonComponent";
import {
  calcRouteUsingCoords,
  getCurrentLocationWithPlaceId,
  getPlaceIdFromCoords,
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
    hideFreieRoute,
    isAnyRouteActive,
    distance,
    coins,
    isNavigating,
    setIsNavigating,
    coordinatesFreieRoute
  } = useRouteConfig();

  const [isModalVisible, setIsModalVisible] = useState(false); // State to handle modal visibility
  const [visitedLocations, setVisitedLocations] = useState([]); // State to store visited locations
  const mapViewRef = useRef(null);

  const handleStartPress = () => {
    setIsNavigating(true);
    setVisitedLocations([]); // Reset visited locations when navigation starts
    console.log("Route started");
  };

  useEffect(() => {
    const setDestination = async () => {
      if (!destinationLocation && routeConfig.FreieRoute && coordinatesFreieRoute.length > 0) {
        console.log('Set destination location');
        const destinationCoords = coordinatesFreieRoute[coordinatesFreieRoute.length - 1];
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
  }, [routeConfig.FreieRoute, coordinatesFreieRoute, destinationLocation]);
  
  useEffect(() => {
    if (isNavigating && destinationLocation) {
      const interval = setInterval(async () => {
        const location = await getCurrentLocationWithPlaceId();
        if (location) {
          console.log("Current location: ", location.placeId);
          checkIfRouteCompleted(location.placeId);
        }
      }, 5000);
  
      return () => clearInterval(interval);
    }
  }, [isNavigating, destinationLocation]);
  
  const checkIfRouteCompleted = async (startLocationPlaceId) => {
    console.log('Hier: ' + JSON.stringify(destinationLocation));
    if (destinationLocation) {
      const distanceToDestination = await calcRouteUsingCoords(
        startLocationPlaceId,
        destinationLocation.place_id
      );
      console.log("Distance to destination:", distanceToDestination.distance);
      if (distanceToDestination.distance < 10) {
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
    setIsNavigating(false);
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
          hideFreieRoute={hideFreieRoute} // Use updated hide function
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
