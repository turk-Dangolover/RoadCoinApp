// MenuOverlay.js
import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const menuItems = ['Freie Route', 'Manuell Route eingeben', 'Filter Route', 'Schnelle Route'];

const MenuOverlayComponent = ({ isVisible }) => {
  // Verwende `useAnimatedStyle`, um den animierten Stil zu erstellen
  const animatedMenuStyle = useAnimatedStyle(() => {
    return {
      // Definiere die Höhe und Opazität als animierte Werte
      height: withTiming(isVisible.value ? menuItems.length * 40 : 0, {
        duration: 300
      }),
      opacity: withTiming(isVisible.value ? 1 : 0, {
        duration: 300
      })
    };
  });

  return (
      <Animated.View style={[styles.menu, animatedMenuStyle]}>
        {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={() => {}}>
              <Text>{item}</Text>
            </TouchableOpacity>
        ))}
      </Animated.View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    backgroundColor: 'white',
    top: 50, // Stelle dies so ein, dass es sich unterhalb des Buttons befindet
    left: 0,
    right: 0,
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 10, // Stelle sicher, dass das Menü über anderen Elementen gerendert wird
  },
  menuItem: {
    padding: 10,
    // Weitere Styling-Optionen für die Menüpunkte
  },
});

export default MenuOverlayComponent;
