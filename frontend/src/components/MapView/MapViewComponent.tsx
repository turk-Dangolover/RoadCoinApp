import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { getCurrentLocationWithPlaceId } from "../../services/routeService";
import { ActivityIndicator, Text } from "react-native";
import { View } from "react-native";

const MapViewComponent = ({
  route,
  mapViewRef,
  onVisitedLocationsChange,
  isNavigating,
  visitedLocations,
}) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLocation = async () => {
      const fetchedLocation = await getCurrentLocationWithPlaceId();
      if (isMounted) {
        setLocation(fetchedLocation);
        if (isNavigating) {
          onVisitedLocationsChange([fetchedLocation]);
        }
      }
    };

    fetchLocation();

    if (route.length > 0 && mapViewRef.current) {
      mapViewRef.current.fitToCoordinates(route, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }

    const interval = setInterval(async () => {
      const newLocation = await getCurrentLocationWithPlaceId();
      if (isMounted) {
        setLocation(newLocation);
        if (isNavigating) {
          onVisitedLocationsChange((prevLocations) => {
            const updatedLocations = [...prevLocations, newLocation];
            return updatedLocations;
          });
        }
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [route, isNavigating]);

  return location ? (
    <MapView
      ref={mapViewRef}
      provider={PROVIDER_GOOGLE}
      style={{ flex: 1 }}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      showsUserLocation
      followsUserLocation
    >
      {route.length > 0 && (
        <>
          <Marker coordinate={route[0]} title={"Start"} pinColor={"blue"} />
          <Marker coordinate={route[route.length - 1]} title={"Ziel"} />
          <Polyline
            coordinates={route}
            strokeWidth={6}
            strokeColor="red"
            lineCap="round"
            lineJoin="round"
          />
        </>
      )}
      {isNavigating && visitedLocations.length > 0 && (
        <Polyline
          coordinates={visitedLocations}
          strokeWidth={6}
          strokeColor="blue"
          lineCap="round"
          lineJoin="round"
        />
      )}
    </MapView>
  ) : (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>Standord wird gesucht...</Text>
    </View>
  );
};

import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default MapViewComponent;
