// MenuListButtonComponent.js
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MenuListButtonComponent = ({ name, onPress }) => {
  return (
    <View style={styles.container}>
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <MaterialCommunityIcons name="map" size={30} color="black" />
        <Text style={styles.buttonText}>{name}</Text>
      </TouchableOpacity>
      {/* Einen grauen dünne Strich zur abgrenzung der ganz unten ist */}
      <View style={{borderBottomColor: 'grey', borderBottomWidth: 1, width: '100%' }} />  
     </View>	
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '25%',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: '#FAF9F6',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Änderung hier
    width: '100%', 
    height: '100%',
    paddingLeft: 20, // Fügen Sie etwas Abstand links hinzu, damit es nicht direkt am Rand ist.
  },

  buttonText: {
    color: 'black',
    fontSize: 25,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  }
});
export default MenuListButtonComponent;
