// MenuListButtonComponent.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MenuListButtonComponent = ({ toggleModal }) => {
  return (
    <View style={styles.menu}>
      {['Freie Route', 'Manuell Route eingeben', 'Filter Route', 'Schnelle Route'].map((item, index) => (
        <TouchableOpacity key={index} style={styles.menuItem} onPress={toggleModal}>
          <Text>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // Weitere Styling-Optionen
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: 'blue',
    // Weitere Styling-Optionen
  },
});

export default MenuListButtonComponent;
