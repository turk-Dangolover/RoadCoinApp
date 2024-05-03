import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';


const RouteConfigButtonComponent = () => {

  const height = useSharedValue<number>(100);

  const handlePress = () => {
   height.value = withSpring(450);
  };


  const styles = StyleSheet.create({
    button: {
      height: height.value,
      width: 600,
      position: 'absolute',
      bottom: 30,
      alignSelf: 'center',
      backgroundColor: '#3998E8',
      borderRadius: 30,
      padding: 10,
      elevation: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: 'white',
      paddingLeft: 10,
    },
  });

  return (
    <Animated.View style={{ ...styles.button, height }}>
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.buttonText}>Route einstellen</Text>
    </TouchableOpacity>
    </Animated.View>
  );

  
};

export default RouteConfigButtonComponent;