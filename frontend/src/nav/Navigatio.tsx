// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import MapScreen from '../screens/MapScreen';
// import ShopScreen from '../screens/ShopScreen';
// import AvatarScreen from '../screens/AvatarScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import HubScreen from '../screens/HubScreen';
// import { MaterialCommunityIcons } from '@expo/vector-icons';

// export default function App() {
//   const [activeScreen, setActiveScreen] = useState('Map');

//   const changeScreen = (screen) => {
//     setActiveScreen(screen);
//   };

//   const renderActiveScreen = () => {
//     switch (activeScreen) {
//       case 'Hub':
//         return <HubScreen />;
//       case 'Shop':
//         return <ShopScreen />;
//       case 'Avatar':
//         return <AvatarScreen />;
//       case 'Profile':
//         return <ProfileScreen />;
//       default:
//         return <MapScreen />;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.content}>
//         {renderActiveScreen()}
//       </View>

//       <View style={styles.navBar}>
//         <TouchableOpacity onPress={() => changeScreen('Hub')} style={styles.navItem}>
//           <MaterialCommunityIcons name="home" size={24} color={activeScreen === 'Hub' ? '#3998E8' : 'gray'} />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => changeScreen('Shop')} style={styles.navItem}>
//           <MaterialCommunityIcons name="store" size={24} color={activeScreen === 'Shop' ? '#3998E8' : 'gray'} />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => changeScreen('Map')} style={styles.navItem}>
//           <MaterialCommunityIcons name="map" size={24} color={activeScreen === 'Map' ? '#3998E8' : 'gray'} />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => changeScreen('Avatar')} style={styles.navItem}>
//           <MaterialCommunityIcons name="account" size={24} color={activeScreen === 'Avatar' ? '#3998E8' : 'gray'} />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => changeScreen('Profile')} style={styles.navItem}>
//           <MaterialCommunityIcons name="account-circle" size={24} color={activeScreen === 'Profile' ? '#3998E8' : 'gray'} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#EBF2F6',
//   },
//   content: {
//     flex: 1,
//   },
//   navBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     height: 65,
//     paddingVertical: 15,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     elevation: 10,
//   },
//   navItem: {
//     paddingHorizontal: 20,
//     borderRadius: 20,
//   },
// });
