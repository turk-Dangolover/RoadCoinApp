import * as Location from 'expo-location';
import polyline from '@mapbox/polyline';


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
        const points = polyline.decode(route.overview_polyline.points); // Polyline für die gesamte Route
        const smoothCoordinates = smoothRoute(points);

        return smoothCoordinates;
    } catch (error) {
        console.error("Fehler bei der Routenberechnung: ", error);
        return [];
    }
};

const smoothRoute = (points) => {
    const smoothed = [];
    for (let i = 0; i < points.length - 1; i++) {
      const current = { latitude: points[i][0], longitude: points[i][1] };
      const next = { latitude: points[i + 1][0], longitude: points[i + 1][1] };
      smoothed.push(current);
      // Erstellen Sie Zwischenpunkte
      for (let j = 1; j <= 10; j++) {
        const interpolated = {
          latitude: current.latitude + (next.latitude - current.latitude) * j / 10,
          longitude: current.longitude + (next.longitude - current.longitude) * j / 10,
        };
        smoothed.push(interpolated);
      }
    }
    smoothed.push({ latitude: points[points.length - 1][0], longitude: points[points.length - 1][1] });
    return smoothed;
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