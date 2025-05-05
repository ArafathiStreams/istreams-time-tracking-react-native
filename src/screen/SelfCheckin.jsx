import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Header from '../components/Header';
import CheckinComponent from '../components/CheckinComponent';
import { GlobalStyles } from '../Styles/styles';
import GlobalVariables from '../../iStServices/GlobalVariables';
import * as FileSystem from 'expo-file-system';
import { SaveAttendance } from '../../iStClasses/SaveAttendance';
import { useNavigation } from '@react-navigation/native';

const SelfCheckin = () => {
    const navigation = useNavigation();
    const [entryDate, setEntryDate] = useState('');
    const [entryTime, setEntryTime] = useState('');
    const [projectNo, setProjectNo] = useState('');
    const [projectName, setProjectName] = useState('');
    const [empTeamImage, setEmpTeamImage] = useState(null);
    const [coordinates, setCoordinates] = useState('');
    const [locationName, setLocationName] = useState('Fetching location...');
    const TrackingStatus = 'checkin';
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

    const SaveSelfCheckin = async () => {
        const base64 = await convertUriToBase64(empTeamImage);
        setBase64Img(base64);

        const empData = `<string>${GlobalVariables.EMP_NO}</string>`;
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

            <ScrollView>
                <Text style={[GlobalStyles.subtitle, { marginBottom: 10 }]}>Check-In Employee</Text>
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