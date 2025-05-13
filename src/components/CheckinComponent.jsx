import React, { useState, useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import { Provider as PaperProvider, TextInput, Button } from 'react-native-paper';
import { GlobalStyles } from '../Styles/styles';
import { LocationService } from '../../iStServices/LocationService';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import ProjectListPopup from '../../Popup/ProjectListPopUp';
import { formatDate, formatTime } from '../Utils/dataTimeUtils';
import { handleCaptureImage } from '../Utils/captureImageUtils';
import * as ImagePicker from 'expo-image-picker';

const CheckinComponent = ({
    entryDate,
    setEntryDate,
    setEntryTime,
    entryTime,
    projectNo,
    projectName,
    empTeamImage,
    setEmpTeamImage,
    setCoordinates,
    locationName,
    setLocationName,
    onProjectSelect,
}) => {
    const [isPopupVisible, setPopupVisible] = useState(false);

    const preferredCamera = ImagePicker.CameraType.back;

    useEffect(() => {
        LocationService(setLocationName,setCoordinates);

        const now = new Date();
        setEntryDate(formatDate(now));
        setEntryTime(formatTime(now));
    }, []);

    return (
        <PaperProvider>
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
                        onProjectSelect(project);
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
            <View style={GlobalStyles.camButtonContainer}>
                <Button icon="camera" mode="contained-tonal" onPress={() => handleCaptureImage(setEmpTeamImage, preferredCamera)}>
                    Capture Image
                </Button>
            </View>
            <View style={GlobalStyles.imageContainer}>
                <Image
                    source={{ uri: empTeamImage }}
                    style={GlobalStyles.fullImage}
                />
            </View>
        </PaperProvider>
    )
}

export default CheckinComponent;