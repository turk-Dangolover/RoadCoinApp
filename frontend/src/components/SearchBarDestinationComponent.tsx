import React, { useEffect, useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { StyleSheet, View } from 'react-native';

const SearchBarDestinationComponent = ({ onLocationSelect }) => {
  const [location, setLocation] = useState(null);
  const [isFocused, setIsFocused] = useState(false);  // Zustand für den Fokus

  useEffect(() => {
    (async () => {
      if (location) {
        setLocation(location);
      }
    })();
  }, []);

  return (
    <View style={[styles.container, isFocused ? { zIndex: 1 } : {}]}>
      <GooglePlacesAutocomplete
        placeholder='Suche'
        onPress={(data, details = null) => {
          onLocationSelect(details);
          setIsFocused(false);  // Fokus aufheben nach Auswahl
        }}
        query={{
          key: process.env.GOOGLE_MAPS_KEY,
          language: 'de',
        }}
        currentLocationLabel="Mein Standort"
        textInputProps={{
          onFocus: () => setIsFocused(true),  // Fokus setzen
          onBlur: () => setIsFocused(false),  // Fokus aufheben
        }}
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
    top: '10%',
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

export default SearchBarDestinationComponent;