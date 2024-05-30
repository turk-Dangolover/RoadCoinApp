import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const ChangePasswordScreen = ({ verification_id, changeScreen }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const serverip4 = process.env.SERVER_IP4;

  const handleChangePassword = async () => {
    const data = {
      verification_id: verification_id,
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    try {
      const response = await fetch(`${serverip4}/userData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response');
      }

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', result.message || 'Passwort wurde erfolgreich geändert');
        changeScreen('Profile');
      } else {
        Alert.alert('Error', result.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to change password');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => changeScreen('Account')}>
        <FontAwesome5 name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Change Password</Text>
      <Text style={styles.label}>Old Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TouchableOpacity style={styles.changeButton} onPress={handleChangePassword}>
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
    marginBottom: 50,
    marginTop: 50,
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 50,
  },
  changeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#252826',
  },
});

export default ChangePasswordScreen;
