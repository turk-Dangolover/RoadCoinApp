import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
const InfoBoxRouteComponent = ({ distance, coins }) => {

  return (
    <View style={styles.container}>
      <View style={styles.infoRow}>
        <FontAwesome name="road" size={24} color="black" />
        <Text style={styles.text}>{`Distanz: ${distance} Meter`}</Text>
      </View>
      <View style={styles.infoRow}>
        <FontAwesome name="money" size={24} color="#FFD700" />
        <Text style={styles.text}>{`Mögliche Müzen: ${coins}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default InfoBoxRouteComponent;
