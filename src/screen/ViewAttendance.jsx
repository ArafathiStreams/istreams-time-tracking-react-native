import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalStyles } from '../Styles/styles';
import { LocationService } from '../../iStServices/LocationService';
import { useRoute } from '@react-navigation/native';

const ViewAttendance = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const [currentLocationName, setCurrentLocationName] = useState('');
  const [currentCoordinates, setCurrentCoordinates] = useState('');
  const [loading, setLoading] = useState(false);
  const [canTakeAttendance, setCanTakeAttendance] = useState(false);
  const [distance, setDistance] = useState(null);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [locationChecked, setLocationChecked] = useState(false);
  const [address, setAddress] = useState('');

  const ALLOWED_DISTANCE = 10; // 5 meters
  const officeLocation = route.params?.currentLocation;

  // Function to calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  // Parse coordinates string to get latitude and longitude
  const parseCoordinates = (coordString) => {
    if (!coordString || typeof coordString !== 'string') {
      console.log('Invalid coordinate string:', coordString);
      return { latitude: 0, longitude: 0 };
    }

    const cleanCoordString = coordString.replace(/\s+/g, ' ').trim();
    const coords = cleanCoordString.split(',');

    if (coords.length !== 2) {
      console.log('Coordinate format error:', coordString);
      return { latitude: 0, longitude: 0 };
    }

    const lat = parseFloat(coords[0].trim());
    const lon = parseFloat(coords[1].trim());

    if (isNaN(lat) || isNaN(lon)) {
      return { latitude: 0, longitude: 0 };
    }

    return { latitude: lat, longitude: lon };
  };

  // Get current location and check distance from office
  const getCurrentLocationAndCheckDistance = async () => {
    if (!officeLocation) {
      Alert.alert('Error', 'Office location data not available. Please try again.');
      return;
    }

    setLoading(true);
    setLocationChecked(false);
    try {
      let capturedLocationName = '';
      let capturedCoordinates = '';

      const captureLocationName = (name) => {
        capturedLocationName = name;
      };

      const captureCoordinates = (coords) => {
        capturedCoordinates = coords;
      };

      await LocationService(captureLocationName, captureCoordinates, setAddress);

      setCurrentLocationName(capturedLocationName);
      setCurrentCoordinates(capturedCoordinates);

      if (capturedCoordinates) {
        const currentCoords = parseCoordinates(capturedCoordinates);
        const officeCoords = parseCoordinates(officeLocation.coordinates);

        if (currentCoords.latitude !== 0 && currentCoords.longitude !== 0 &&
          officeCoords.latitude !== 0 && officeCoords.longitude !== 0) {

          const distanceFromOffice = calculateDistance(
            currentCoords.latitude,
            currentCoords.longitude,
            officeCoords.latitude,
            officeCoords.longitude
          );

          const roundedDistance = Math.round(distanceFromOffice);
          setDistance(roundedDistance);
          setCanTakeAttendance(distanceFromOffice <= ALLOWED_DISTANCE);
          setLocationChecked(true);
        } else {
          Alert.alert('Error', 'Invalid coordinates detected. Please try again.');
        }
      } else {
        Alert.alert('Error', 'Unable to get location coordinates.');
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Unable to get your current location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle attendance marking
  const handleTakeAttendance = () => {
    if (canTakeAttendance) {
      setAttendanceMarked(true);
      Alert.alert('Success',
        `Attendance marked successfully!\nLocation: ${currentLocationName}\nTime: ${new Date().toLocaleString()}`
      );
    } else {
      Alert.alert(
        'Location Error',
        `You are ${distance}m away from office. You must be within ${ALLOWED_DISTANCE}m to mark attendance.`
      );
    }
  };

  // Auto-check location when component mounts
  useEffect(() => {
    getCurrentLocationAndCheckDistance();
  }, []);

  return (
    <View style={[GlobalStyles.pageContainer, { paddingTop: insets.top }]}>
      <Header title="View Attendance" />

      <View style={styles.container}>
        <Text style={styles.title}>Location-Based Attendance</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Getting your current location...</Text>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {locationChecked && currentCoordinates && (
              <View style={styles.locationInfo}>
                <Text style={styles.sectionTitle}>Current Location:</Text>
                <Text style={styles.addressText}>{currentLocationName}</Text>
                <Text style={styles.coordText}>Coordinates: {currentCoordinates}</Text>

                <Text style={[
                  styles.statusText,
                  { color: canTakeAttendance ? '#4CAF50' : '#F44336' }
                ]}>
                  {canTakeAttendance ? `Within office range ✓ (${distance}m away)` : `Outside office range (${distance}m away) ✗`}
                </Text>
              </View>
            )}

            {attendanceMarked && (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>✓ Attendance Marked Successfully!</Text>
                <Text style={styles.successSubText}>Time: {new Date().toLocaleString()}</Text>
              </View>
            )}

            {locationChecked && (
              <TouchableOpacity
                style={[
                  styles.attendanceButton,
                  {
                    backgroundColor: attendanceMarked
                      ? '#9E9E9E'
                      : canTakeAttendance
                        ? '#4CAF50'
                        : '#F44336'
                  }
                ]}
                onPress={handleTakeAttendance}
                disabled={attendanceMarked}
              >
                <Text style={styles.buttonText}>
                  {attendanceMarked
                    ? 'Attendance Already Marked'
                    : canTakeAttendance
                      ? 'Mark Attendance'
                      : 'Cannot Mark Attendance'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={getCurrentLocationAndCheckDistance}
              disabled={loading}
            >
              <Text style={styles.refreshButtonText}>
                {locationChecked ? 'Refresh Location' : 'Check Current Location'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  locationInfo: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  addressText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  coordText: {
    fontSize: 14,
    marginBottom: 15,
    color: '#666',
    fontFamily: 'monospace',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  successContainer: {
    backgroundColor: '#E8F5E8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  successText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successSubText: {
    color: '#4CAF50',
    fontSize: 14,
    marginTop: 5,
  },
  attendanceButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
};

export default ViewAttendance;