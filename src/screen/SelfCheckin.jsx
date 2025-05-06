import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SectionList } from 'react-native';
import { Button, TextInput, ActivityIndicator } from 'react-native-paper';
import Header from '../components/Header';
import { GlobalStyles } from '../Styles/styles';
import GlobalVariables from '../../iStServices/GlobalVariables';
import * as FileSystem from 'expo-file-system';
import { SaveAttendance } from '../../iStClasses/SaveAttendance';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import ProjectListPopup from '../../Popup/ProjectListPopUp';
import { LocationService } from '../../iStServices/LocationService';
import { formatDate, formatTime } from '../Utils/dataTimeUtils';
import { handleCaptureImage } from '../Utils/captureImageUtils';
import { ImageRecognition } from '../Utils/ImageRecognition';
import ImageRecognitionResult from '../components/ImageRecognitionResult';

const SelfCheckin = () => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const navigation = useNavigation();
    const [entryDate, setEntryDate] = useState('');
    const [entryTime, setEntryTime] = useState('');
    const [projectNo, setProjectNo] = useState('');
    const [projectName, setProjectName] = useState('');
    const [empTeamImage, setEmpTeamImage] = useState(null);
    const [coordinates, setCoordinates] = useState('');
    const [locationName, setLocationName] = useState('Fetching location...');
    const [recogloading, setrecogLoading] = useState(false);
    const [matchingFaceNames, setMatchingFaceNames] = useState([]);
    const [cleanedMatchNames, setCleanedMatchNames] = useState([]);
    const [groupedData, setgroupedData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const TrackingStatus = 'checkin';
    const [base64Img, setBase64Img] = useState(null);
    const [selectedEmp, setSelectedEmp] = useState('');

    const handleProjectSelect = (project) => {
        setProjectNo(project.PROJECT_NO);
        setProjectName(project.PROJECT_NAME);
    };

    const convertUriToBase64 = async (uri) => {
        return await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
    };

    useEffect(() => {
        handleCaptureImage(setEmpTeamImage);

        LocationService(setLocationName, setCoordinates);

        const now = new Date();
        setEntryDate(formatDate(now));
        setEntryTime(formatTime(now));
    }, []);

    useEffect(() => {
        if (empTeamImage) {
            ImageRecognition(
                empTeamImage,
                setrecogLoading,
                setBase64Img,
                setMatchingFaceNames,
                setCleanedMatchNames,
                setgroupedData,
                setErrorMessage
            );
        }
    }, [empTeamImage]);

    useEffect(() => {
        if (groupedData && groupedData.length > 0) {
            const empNo = groupedData.flatMap(item => item.data.map(i => i.EMP_NO));
            setSelectedEmp(empNo);
        }
    }, [groupedData]);

    const SaveSelfCheckin = async () => {
        const base64 = await convertUriToBase64(empTeamImage);
        setBase64Img(base64);

        const empData = `<string>${selectedEmp}</string>`;
        console.log(empData);
        try {
            await SaveAttendance({
                projectNo,
                locationName,
                entryDate,
                entryTime,
                coordinates,
                TrackingStatus,
                selectedEmp: empData,
                base64Img: base64Img,
                navigation
            });
        } catch (error) {
            console.error('Error saving Checkin data:', error);
        }
    };

    return (
        <View style={GlobalStyles.pageContainer}>
            <Header title="Self Check-In" />
            <View style={{flex:1}}>
                <View style={GlobalStyles.locationContainer}>
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

                <ImageRecognitionResult
                    recogloading={recogloading}
                    groupedData={groupedData}
                />
            </View>

            <View style={GlobalStyles.bottomButtonContainer}>
                <Button mode="contained" onPress={SaveSelfCheckin}>
                    Save
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

});

export default SelfCheckin;