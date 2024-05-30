import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ setVerificationId, setActiveScreen }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const serverip2 = process.env.SERVER_IP2;

  useEffect(() => {
    const checkLogin = async () => {
      const storedVerificationId = await AsyncStorage.getItem('verification_id');
      if (storedVerificationId) {
        setVerificationId(storedVerificationId);
        setActiveScreen('Map');
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    const data = {
      username: username,
      password: password
    };

    try {
      const response = await fetch(`${serverip2}`, {
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
        await AsyncStorage.setItem('verification_id', result.verification_id);
        setVerificationId(result.verification_id);
        setActiveScreen('Map');
        console.log("Verification ID:", result.verification_id);
      } else {
        alert(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      if (error.message === 'Received non-JSON response') {
        console.log('Specific error: Received non-JSON response');
        Alert.alert('Error', 'Login failed. Please try again.');
      } else if (error.message.includes('Network request failed')) {
        console.log('Specific error: Network request failed');
        Alert.alert('Error', 'Network error. Please check your connection and try again.');
      } else {
        console.log('Specific error:', error.message);
        Alert.alert('Error', 'Login failed. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Benutzername"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Passwort"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Einloggen</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => setActiveScreen('Registration')}>
        <Text style={styles.buttonSecondaryText}>Noch kein Konto? Registrieren</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#3998E8',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonSecondary: {
    marginTop: 15,
  },
  buttonSecondaryText: {
    color: '#3998E8',
    fontSize: 16,
    textAlign: 'center',
  },
});
