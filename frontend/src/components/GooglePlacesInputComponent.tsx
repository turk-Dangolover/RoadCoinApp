import React, { useEffect, useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { getCurrentLocation } from '../services/routeService';  // Updated path
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Vergewissern Sie sich, dass das Paket installiert ist

const GooglePlacesInputComponent = ({ onLocationSelect }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let location = await getCurrentLocation();
      if (location) {
        setLocation(location);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder='Suche'
        onPress={(data, details = null) => {  
            // Beim Auswählen eine Funktion aufrufen und die Details weitergeben
          onLocationSelect(details);
            
        }}
        query={{
          key: process.env.GOOGLE_MAPS_KEY,
          language: 'de',
        }}
        currentLocationLabel="Mein Standort"
        predefinedPlaces={[{
            description: 'Aktueller Standort',
            geometry: { location: { lat: location?.coords.latitude, lng: location?.coords.longitude } }
          }]}
        renderRightButton={() => (
          <View style={styles.myLocationButton}>
            <Icon name="my-location" size={20} color="#000" />
          </View>
        )}
        styles={{
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
          predefinedPlacesDescription: styles.predefinedPlacesDescription,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '3%',
    width: '80%',
    padding: 10,
    // mitte
    left: '10%',
  },
  textInputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    // abgerundete Ecken
    borderRadius: 10,
  },
  textInput: {
    marginLeft: 0,
    marginRight: 0,
    height: 38,
    color: '#5d5d5d',
    fontSize: 16,
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  myLocationButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  }
});

export default GooglePlacesInputComponent;