import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Button, Alert } from 'react-native';
import { calculateDistance } from '../../../services/distanceService';
import calcGainableCoins, { calcGainableCoinsNotAsynch } from '../../../services/coinService';

const SuccessModal = ({ visible, onClose, visitedLocations, verification_id }) => {
  const totalDistance = Math.ceil(calculateDistance(visitedLocations)); // Auf die nächste ganze Zahl aufrunden
  const coins = Math.ceil(calcGainableCoinsNotAsynch(totalDistance)); // Auf die nächste ganze Zahl aufrunden
  const steps = Math.ceil(totalDistance * 1.7); // Auf die nächste ganze Zahl aufrunden
  
  const data = {
    coins: coins,
    distance: totalDistance,
    steps: steps,
    verification_id: verification_id,
  };

  useEffect(() => {
    if (visible) {
      sendStatsToBackend();
    }
  }, [visible]);

  const sendStatsToBackend = async () => {
    try {
      const response = await fetch(`${process.env.SERVER_IP1}/update/stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Stats updated successfully');
      } else {
        console.error('Failed to update stats');
        Alert.alert('Error', 'Failed to update stats');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to update stats');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Toll gemacht!</Text>
          <Text style={styles.modalText}>Du hast {totalDistance.toFixed(0)} Meter zurückgelegt und {coins} Münzen gesammelt.</Text>
          <Button onPress={onClose} title="Schließen" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default SuccessModal;
