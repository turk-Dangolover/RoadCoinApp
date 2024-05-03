import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const RouteConfigButtonComponent = () => {
  const height = useSharedValue(100);  // Default height
  const open = useSharedValue(false);  // Default state

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: open.value ? 1 : 0,  // Steuern der Opazität basierend auf der Höhe
    };
  });

  const handlePress = () => {
    height.value = withSpring(!open.value ? 450 : 100);  // Toggle between two heights
    open.value = !open.value;  // Toggle between open and closed state
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity onPress={handlePress} style={styles.button}>
        <Text style={styles.buttonText}>Route einstellen</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.content, contentStyle]}>
        {/* Additional content that becomes visible as the panel expands */}
        <Text style={styles.moreText}>Option 1</Text>
        <Text style={styles.moreText}>Option 2</Text>
        <Text style={styles.moreText}>Option 3</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 600,
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#3998E8',
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
    color: 'white',
    paddingLeft: 10,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    color: 'white',
  },
});

export default RouteConfigButtonComponent;
