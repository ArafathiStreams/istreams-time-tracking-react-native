import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Header from '../components/Header';
import CheckinComponent from '../components/CheckinComponent';
import { GlobalStyles } from '../Styles/styles';
import GlobalVariables from '../../iStServices/GlobalVariables';
import * as FileSystem from 'expo-file-system';
import { SaveAttendance } from '../../iStClasses/SaveAttendance';

const SelfCheckout = () => {
    const [entryDate, setEntryDate] = useState('');
    const [entryTime, setEntryTime] = useState('');
    const [projectNo, setProjectNo] = useState('');
    const [projectName, setProjectName] = useState('');
    const [empTeamImage, setEmpTeamImage] = useState(null);
    const [coordinates, setCoordinates] = useState('');
    const [locationName, setLocationName] = useState('Fetching location...');
    const TrackingStatus = 'checkout';
    const [base64Img, setBase64Img] = useState(null);
    let selectedEmp = GlobalVariables.EMP_NO;

    const handleProjectSelect = (project) => {
        setProjectNo(project.PROJECT_NO);
        setProjectName(project.PROJECT_NAME);
    };

    const convertUriToBase64 = async (uri) => {
        return await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
    };

    const SaveSelfCheckout = async () => {
        const Base64Img = await convertUriToBase64(empTeamImage);
        setBase64Img(Base64Img);

        selectedEmp = `<string>${GlobalVariables.EMP_NO}</string>`
        try {
            await SaveAttendance({
                projectNo,
                locationName,
                entryDate,
                entryTime,
                coordinates,
                TrackingStatus,
                empTeamImage,
                selectedEmp,
                base64Img,
            });
        } catch (error) {
            console.error('Error saving Checkin data:', error);
        }
    };
    return (
        <View style={GlobalStyles.pageContainer}>
            <Header title="Self Check-Out" />

            <ScrollView>
                <Text style={[GlobalStyles.subtitle, { marginBottom: 10 }]}>Check-Out Employee</Text>
                <TextInput
                    mode="outlined"
                    label="Emp No"
                    value={GlobalVariables.EMP_NO}
                    editable={false} />
                <CheckinComponent
                    entryDate={entryDate}
                    setEntryDate={setEntryDate}
                    entryTime={entryTime}
                    setEntryTime={setEntryTime}
                    projectNo={projectNo}
                    projectName={projectName}
                    empTeamImage={empTeamImage}
                    setEmpTeamImage={setEmpTeamImage}
                    coordinates={coordinates}
                    setCoordinates={setCoordinates}
                    locationName={locationName}
                    setLocationName={setLocationName}
                    onProjectSelect={handleProjectSelect} />
            </ScrollView>

            <View style={GlobalStyles.bottomButtonContainer}>
                <Button mode="contained" onPress={SaveSelfCheckout}>
                    Save
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

});

export default SelfCheckout;