import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import MenuListButtonComponent from './MenuListButtonComponent';

const RouteConfigButtonComponent = ({ routeConfig, toggleVisibility }) => {
  const height = useSharedValue(80);  // Default height
  const open = useSharedValue(false);  // Default state

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: open.value ? 1 : 0,
      display: open.value ? 'flex' : 'none',
      transform: [{ scale: open.value ? 1 : 0.5 }], // Skaliert das Element von 0.5 bis 1
    };
  });


  const handlePress = () => {
    height.value = withSpring(!open.value ? 450 : 80, {
      damping: 15,
      stiffness: 150
    });

    open.value = !open.value;
  };


  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity onPress={handlePress} style={styles.button}>
        <Text style={styles.buttonText}>Route einstellen</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.content, contentStyle]}>
        {Object.keys(routeConfig).map(key => (
          <MenuListButtonComponent key={key} onPress={() => toggleVisibility(key)} name={`${key.replace('Route', '')} Route`} />
        ))}
      </Animated.View>

    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "85%",
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#FAF9F6',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 32,
    paddingLeft: 10,
  },
  content: {
    width: '103%',
    height: '97%',
    padding: 5,
    borderRadius: 30,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RouteConfigButtonComponent;
