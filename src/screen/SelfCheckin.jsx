import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Alert, ActivityIndicator } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Header from '../components/Header';
import { GlobalStyles } from '../Styles/styles';
import GlobalVariables from "../../iStServices/GlobalVariables";
import * as FileSystem from 'expo-file-system';
import { SaveAttendance } from '../../iStClasses/SaveAttendance';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import ProjectListPopup from '../../Popup/ProjectListPopUp';
import { LocationService } from '../../iStServices/LocationService';
import { formatDate, formatTime } from '../Utils/dataTimeUtils';
import FaceDetectionModal from './FaceDetectionModal';
import { ImageRecognition } from '../Utils/ImageRecognition';
import ImageRecognitionResult from '../components/ImageRecognitionResult';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SelfCheckin = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    // Location checking states
    const [locationLoading, setLocationLoading] = useState(true);
    const [pageAccessible, setPageAccessible] = useState(false);
    const [distance, setDistance] = useState(null);
    const [canAccess, setCanAccess] = useState(false);
    const [officeLocation, setOfficeLocation] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Existing states
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [btnloading, setbtnLoading] = useState(false);
    const [entryDate, setEntryDate] = useState('');
    const [entryTime, setEntryTime] = useState('');
    const [projectNo, setProjectNo] = useState('');
    const [projectName, setProjectName] = useState('');
    const [empTeamImage, setEmpTeamImage] = useState(null);
    const [coordinates, setCoordinates] = useState('');
    const [locationName, setLocationName] = useState('Fetching location...');
    const [recogloading, setRecogLoading] = useState(false);
    const [matchingFaceNames, setMatchingFaceNames] = useState([]);
    const [cleanedMatchNames, setCleanedMatchNames] = useState([]);
    const [groupedData, setgroupedData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const TrackingStatus = 'checkin';
    const [base64Img, setBase64Img] = useState(null);
    const [selectedEmp, setSelectedEmp] = useState('');
    const [empNo, setEmpNo] = useState([]);
    const [autosaveTriggered, setAutosaveTriggered] = useState(false);
    const [showFaceModal, setShowFaceModal] = useState(false);
    const [address, setAddress] = useState('');

    // Location checking configuration
    const ALLOWED_DISTANCE = 10; // 5 meters
    const fetchOfficeLocation = useCallback(async () => {
        setLocationLoading(true);
        setPageAccessible(false);
        setCanAccess(false);

        try {
            const locationJson = await AsyncStorage.getItem('CURRENT_OFC_LOCATION');
            const officeLoc = locationJson ? JSON.parse(locationJson) : null;
            setOfficeLocation(officeLoc);

            if (!officeLoc) {
                if (!isInitialLoad) {
                    Alert.alert('Error', 'Office location data not available.');
                }
                return null;
            }
            return officeLoc;
        } catch (error) {
            console.error('Error fetching office location:', error);
            if (!isInitialLoad) {
                Alert.alert('Error', 'Unable to fetch office location.');
            }
            return null;
        } finally {
            setLocationLoading(false);
            setIsInitialLoad(false);
        }
    }, [isInitialLoad]);

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

    // Modified checkLocationDistance to accept officeLoc as parameter
    const checkLocationDistance = useCallback(async (officeLoc) => {
        if (!officeLoc) {
            return false;
        }

        try {
            let capturedLocationName = '';
            let capturedCoordinates = '';

            const captureLocationName = (name) => {
                capturedLocationName = name;
                setLocationName(name);
            };

            const captureCoordinates = (coords) => {
                capturedCoordinates = coords;
                setCoordinates(coords);
            };

            await LocationService(captureLocationName, captureCoordinates, setAddress);

            if (capturedCoordinates) {
                const currentCoords = parseCoordinates(capturedCoordinates);
                const officeCoords = parseCoordinates(officeLoc.coordinates);

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
                    const isWithinRange = distanceFromOffice <= ALLOWED_DISTANCE;
                    setCanAccess(isWithinRange);

                    if (isWithinRange) {
                        setPageAccessible(true);
                        return true;
                    } else {
                        Alert.alert(
                            'Access Denied',
                            `You are ${roundedDistance}m away from office. You must be within ${ALLOWED_DISTANCE}m to access this page.`,
                            [
                                {
                                    text: 'Try Again',
                                    onPress: async () => {
                                        setLocationLoading(true);
                                        const newOfficeLoc = await fetchOfficeLocation();
                                        if (newOfficeLoc) {
                                            await checkLocationDistance(newOfficeLoc);
                                        }
                                    }
                                },
                                {
                                    text: 'Cancel',
                                    onPress: () => navigation.goBack()
                                }
                            ]
                        );
                        return false;
                    }
                } else {
                    Alert.alert('Error', 'Invalid coordinates detected. Please try again.');
                    return false;
                }
            } else {
                Alert.alert('Error', 'Unable to get location coordinates.');
                return false;
            }
        } catch (error) {
            console.error('Error checking location:', error);
            Alert.alert('Error', 'Unable to get your current location. Please try again.');
            return false;
        } finally {
            setLocationLoading(false);
        }
    }, [fetchOfficeLocation, navigation]);

    const handleProjectSelect = (project) => {
        setProjectNo(project.PROJECT_NO);
        setProjectName(project.PROJECT_NAME);
    };

    const handleImageRecognition = async () => {
        await ImageRecognition(empTeamImage,
            setRecogLoading,
            setBase64Img,
            setMatchingFaceNames,
            setCleanedMatchNames,
            setgroupedData,
            setErrorMessage);
    };

    const convertUriToBase64 = async (uri) => {
        return await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
    };

    // Initial setup - check location first
    useEffect(() => {
        checkLocationDistance();
    }, []);

    // Main initialization effect
    useFocusEffect(
        useCallback(() => {
            const initialize = async () => {
                const officeLoc = await fetchOfficeLocation();
                if (officeLoc) {
                    const isWithinRange = await checkLocationDistance(officeLoc);
                    if (isWithinRange) {
                        setShowFaceModal(true);
                        const now = new Date();
                        setEntryDate(formatDate(now));
                        setEntryTime(formatTime(now));
                    }
                }
            };

            initialize();

            return () => {
                // Cleanup if needed
            };
        }, [fetchOfficeLocation, checkLocationDistance])
    );

    const handleFaceCaptureComplete = (data) => {
        if (data?.capturedImage) {
            setEmpTeamImage(data.capturedImage);
        } else {
            console.warn("No capturedImage found in data");
        }
    };

    useEffect(() => {
        if (empTeamImage) {
            handleImageRecognition();
        }
    }, [empTeamImage]);

    useEffect(() => {
        if (errorMessage) {
            Alert.alert('Error', errorMessage);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (groupedData && groupedData.length > 0) {
            const hasNonMatchedFaces = groupedData.some(item => item.title === "Non-Matched Faces");

            if (hasNonMatchedFaces) {
                setEmpNo([]);
                setSelectedEmp(null);
                navigation.navigate('FailureAnimationScreen', {
                    message: 'No Employee Image Matched',
                    details: 'Next employee please',
                    returnTo: 'SelfCheckin'
                });
            } else {
                const extractedEmpNos = groupedData.flatMap(item => item.data.map(i => i.EMP_NO));
                console.log("Extracted Employee Numbers:", extractedEmpNos);
                setEmpNo(extractedEmpNos);
                setSelectedEmp(extractedEmpNos[0]);
            }
        }
    }, [groupedData]);

    useEffect(() => {
        if (
            !autosaveTriggered &&
            empTeamImage &&
            groupedData.length > 0 &&
            locationName &&
            selectedEmp?.length > 0
        ) {
            SaveSelfCheckin();
            setAutosaveTriggered(true);
        }
    }, [empTeamImage, groupedData, locationName, selectedEmp]);

    const SaveSelfCheckin = async () => {
        if (!empTeamImage) {
            alert('Missing required data. Please ensure photo is captured.');
            return;
        }
        if (!selectedEmp || selectedEmp === null || selectedEmp === '') {
            alert('UnMatched Employee Found. Add Employee and try again.');
            return;
        }

        setbtnLoading(true);

        try {
            const base64 = await convertUriToBase64(empTeamImage);
            setBase64Img(base64);

            const empData = `<string>${selectedEmp}</string>`;

            await SaveAttendance({
                projectNo,
                locationName,
                entryDate,
                entryTime,
                coordinates,
                TrackingStatus,
                selectedEmp: empData,
                base64Img: base64Img,
                navigation,
                returnTo: 'SelfCheckin',
            });
        } catch (error) {
            setbtnLoading(false);
            console.error('Error saving Checkin data:', error);
        }
        finally {
            setbtnLoading(false);
        }
    };

    const reload = () => {
        handleImageRecognition();
    };

    // Show loading screen during location check
    if (locationLoading) {
        return (
            <View style={[GlobalStyles.pageContainer, { paddingTop: insets.top }]}>
                <Header title="Office Self Check-In" />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={{ marginTop: 10, fontSize: 16, color: '#666' }}>
                        Checking your location...
                    </Text>
                </View>
            </View>
        );
    }

    // Show access denied if not within range
    if (!pageAccessible) {
        return (
            <View style={[GlobalStyles.pageContainer, { paddingTop: insets.top }]}>
                <Header title="Office Self Check-In" />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#F44336', marginBottom: 15, textAlign: 'center' }}>
                        Access Restricted
                    </Text>
                    <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 10 }}>
                        You must be within {ALLOWED_DISTANCE}m of the office to access this page.
                    </Text>
                    {distance && (
                        <Text style={{ fontSize: 16, color: '#F44336', fontWeight: '500', marginBottom: 20 }}>
                            Current distance: {distance}m from office
                        </Text>
                    )}
                    <Button
                        mode="contained"
                        onPress={() => {
                            setLocationLoading(true);
                            checkLocationDistance();
                        }}
                    >
                        Try Again
                    </Button>
                </View>
            </View>
        );
    }

    // Show main content only if location is verified and within range
    return (
        <View style={[GlobalStyles.pageContainer, { paddingTop: insets.top }]}>
            <Header title="Office Self Check-In" />
            <View style={{ flex: 1 }}>
                <View style={[GlobalStyles.locationContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                    <FontAwesome6Icon name="location-dot" size={20} color="#70706d" />
                    <Text style={[GlobalStyles.subtitle, { marginLeft: 5 }]}>{locationName}</Text>
                    {distance && (
                        <Text style={{ marginLeft: 10, fontSize: 12, color: '#4CAF50' }}>
                            ✓ Within range ({distance}m)
                        </Text>
                    )}
                </View>

                <View style={[GlobalStyles.twoInputContainer, { marginTop: 10 }]}>
                    <View style={GlobalStyles.container1}>
                        <TextInput
                            mode="outlined"
                            label="Entry Date"
                            value={entryDate}
                            editable={false}
                            onPressIn={() => setShowDatePicker(true)}
                        />
                    </View>

                    <View style={GlobalStyles.container2}>
                        <TextInput
                            mode="outlined"
                            label="Entry Time"
                            value={entryTime}
                            editable={false}
                            onPressIn={() => setShowTimePicker(true)}
                        />
                    </View>
                </View>

                <Text style={[GlobalStyles.subtitle_1, { marginTop: 10 }]}>Project Details</Text>
                <View>
                    <TextInput
                        mode="outlined"
                        label="Project No"
                        onPressIn={() => setPopupVisible(true)}
                        value={projectNo}
                        style={{ width: '70%', marginTop: 5 }}
                        placeholder="Enter Project No"
                        showSoftInputOnFocus={false} />
                    <ProjectListPopup
                        visible={isPopupVisible}
                        onClose={() => setPopupVisible(false)}
                        onSelect={(project) => {
                            handleProjectSelect(project);
                            setPopupVisible(false);
                        }}
                    />
                    <TextInput
                        mode="outlined"
                        label="Project Name"
                        value={projectName}
                        showSoftInputOnFocus={false}
                        placeholder="Enter Project Name" />
                </View>

                <View style={[GlobalStyles.camButtonContainer, { marginBottom: 10 }]} >
                    <Button icon={"reload"} mode="contained" title="Reload Page" onPress={reload} >Retry</Button>
                </View>

                {showFaceModal && (
                    <FaceDetectionModal
                        onClose={() => setShowFaceModal(false)}
                        onCaptureComplete={handleFaceCaptureComplete}
                    />
                )}

                <ImageRecognitionResult
                    recogloading={recogloading}
                    groupedData={groupedData}
                />
            </View>

            <View style={GlobalStyles.bottomButtonContainer}>
                <Button mode="contained"
                    onPress={SaveSelfCheckin}
                    disabled={btnloading}
                    loading={btnloading}>
                    Save
                </Button>
            </View>
        </View>
    );
};

export default SelfCheckin;