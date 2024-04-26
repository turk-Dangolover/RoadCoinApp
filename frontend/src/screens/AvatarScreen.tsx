// AvatarScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AvatarScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dies ist der Avatar-Bildschirm</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EBF2F6',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AvatarScreen;
