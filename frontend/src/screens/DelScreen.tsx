import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const DelScreen = ({ changeScreen, verification_id }) => {
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${process.env.SERVER_IP1}/delete/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verification_id }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Account deleted successfully');
        changeScreen('Registration');
      } else {
        Alert.alert('Error', 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to delete account');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => changeScreen('Account')}>
        <FontAwesome5 name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Delete Account</Text>
      <Text style={styles.text}>Are you sure you want to delete your account? This action cannot be undone.</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EBF2F6',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: '#252826',
    marginBottom: 40,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DelScreen;
