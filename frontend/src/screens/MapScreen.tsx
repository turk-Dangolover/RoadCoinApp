import React from 'react';
import { View } from 'react-native';
import MapViewComponent from '../components/MapView/MapViewComponent';
import RouteConfigButtonComponent from '../components/MapView/RouteConfigButtonComponent';
import ManuelleRouteComponent from '../components/MapView/manuelle route/ManuelleRouteComponent';
import useRouteConfig from '../hooks/useRouteConfig';

const MapScreen = () => {
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
  } = useRouteConfig();

  const handleStartPress = () => {
    console.log('Route started');
    console.log('Start location:', isAnyRouteActive);
    console.log('Destination location:', setDestinationLocation);
  };

  return (
    <View style={styles.container}>
      <MapViewComponent route={route} />

      {routeConfig.ManuelleRoute && (
        <ManuelleRouteComponent
          hideManuelleRoute={hideManuelleRoute}
          handleLocationSelect={setStartLocation}
          handleLocationSelect2={setDestinationLocation}
          startLocation={startLocation}
          destinationLocation={destinationLocation}
          onStartPress={handleStartPress}
          distance={distance}
          coins={coins}
        />
      )}

      {!isAnyRouteActive() && (
        <RouteConfigButtonComponent routeConfig={routeConfig} toggleVisibility={toggleVisibility} />
      )}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },
};

export default MapScreen;
