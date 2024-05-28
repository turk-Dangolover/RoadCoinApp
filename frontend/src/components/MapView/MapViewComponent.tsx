// MapViewComponent.js
import React, { useState, useEffect, useRef } from 'react';
import MapView, { Circle, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { getCurrentLocationWithPlaceId } from '../../services/routeService';
import { ActivityIndicator, Text } from 'react-native';
import { View } from 'react-native';

const MapViewComponent = ({ route, mapViewRef }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLocation = async () => {
      const fetchedLocation = await getCurrentLocationWithPlaceId();
      if (isMounted) {
        setLocation(fetchedLocation);
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
      }
    }, 5000);
  
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [route]);
  

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
      {route.length > 0 && 
      <>
        <Circle
              center={route[0]}
              radius={50}
              fillColor="rgba(0, 0, 255, 0.5)"
              strokeColor="rgba(0, 0, 255, 0.5)"
        />
        <Marker coordinate={route[route.length - 1]} title={"Ziel"} />
        <Polyline
          coordinates={route}
          strokeWidth={6}
          strokeColor="red"
          lineCap="round"
          lineJoin="round"
          strokeColors={[
            '#7F0000',
            '#00000000',
            '#B24112',
            '#E5845C',
            '#238C23',
            '#7F0000'
          ]}
        />
      </>
      }
    </MapView>
  ) : (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>Standord wird gesucht...</Text>
    </View>  
  );
};

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default MapViewComponent;
