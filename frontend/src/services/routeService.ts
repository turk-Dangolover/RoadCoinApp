import * as Location from 'expo-location';

const fetchRandomRoute = async () => {
    const apiKey = process.env.GOOGLE_MAPS_KEY;
    const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=Chicago,IL&destination=Los+Angeles,CA&key=${apiKey}`);
    const data = await response.json();
    const route = data.routes[0];
    const coordinates = route.legs[0].steps.map((step) => ({
        latitude: step.start_location.lat,
        longitude: step.start_location.lng
    }));

    return coordinates;
};

const fetchRandomRoute2 = async () => {
    const apiKey = process.env.GOOGLE_MAPS_KEY;
    const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=San+Francisco,CA&destination=Los+Angeles,CA&key=${apiKey}`);
    const data = await response.json();
    const route = data.routes[0];
    const coordinates = route.legs[0].steps.map((step) => ({
        latitude: step.start_location.lat,
        longitude: step.start_location.lng
    }));

    return coordinates;
};

const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
    }

    console.log('Fetching location...');
    let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 50,
        mayShowUserSettingsDialog: true,
    });
    console.log('Location: ', location);


    return location;
}

export { fetchRandomRoute };
export { getCurrentLocation };
export { fetchRandomRoute2 };
