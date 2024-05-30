import React from "react";
import { StyleSheet } from "react-native";
import SharedRouteComponent from "../SharedRouteComponent";

const SchnelleRouteComponent = ({
  hideSchnelleRoute,
  onStartPress,
  distance,
  coins,
  isNavigating,
}) => {
  return (
    <SharedRouteComponent
      hideRoute={hideSchnelleRoute}
      onStartPress={onStartPress}
      distance={distance}
      coins={coins}
      isNavigating={isNavigating}
      children={undefined}
    />
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

export default SchnelleRouteComponent;
