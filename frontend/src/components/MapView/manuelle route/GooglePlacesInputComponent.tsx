import React, { useEffect, useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { getCurrentLocationWithPlaceId } from '../../../services/routeService';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const GooglePlacesInputComponent = ({ onLocationSelect }) => {
  const [location, setLocation] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    (async () => {
      let location = await getCurrentLocationWithPlaceId();
      if (location) {
        setLocation(location);
      }
    })();
  }, []);

  return (
    <View style={[styles.container, isFocused ? { zIndex: 3 } : { zIndex: 1 }]}>
      <GooglePlacesAutocomplete
        placeholder='Suche'
        onPress={(data, details = null) => {
          onLocationSelect(details);
          setIsFocused(false);
        }}
        query={{
          key: process.env.GOOGLE_MAPS_KEY,
          language: 'de',
        }}
        currentLocationLabel="Mein Standort"
        predefinedPlaces={location ? [{
          description: 'Aktueller Standort',
          geometry: { location: { lat: location.latitude, lng: location.longitude } }
        }] : []}
        renderRightButton={() => (
          <View style={styles.myLocationButton}>
            <Icon name="my-location" size={20} color="#000" />
          </View>
        )}
        textInputProps={{
          onFocus: () => setIsFocused(true),
          onBlur: () => setIsFocused(false),
        }}
        styles={{
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
          predefinedPlacesDescription: styles.predefinedPlacesDescription,
          listView: styles.listView,
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
    left: '10%',
    zIndex: 1,
  },
  textInputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 0,
    borderBottomWidth: 0,
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
  },
  listView: {
    position: 'absolute',
    top: 38, // Direkt unterhalb des TextInputs platzieren
    left: 0,
    right: 0,
    zIndex: 3,
  },
});

export default GooglePlacesInputComponent;
