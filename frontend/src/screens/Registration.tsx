import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MessageScreen from './MessageScreen';

export default function Registration( setActiveScreen, verificationId ) {
  const [activeScreen, setActiveScreenLocal] = useState('Registration');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const serverip = process.env.SERVER_IP;

  const handleRegistration = async () => {
    const data = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const response = await fetch(`${serverip}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.text();

      if (response.ok) {
        Alert.alert("Registrierung erfolgreich");
        setActiveScreenLocal('MessageScreen');
      } else {
        Alert.alert("Fehler", result);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
    }
  };

  if (activeScreen === 'MessageScreen') {
    return <MessageScreen verificationId={verificationId} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrierung</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
        />
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
      <TouchableOpacity style={styles.button} onPress={handleRegistration}>
        <Text style={styles.buttonText}>Registrieren</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => setActiveScreen('Login')}>
        <Text style={styles.buttonSecondaryText}>Bereits registriert? Einloggen</Text>
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
