import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, Image, Modal, FlatList } from 'react-native';
import { Provider as PaperProvider, TextInput, Button } from 'react-native-paper';
import { GlobalStyles } from '../Styles/styles';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import CheckinComponent from '../components/CheckinComponent';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const TeamCheckin = ({ route }) => {
    const navigation = useNavigation();
    const [entryDate, setEntryDate] = useState('');
    const [entryTime, setEntryTime] = useState('');
    const [projectNo, setProjectNo] = useState('');
    const [projectName, setProjectName] = useState('');
    const [empTeamImage, setEmpTeamImage] = useState(null);
    const [coordinates, setCoordinates] = useState('');
    const [locationName, setLocationName] = useState('Fetching location...');

    const handleProjectSelect = (project) => {
        setProjectNo(project.PROJECT_NO);
        setProjectName(project.PROJECT_NAME);
    };

    const handlenavToEmpPage = () => {

        if (!projectNo || !projectName) {
            alert('Project Not Selected.');
            return;
        }
        else if (!empTeamImage) {
            alert('Employee Image Not captured.')
        }
        else {
            console.log(empTeamImage);

            navigation.navigate('TeamCheckinEmployees', {
                projectNo, projectName, empTeamImage,
                locationName, entryDate, entryTime, coordinates
            });
        }
    };
    return (
        <SafeAreaProvider>
            <PaperProvider>
                <View style={GlobalStyles.pageContainer}>
                    <Header title="Team Check-in" />

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

                    <View style={GlobalStyles.bottomButtonContainer}>
                        <Button mode="contained" onPress={handlenavToEmpPage}>
                            Next
                        </Button>
                    </View>
                </View>
            </PaperProvider>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({

})

export default TeamCheckin;