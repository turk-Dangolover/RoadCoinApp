// src/screens/AccountScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const AccountScreen = ({ changeScreen }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => changeScreen('Profile')}>
        <FontAwesome5 name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Account</Text>
      <View style={styles.optionContainer}>
        <TouchableOpacity style={styles.option} onPress={() => changeScreen('ChangePassword')}>
          <FontAwesome5 name="lock" size={24} color="#000" style={styles.optionIcon} />
          <Text style={styles.optionText}>Change Password</Text>
          <FontAwesome5 name="chevron-right" size={24} color="#000" style={styles.chevronIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => changeScreen('ChangeEmail')}>
          <FontAwesome5 name="envelope" size={24} color="#000" style={styles.optionIcon} />
          <Text style={styles.optionText}>Change E-mail</Text>
          <FontAwesome5 name="chevron-right" size={24} color="#000" style={styles.chevronIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => changeScreen('Help')}>
          <FontAwesome5 name="question-circle" size={24} color="#000" style={styles.optionIcon} />
          <Text style={styles.optionText}>Help</Text>
          <FontAwesome5 name="chevron-right" size={24} color="#000" style={styles.chevronIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => changeScreen('PrivacyPolicy')}>
          <FontAwesome5 name="shield-alt" size={24} color="#000" style={styles.optionIcon} />
          <Text style={styles.optionText}>Datenschutzerklärung</Text>
          <FontAwesome5 name="chevron-right" size={24} color="#000" style={styles.chevronIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => changeScreen('SignOut')}>
          <FontAwesome5 name="sign-out-alt" size={24} color="#000" style={styles.optionIcon} />
          <Text style={styles.optionText}>Sign out</Text>
          <FontAwesome5 name="chevron-right" size={24} color="#000" style={styles.chevronIcon} />
        </TouchableOpacity>
      </View>
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
  optionContainer: {
    marginTop: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 1, // Adds a subtle shadow to the options
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    color: '#252826',
  },
  chevronIcon: {
    marginLeft: 'auto',
  },
});

export default AccountScreen;
