import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapScreen from './src/screens/MapScreen';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <MapScreen />
    </View>
  );
}

