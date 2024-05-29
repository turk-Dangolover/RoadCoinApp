import * as Location from 'expo-location';
import polyline from '@mapbox/polyline';
import Constants from 'expo-constants'; // Import the Constants module

const calcRouteUsingCoords = async (originPlaceId, destinationPlaceId) => {
    const apiKey = process.env.GOOGLE_MAPS_KEY;
    const mode = "walking"; 
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${originPlaceId}&destination=place_id:${destinationPlaceId}&mode=${mode}&key=${apiKey}`;

    console.log("originPlaceId: ", originPlaceId);
    console.log("destinationPlaceId: ", destinationPlaceId);
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (!data.routes.length) {
        throw new Error('Keine Route gefunden');
      }
  
      const route = data.routes[0];
      const points = polyline.decode(route.overview_polyline.points);
      const smoothCoordinates = smoothRoute(points);
  
      return { route: smoothCoordinates, distance: data.routes[0].legs[0].distance.value };
    } catch (error) {
      console.error("Fehler bei der Routenberechnung: ", error);
      // Optional: Benachrichtigung der UI über den Fehler
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
            accuracy: Location.Accuracy.Highest,
            timeInterval: 5000,
            distanceInterval: 2,
            mayShowUserSettingsDialog: true,
        });

        const coords = location.coords;
        const placeId = await getPlaceIdFromCoords(coords.latitude, coords.longitude);

        return {
            ...coords,
            placeId,
        };
    } catch (error) {
        console.error('Error fetching location: ', error);
        return null;
    }
};

// Funktion zum Generieren zufälliger Koordinaten innerhalb eines Radius
const generateRandomCoords = (originCoords, radius) => {
  const randomDistance = Math.random() * radius;
  const randomAngle = Math.random() * 2 * Math.PI;
  const deltaLat = randomDistance * Math.cos(randomAngle) / 111.32; // Approx. km per degree latitude
  const deltaLng = randomDistance * Math.sin(randomAngle) / (111.32 * Math.cos(originCoords.latitude * Math.PI / 180)); // Approx. km per degree longitude
  const randomCoords = {
      latitude: originCoords.latitude + deltaLat,
      longitude: originCoords.longitude + deltaLng,
  };
  return randomCoords;
};


// Funktion zum Generieren einer Route mit einer ungefähren Länge
const generateRandomRoute = async (desiredDistance) => {
  const originCoords = await getCurrentLocationWithPlaceId();
  if (!originCoords) return null;

  let attempt = 0;
  while (attempt < 10) {
      const randomCoords = generateRandomCoords(originCoords, 2); // 2km as a rough max distance
      const originPlaceId = originCoords.placeId;
      const randomPlaceId = await getPlaceIdFromCoords(randomCoords.latitude, randomCoords.longitude);

      const { route, distance } = await calcRouteUsingCoords(originPlaceId, randomPlaceId);

      if (distance >= desiredDistance - 1000 && distance <= desiredDistance + 1000) { // Allow some flexibility
          console.log(`Suitable route found after ${attempt + 1} attempts`);
          return { route, distance };
      } else {
          console.log(`Route distance ${distance} meters does not meet the desired range`);
      }
      attempt++;
  }

  console.error('Konnte keine geeignete Route finden');
  return null;
};

export { getCurrentLocationWithPlaceId, calcRouteUsingCoords, generateRandomRoute, getPlaceIdFromCoords};
