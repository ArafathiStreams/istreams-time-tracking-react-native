import * as Location from 'expo-location';

export async function LocationService(setLocationName, setCoordinates, setAddress) {
    try {
        // Ask for location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLocationName('Permission to access location was denied');
            return;
        }

        // Get current GPS coordinates
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
        });
        const { latitude, longitude } = location.coords;

        // Reverse geocode: GPS -> Human-readable address
        const addressArray = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (addressArray.length > 0) {
            const place = addressArray[0];
            const formattedAddress = `${place.street || ''}, ${place.city || ''}, ${place.country || ''}`.trim();
            const fullAddress = [
                place.name,
                place.street,
                place.city,
                place.state,
                place.zip,
                place.country
            ].filter(Boolean).join(', ');
            const coordinates = `${latitude}, ${longitude}`;

            setCoordinates(coordinates);
            setLocationName(formattedAddress);
            setAddress(fullAddress);
        } else {
            setCoordinates('');
            setLocationName('Unable to determine address');
        }
    } catch (error) {
        console.error('LocationService Error:', error);
        setCoordinates('');
        setLocationName('Error fetching location');
    }
}
