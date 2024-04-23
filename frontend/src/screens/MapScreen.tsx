import React, { useEffect, useState } from 'react';
import { View, Button } from 'react-native';
import MapViewComponent from '../components/MapViewComponent';
import { fetchRandomRoute } from '../services/routeService';
import { fetchRandomRoute2 } from '../services/routeService';

const MapScreen = () => {
  const [route, setRoute] = useState([]);
  console.log('MapScreen route: ', route);

  useEffect(() => {
    const getRoute = async () => {
      const coordinates = await fetchRandomRoute();
      setRoute(coordinates);
    };

    getRoute();
  }, []);

  const handleShowRoute = async () => {
    const coordinates = await fetchRandomRoute2();
    setRoute(coordinates);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapViewComponent route={route} />
      <Button title="Route anzeigen" onPress={handleShowRoute} />
    </View>
  );
};

export default MapScreen;
