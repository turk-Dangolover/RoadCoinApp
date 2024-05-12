import * as Location from 'expo-location';

const calcRouteUsingCoords = async (originPlaceId, destinationPlaceId) => {
    const apiKey = process.env.GOOGLE_MAPS_KEY;
    const mode = "walking"; // "driving", "walking", "bicycling"
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${originPlaceId}&destination=place_id:${destinationPlaceId}&mode=${mode}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.routes.length) {
            throw new Error('Keine Route gefunden');
        }

        const route = data.routes[0];
        const coordinates = [];
        route.legs.forEach(leg => {
            leg.steps.forEach(step => {
                coordinates.push({ latitude: step.start_location.lat, longitude: step.start_location.lng });
                coordinates.push({ latitude: step.end_location.lat, longitude: step.end_location.lng });
            });
        });

        return coordinates;
    } catch (error) {
        console.error("Fehler bei der Routenberechnung: ", error);
        return [];
    }
};


const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.error('Permission to access location was denied');
        console.log('#####Permission to access location was denied');
        return;
    }
    console.log('#####Fetching location...');
    try {
        let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 50,
            mayShowUserSettingsDialog: true,
        });
        console.log('#####Location: ', location);
        return location;
    } catch (error) {
        console.error('Error fetching location: ', error);
        console.log('#####Error fetching location: ', error);
        return null;
    }
}

export { getCurrentLocation };
export { calcRouteUsingCoords };