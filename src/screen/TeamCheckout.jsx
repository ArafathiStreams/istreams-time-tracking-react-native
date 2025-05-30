import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { LocationService } from '../../iStServices/LocationService';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { GlobalStyles } from '../Styles/styles';
import { PaperProvider, TextInput, Button } from 'react-native-paper';
import { formatDate, formatTime } from '../Utils/dataTimeUtils';
import ProjectListPopup from '../../Popup/ProjectListPopUp';
import CustomDatePicker from '../components/CustomDatePicker';
import { handleCaptureImage } from '../Utils/captureImageUtils';

const TeamCheckout = () => {
    const navigation = useNavigation();
    const [empTeamImage, setEmpTeamImage] = useState(null);
    const [locationName, setLocationName] = useState('Fetching Location...');
    const [coordinates, setCoordinates] = useState('');
    const [entryDate, setCheckoutDate] = useState('');
    const [entryTime, setCheckoutTime] = useState('');
    const [projectNo, setProjectNo] = useState('');
    const [projectName, setProjectName] = useState('');
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [chosenCheckinDate, setChosenCheckinDate] = useState('');

    const handleProjectSelect = (project) => {
        setProjectNo(project.PROJECT_NO);
        setProjectName(project.PROJECT_NAME);
        setPopupVisible(false);
    };

    const handleDateSelected = (dateString) => {
        setChosenCheckinDate(dateString);
    };

    useEffect(() => {
        LocationService(setLocationName, setCoordinates);
        const now = new Date();
        setCheckoutDate(formatDate(now));
        setCheckoutTime(formatTime(now));
        setChosenCheckinDate(formatDate(now));
    }, []);

    const handlenavToEmpPage = () => {

        if (!projectNo || !projectName) {
            alert('Project Not Selected.');
            return;
        }
        else if(!chosenCheckinDate){
            alert('Check-in Date not entered.')
        }
        else if (!empTeamImage) {
            alert('Employee Image Not captured.')
        }
        else {
            navigation.navigate('TeamCheckoutEmployees', {
                projectNo, chosenCheckinDate,
                entryDate, entryTime, coordinates, locationName, empTeamImage
            });
        }
    };

    return (
        <PaperProvider>
            <View style={GlobalStyles.pageContainer}>
                <Header title="Team Check-out" />

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
                            style={styles.input}
                            editable={false}
                        />
                    </View>

                    <View style={GlobalStyles.container2}>
                        <TextInput
                            mode="outlined"
                            label="Entry Time"
                            value={entryTime}
                            style={styles.input}
                            editable={false}
                            onPressIn={() => setShowTimePicker(true)}
                        />
                    </View>
                </View>

                <Text style={[GlobalStyles.subtitle, { marginTop: 10 }]}>Retrieve Check-in Details here</Text>

                <View style={styles.projectContainer}>
                    <View style={[GlobalStyles.twoInputContainer, { marginVertical: 5 }]}>
                        <TextInput
                            mode="outlined"
                            label="Project No"
                            onPressIn={() => setPopupVisible(true)}
                            value={projectNo}
                            onChangeText={setProjectNo}
                            style={GlobalStyles.container1}
                            placeholder="Enter Project No"
                            showSoftInputOnFocus={false} />
                        <TextInput
                            mode="outlined"
                            label="Check-in Date"
                            onPress={() => setVisible(true)}
                            value={chosenCheckinDate}
                            style={GlobalStyles.container2}
                            showSoftInputOnFocus={false}
                        />
                    </View>

                    <TextInput
                        mode="outlined"
                        label="Project Name"
                        value={projectName}
                        onChangeText={setProjectName}
                        editable={false}
                        placeholder="Enter Project Name" />
                </View>

                <View style={GlobalStyles.camButtonContainer}>
                    <Button icon="camera" mode="contained-tonal" onPress={() => handleCaptureImage(setEmpTeamImage)}>
                        Capture Image
                    </Button>
                </View>
                <View style={GlobalStyles.imageContainer}>
                    <Image
                        source={{ uri: empTeamImage }}
                        style={GlobalStyles.fullImage}
                    />
                </View>

                <View style={GlobalStyles.bottomButtonContainer}>
                    <Button mode="contained" onPress={handlenavToEmpPage}>
                        Next
                    </Button>
                </View>
            </View>

            <ProjectListPopup
                visible={isPopupVisible}
                onClose={() => setPopupVisible(false)}
                onSelect={handleProjectSelect}
            />

            <CustomDatePicker
                visible={visible}
                onClose={() => setVisible(false)}
                onDateSelected={handleDateSelected}
            />
        </PaperProvider>
    )
}

const styles = StyleSheet.create({

})

export default TeamCheckout;