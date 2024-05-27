import * as Location from 'expo-location';
import polyline from '@mapbox/polyline';
import Constants from 'expo-constants'; // Import the Constants module

const calcRouteUsingCoords = async (originPlaceId, destinationPlaceId) => {
    const apiKey = process.env.GOOGLE_MAPS_KEY;
    const mode = "walking"; // "driving", "walking", "bicycling"
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${originPlaceId}&destination=place_id:${destinationPlaceId}&mode=${mode}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        // in meter
        const totalDistance = data.routes[0].legs[0].distance.value;
        console.log("Data: " + JSON.stringify(data));

        if (!data.routes.length) {
            throw new Error('Keine Route gefunden');
        }

        const route = data.routes[0];
        const points = polyline.decode(route.overview_polyline.points); // Polyline für die gesamte Route
        const smoothCoordinates = smoothRoute(points);
        
        return { route: smoothCoordinates, distance: totalDistance };
    } catch (error) {
        console.log("Place ID: ", originPlaceId, destinationPlaceId);
        console.error("Fehler bei der Routenberechnung: ", error);
        return { route: [], distance: 0 };
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

// Funktion zum Abrufen der Place ID von Google Maps API basierend auf Koordinaten
const getPlaceIdFromCoords = async (latitude, longitude) => {
    const apiKey = process.env.GOOGLE_MAPS_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.results.length) {
            throw new Error('Keine Place ID gefunden');
        }

        console.log("Place IDsss: ", data.results[0].place_id);

        return data.results[0].place_id;
    } catch (error) {
        console.error("Fehler bei der Place ID Abrufung: ", error);
        return null;
    }
};

// Funktion zum Abrufen des aktuellen Standorts und der zugehörigen Place ID
const getCurrentLocationWithPlaceId = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return null;
    }
    try {
        let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 50,
            mayShowUserSettingsDialog: true,
        });

        const coords = location.coords;
        const placeId = await getPlaceIdFromCoords(coords.latitude, coords.longitude);
        console.log("Place ID5: ", placeId);

        return {
            ...coords,
            placeId,
        };
    } catch (error) {
        console.error('Error fetching location: ', error);
        return null;
    }
};

// Funktion zum Berechnen der zurückgelegten Distanz
const calculateDistance = (currentLocation, route) => {
    let traveledDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
        const segmentStart = route[i];
        const segmentEnd = route[i + 1];
        const segmentDistance = haversineDistance(segmentStart, segmentEnd);
        const currentToEnd = haversineDistance(currentLocation, segmentEnd);
        const currentToStart = haversineDistance(currentLocation, segmentStart);

        if (currentToEnd < segmentDistance && currentToStart < segmentDistance) {
            traveledDistance += haversineDistance(segmentStart, currentLocation);
            break;
        } else {
            traveledDistance += segmentDistance;
        }
    }
    return traveledDistance;
};

// Haversine Distanzberechnung
const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // Erdradius in km
    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c * 1000; // Distanz in Metern
    return d;
};

export { getCurrentLocationWithPlaceId, calcRouteUsingCoords };
