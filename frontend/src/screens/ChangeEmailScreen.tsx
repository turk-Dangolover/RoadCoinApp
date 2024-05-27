// src/screens/ChangeEmailScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const ChangeEmailScreen = ({ verification_id, changeScreen }) => {
  const [password, setPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const serverip4 = process.env.SERVER_IP4;

  const handleChangeEmail = async () => {
    const data = {
      verification_id: verification_id,
      password: password,
      newEmail: newEmail,
    };

    try {
      const response = await fetch(`${serverip4}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Alert.alert('Success', 'E-Mail wurde erfolgreich geändert');
        changeScreen('Profile'); // Navigate back to Profile
      } else {
        const result = await response.json();
        Alert.alert('Error', result.message || 'Failed to change email');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to change email');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => changeScreen('Account')}>
        <FontAwesome5 name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Change E-mail</Text>
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.label}>New E-mail</Text>
      <TextInput
        style={styles.input}
        value={newEmail}
        onChangeText={setNewEmail}
      />
      <TouchableOpacity style={styles.changeButton} onPress={handleChangeEmail}>
        <Text style={styles.changeButtonText}>Change</Text>
      </TouchableOpacity>
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
    marginTop: 50,
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#252826',
    alignSelf: 'center',
    marginBottom: 50,
  },
  label: {
    fontSize: 18,
    color: '#252826',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 18,
  },
  changeButton: {
    marginTop: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  changeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#252826',
  },
});

export default ChangeEmailScreen;
