import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import GooglePlacesInputComponent from "../manuelle route/GooglePlacesInputComponent";
import SearchBarDestinationComponent from "../manuelle route/SearchBarDestinationComponent";
import InfoBoxRouteComponent from "../manuelle route/InfoBoxRouteComponent";
import BackButtonComponent from "../BackButtonComponent";

const FreieRouteComponent = ({
  hideFreieRoute,
  onStartPress,
  distance,
  coins,
  isNavigating,
}) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <BackButtonComponent onPress={hideFreieRoute} />
        </View>
        <View>
          <InfoBoxRouteComponent distance={distance} coins={coins} />
        </View>
      </View>
      {!isNavigating && (
        <View style={styles.buttonContainer}>
          <Button
            title="Start"
            onPress={onStartPress}
            buttonStyle={styles.startButton}
            containerStyle={styles.fullWidthButtonContainer}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    width: "100%",
    zIndex: 2,
    top: "5%",
    alignItems: "center",
  },
  backButtonContainer: {
    position: "absolute",
    left: 10,
    top: "-15%",
    zIndex: 2,
  },
  inputContainer: {
    width: "90%",
    marginBottom: "15%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  fullWidthButtonContainer: {
    width: "90%",
  },
  startButton: {
    backgroundColor: "blue",
    borderRadius: 5,
    width: "100%",
  },
});

export default FreieRouteComponent;
