import React, { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import MapViewComponent from '../components/MapViewComponent';
import { fetchRandomRoute } from '../services/routeService';
import { fetchRandomRoute2 } from '../services/routeService';
import MenuOverlayComponent from "../components/MenuOverlayComponent";
import RouteConfigButtonComponent from "../components/RouteConfigButtonComponent";
import Test from "../components/Test";

const MapScreen = () => {
  const [route, setRoute] = useState([]);

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

  const [isMenuVisible, setMenuVisible] = useState(false);
  const animationController = new Animated.Value(0);

  const handleMenuToggle = () => {
    const toValue = isMenuVisible ? 0 : 1;
    Animated.timing(animationController, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setMenuVisible(!isMenuVisible);
  }

  return (
    <View style={styles.container}>
      <MapViewComponent route={route} />
      <RouteConfigButtonComponent />
      {/* <MenuOverlayComponent isVisible={animationController} /> */}
    </View>
  );

};

const styles = {
  container: {
    flex: 1,
  },
};

export default MapScreen;
