import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MapViewComponent from '../components/MapViewComponent';
import RouteConfigButtonComponent from "../components/RouteConfigButtonComponent";
import GooglePlacesInputComponent from '../components/GooglePlacesInputComponent';
import SearchBarDestinationComponent from '../components/SearchBarDestinationComponent';
import { calcRouteUsingCoords } from '../services/routeService';

const MapScreen = () => {
  const [route, setRoute] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null); 

  useEffect(() => {
    const getRoute = async () => {
      console.log(startLocation, destinationLocation);
      if (startLocation && destinationLocation) {  // Überprüfen, ob beide Standorte gesetzt sind
        const coordinates = await calcRouteUsingCoords(startLocation.place_id, destinationLocation.place_id);
        console.log('Route: ', coordinates);
        setRoute(coordinates);
      }
    };

    if (startLocation && destinationLocation) {  // Nur ausführen, wenn beide Standorte gesetzt sind
      getRoute();
    }
  }, [startLocation, destinationLocation]);  // Abhängigkeiten hinzufügen

  const handleLocationSelect = (location) => {
    console.log('Start Standort:', location);
    setStartLocation(location);
  };

  const handleLocationSelect2 = (location) => {
    console.log('Ziel Standort:', location);
    setDestinationLocation(location);
  };
  
  return (
    <View style={styles.container}>
      <MapViewComponent route={route} />
      {/* GooglePlacesInputComponent muss eine Layer über SearchBarDestinationComponent */}
      <GooglePlacesInputComponent onLocationSelect={handleLocationSelect} />
      <SearchBarDestinationComponent onLocationSelect={handleLocationSelect2} />
      <RouteConfigButtonComponent />
    </View>
  );

};

const styles = {
  container: {
    flex: 1,
  },
};

export default MapScreen;
