import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LoginScreen from "./LoginScreen";

const MessageScreen = () => {
  const [activeScreen, setActiveScreen] = useState('MessageScreen');

  const changeScreen = (screen) => {
    setActiveScreen(screen);
  };

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'Hub':
        return <LoginScreen />;
      default:
        return (
          <View style={styles.container}>
            <Text style={styles.text}>Bitte überprüfen Sie nun Ihr E-Mail Postfach um Ihren Account zu verifizieren!</Text>
            <TouchableOpacity style={styles.button} onPress={() => changeScreen('Hub')}>
              <Text style={styles.buttonText}>Zum Login</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return renderActiveScreen();
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
    textAlign: 'center',
    margin: 20,
  },
  button: {
    backgroundColor: '#3998E8',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MessageScreen;
