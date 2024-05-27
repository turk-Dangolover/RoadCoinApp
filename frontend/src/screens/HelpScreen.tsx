// src/screens/HelpScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const HelpScreen = ({ changeScreen }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => changeScreen('Account')}>
        <FontAwesome5 name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Help</Text>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>Coming soon...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EBF2F6',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 50,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#252826',
    alignSelf: 'center',
    marginBottom: 20,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 24,
    color: '#252826',
  },
});

export default HelpScreen;
