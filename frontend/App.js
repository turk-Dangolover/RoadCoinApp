import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MapScreen from './src/screens/MapScreen';
import ShopScreen from './src/screens/ShopScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HubScreen from './src/screens/HubScreen';
import RegistrationScreen from './src/screens/Registration';
import LoginScreen from './src/screens/LoginScreen';
import AccountScreen from './src/screens/AccountScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import ChangeEmailScreen from './src/screens/ChangeEmailScreen';
import HelpScreen from './src/screens/HelpScreen';
import DelScreen from './src/screens/DelScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('Registration');
  const [verification_id, setVerificationId] = useState(null);

  const changeScreen = (screen) => {
    setActiveScreen(screen);
  };

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'Hub':
        return <HubScreen verification_id={verification_id} />;
      case 'Shop':
        return <ShopScreen verification_id={verification_id} />;
      case 'Profile':
        return <ProfileScreen verification_id={verification_id} changeScreen={changeScreen} />;
      case 'Registration':
        return <RegistrationScreen setActiveScreen={setActiveScreen} setVerificationId={setVerificationId} />;
      case 'Login':
        return <LoginScreen setVerificationId={setVerificationId} setActiveScreen={setActiveScreen} />;
      case 'Account':
        return <AccountScreen changeScreen={changeScreen} />;
      case 'DelScreen':
        return <DelScreen changeScreen={changeScreen} verification_id={verification_id} />;
      case 'ChangePassword':
        return <ChangePasswordScreen verification_id={verification_id} changeScreen={changeScreen} />;
      case 'ChangeEmail':
        return <ChangeEmailScreen verification_id={verification_id} changeScreen={changeScreen} />;
      case 'Help':
        return <HelpScreen changeScreen={changeScreen} />;
      case 'PrivacyPolicy':
        return <PrivacyPolicyScreen changeScreen={changeScreen} />;
      case 'SignOut':
        return <LoginScreen setVerificationId={setVerificationId} setActiveScreen={setActiveScreen} />;
      default:
        return <MapScreen verification_id={verification_id} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderActiveScreen()}
      </View>
      {activeScreen !== 'Login' && activeScreen !== 'Registration' && (
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => changeScreen('Hub')} style={styles.navItem}>
            <MaterialCommunityIcons name="home" size={24} color={activeScreen === 'Hub' ? '#3998E8' : 'gray'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeScreen('Shop')} style={styles.navItem}>
            <MaterialCommunityIcons name="store" size={24} color={activeScreen === 'Shop' ? '#3998E8' : 'gray'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeScreen('Map')} style={styles.navItem}>
            <MaterialCommunityIcons name="map" size={24} color={activeScreen === 'Map' ? '#3998E8' : 'gray'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeScreen('Profile')} style={styles.navItem}>
            <MaterialCommunityIcons name="account-circle" size={24} color={activeScreen === 'Profile' ? '#3998E8' : 'gray'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeScreen('Login')} style={styles.navItem}>
            <MaterialCommunityIcons name="login" size={24} color={activeScreen === 'Login' ? '#3998E8' : 'gray'} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF2F6',
  },
  content: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 65,
    paddingVertical: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10,
  },
  navItem: {
    paddingHorizontal: 20,
    borderRadius: 20,
  },
});
