import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import MenuListButtonComponent from './MenuListButtonComponent';

const RouteConfigButtonComponent = ({ routeConfig, toggleVisibility }) => {
  const height = useSharedValue(80);  
  const open = useSharedValue(false);  

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      paddingTop: open.value ? 30 : 7,  
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: open.value ? 1 : 0,
      display: open.value ? 'flex' : 'none',
      transform: [{ scale: open.value ? 1 : 0.5 }], 
    };
  });


  const handlePress = () => {
    height.value = withSpring(!open.value ? 220 : 80, {
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
    paddingTop: 20,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    //padding von oben
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
    width: '100%',
    height: '100%',
    padding: 0, 
    borderRadius: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});

export default RouteConfigButtonComponent;
