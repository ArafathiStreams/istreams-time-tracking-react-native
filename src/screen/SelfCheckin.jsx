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

    useEffect(() => {
        setShowFaceModal(true);

        LocationService(setLocationName, setCoordinates, setAddress);

        const now = new Date();
        setEntryDate(formatDate(now));
        setEntryTime(formatTime(now));
    }, []);

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

    return (
        <View style={[GlobalStyles.pageContainer, { paddingTop: insets.top }]}>
            <Header title="Office Self Check-In" />
            <View style={{ flex: 1 }}>
                <View style={[GlobalStyles.locationContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                    <FontAwesome6Icon name="location-dot" size={20} color="#70706d" />
                    <Text style={[GlobalStyles.subtitle, { marginLeft: 5 }]}>{locationName}</Text>
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