import React, {useState, useEffect} from 'react';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { getCurrentLocation } from '../services/routeService';
import { Text } from 'react-native';

const MapViewComponent = ({ route }) => {
  const [location, setLocation] = useState(null);

  // Effect hook to fetch location on component mount
  useEffect(() => {
    const fetchLocation = async () => {
      const fetchedLocation = await getCurrentLocation();
      setLocation(fetchedLocation);
    };

    fetchLocation();
  }, []);

  console.log('MapViewComponent location: ', location)
  return location ? (
    <MapView
    provider={PROVIDER_GOOGLE}
      style={{ flex: 1 }}
      initialRegion={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {route.length > 0 && <Polyline coordinates={route} strokeWidth={5} strokeColor="red" />}
    </MapView>
  ) : (
    <Text>Loading location...</Text>  // Placeholder text or component while location is loading
  );
};

export default MapViewComponent;