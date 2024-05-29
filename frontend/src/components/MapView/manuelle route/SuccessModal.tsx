import React from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';
import { calculateDistance } from '../../../services/distanceService';
import calcGainableCoins, { calcGainableCoinsNotAsynch } from '../../../services/coinService';

const SuccessModal = ({ visible, onClose, visitedLocations }) => {
  const totalDistance = calculateDistance(visitedLocations);
  let coins  = calcGainableCoinsNotAsynch(totalDistance);
  console.log("Total distance:", JSON.stringify(totalDistance));
  
  const data = {
    coins: coins,
    distance: totalDistance,
  };


  // TODO: Send coins and distance to backend 

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
