import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { getCurrentLocation } from '../services/routeService';
import { Text } from 'react-native';

const MapViewComponent = ({ route }) => {
  const [location, setLocation] = useState(null);
  const mapViewRef = useRef(null);

  // Effect hook to fetch location on component mount
  useEffect(() => {
    const fetchLocation = async () => {
      const fetchedLocation = await getCurrentLocation();
      setLocation(fetchedLocation);
    };

    fetchLocation();
    
    if (route.length > 0) {
      mapViewRef.current.fitToCoordinates(route, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [route]);


  console.log('MapViewComponent location: ', location)
  return location ? (
    <MapView
    ref={mapViewRef}
      provider={PROVIDER_GOOGLE}
      style={{ flex: 1 }}
      initialRegion={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {route.length > 0 && 
      <>
      <Marker coordinate={route[0]} title={"Startpunkt"} />
      <Marker coordinate={route[route.length - 1]} title={"Endpunkt"} />
      <Polyline
        coordinates={route}
        strokeWidth={6}
        strokeColor="red"
        lineCap="round"
        lineJoin="round"
        strokeColors={[
          '#7F0000',
          '#00000000', // Transparent, um einen Gradienten zu schaffen
          '#B24112',
          '#E5845C',
          '#238C23',
          '#7F0000' // Wieder Rot am Ende
        ]}
      />
      </>
      }
    </MapView>
  ) : (
    <Text>Loading location...</Text>  // Placeholder text or component while location is loading
  );
};

export default MapViewComponent;