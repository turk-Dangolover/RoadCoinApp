import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapScreen from './src/screens/MapScreen';
import ShopScreen from './src/screens/ShopScreen';
import AvatarScreen from './src/screens/AvatarScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HubScreen from './src/screens/HubScreen';
import RegistrationScreen from './src/screens/Registration';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('Registration');
  console.log("Active Screen:", activeScreen);


  // useEffect(() => {
  //   // Füge hier die Logik hinzu, um zu überprüfen, ob der Benutzer eingeloggt ist
  //   // Wenn der Benutzer eingeloggt ist, setze den aktiven Bildschirm auf 'Map' oder eine andere Standardseite
  //   // Ansonsten lass den aktiven Bildschirm auf 'Login'
  // }, []);

  const changeScreen = (screen) => {
    setActiveScreen(screen);
  };

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'Hub':
        return <HubScreen />;
      case 'Shop':
        return <ShopScreen />;
      case 'Avatar':
        return <AvatarScreen />;
      case 'Profile':
        return <ProfileScreen />;
      case 'Registration':
        return <RegistrationScreen />;
      default:
        return <MapScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderActiveScreen()}
      </View>

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
        <TouchableOpacity onPress={() => changeScreen('Avatar')} style={styles.navItem}>
          <MaterialCommunityIcons name="account" size={24} color={activeScreen === 'Avatar' ? '#3998E8' : 'gray'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeScreen('Profile')} style={styles.navItem}>
          <MaterialCommunityIcons name="account-circle" size={24} color={activeScreen === 'Profile' ? '#3998E8' : 'gray'} />
        </TouchableOpacity>
      </View>
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
