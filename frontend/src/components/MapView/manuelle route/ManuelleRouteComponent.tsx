import React from "react";
import { View, StyleSheet } from "react-native";
import GooglePlacesInputComponent from "./GooglePlacesInputComponent";
import SearchBarDestinationComponent from "./SearchBarDestinationComponent";
import SharedRouteComponent from "../SharedRouteComponent";

const ManuelleRouteComponent = ({
  hideManuelleRoute,
  handleLocationSelect,
  handleLocationSelect2,
  startLocation,
  destinationLocation,
  onStartPress,
  distance,
  coins,
  isNavigating,
}) => {
  return (
    <SharedRouteComponent
      hideRoute={hideManuelleRoute}
      onStartPress={onStartPress}
      distance={distance}
      coins={coins}
      isNavigating={isNavigating}
    >
      {!isNavigating && (
        <>
          <View style={[styles.inputContainer, { zIndex: 3 }]}>
            <GooglePlacesInputComponent
              onLocationSelect={handleLocationSelect}
            />
          </View>
          <View style={[styles.inputContainer, { zIndex: 2 }]}>
            <SearchBarDestinationComponent
              onLocationSelect={handleLocationSelect2}
            />
          </View>
        </>
      )}
    </SharedRouteComponent>
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
  disabledButton: {
    backgroundColor: "grey",
    width: "100%",
  },
});

export default ManuelleRouteComponent;
