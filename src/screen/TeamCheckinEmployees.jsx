import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import Header from '../components/Header';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { callSoapService } from '../../SoapRequest/callSoapService ';
import GlobalVariables from '../../iStServices/GlobalVariables';
import { GlobalStyles } from '../Styles/styles';
import EmployeeListCard from '../components/EmployeeListCard';
import * as FileSystem from 'expo-file-system';
import { SaveAttendance } from '../../iStClasses/SaveAttendance';
import { ImageRecognition } from '../Utils/ImageRecognition';
import ImageRecognitionResult from '../components/ImageRecognitionResult';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TeamCheckinEmployees = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const [btnloading, setbtnLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [base64Img, setBase64Img] = useState(null);
    const { projectNo, projectName, empTeamImage,
        locationName, entryDate, entryTime, coordinates } = route.params || {};
    const TrackingStatus = 'checkin';
    const [selectedEmp, setSelectedEmployees] = useState([]);
    const [recogloading, setrecogLoading] = useState(false);
    const [matchingFaceNames, setMatchingFaceNames] = useState([]);
    const [cleanedMatchNames, setCleanedMatchNames] = useState([]);
    const [groupedData, setgroupedData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const getEmpImage = async (employees) => {
        try {
            setLoading(true);
            const EmployeeListWithImages = [];

            for (const emp of employees) {
                let empImage = null;

                try {
                    // Call SOAP API for employee image
                    empImage = await callSoapService(GlobalVariables.Client_URL, 'getpic_bytearray', {
                        EmpNo: emp.EMP_NO,
                    });

                } catch (error) {
                    console.warn(`Failed to fetch image for ${emp.EMP_NO}`, error);
                    empImage = null;
                }

                EmployeeListWithImages.push({
                    ...emp,
                    EMP_IMAGE: empImage,
                });
            }

            setSelectedEmployees(EmployeeListWithImages);
        }
        catch (error) {
            console.error('Error fetching employee images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageRecognition = async () => {
        await ImageRecognition(empTeamImage,
            setrecogLoading,
            setBase64Img,
            setMatchingFaceNames,
            setCleanedMatchNames,
            setgroupedData,
            setErrorMessage);
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

    const convertUriToBase64 = async (uri) => {
        return await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
    };

    const SaveTeamCheckin = async () => {
        setbtnLoading(true);
        const empData = selectedEmp
            .map(emp => emp.EMP_NO ? `<string>${emp.EMP_NO}</string>` : '')
            .join('');

        const base64 = await convertUriToBase64(empTeamImage);
        setBase64Img(base64);

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
                navigation,
                returnTo: 'TeamCheckin'
            });

            setbtnLoading(false);
        } catch (error) {
            setbtnLoading(false);
            console.error('Error saving Checkin data:', error);
        }
    };

    const reload = () => {
        handleImageRecognition();
    };

    return (
        <View style={[GlobalStyles.pageContainer, { paddingTop: insets.top }]}>
            <Header title="Add Check-in Employees" />

            <View style={styles.projectContainer}>
                <Text style={[GlobalStyles.subtitle_2, { color: '#0685de' }]}> {projectNo}</Text>
                <Text style={GlobalStyles.subtitle}> {projectName}</Text>
            </View>

            <View style={[GlobalStyles.camButtonContainer, { marginBottom: 10 }]}>
                <Button icon={"reload"} mode="contained" title="Reload Page" onPress={reload} >Retry</Button>
            </View>

            <FlatList
                data={selectedEmp}
                keyExtractor={(item) => item.EMP_NO}
                ListHeaderComponent={
                    <>
                        <ImageRecognitionResult recogloading={recogloading} groupedData={groupedData} />

                        <View style={GlobalStyles.camButtonContainer}>
                            <Button
                                icon="plus"
                                mode="contained-tonal"
                                onPress={() =>
                                    navigation.navigate('EmployeeList', {
                                        onSelect: async (employees) => {
                                            await getEmpImage(employees);
                                        }
                                    })
                                }
                            >
                                Add Employees
                            </Button>
                        </View>

                        <Text style={[GlobalStyles.subtitle_2, { color: '#0685de' }]}>
                            Selected Employees
                        </Text>
                    </>
                }
                renderItem={({ item }) => (
                    <EmployeeListCard loading={loading} selectedEmp={[item]} />
                )}
                ListEmptyComponent={<Text style={{ padding: 10 }}>No employees selected.</Text>}
            />

            <View style={GlobalStyles.bottomButtonContainer}>
                <Button mode="contained"
                    onPress={SaveTeamCheckin}
                    disabled={btnloading}
                    loading={btnloading}>
                    Save
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    projectContainer: {
        backgroundColor: '#d7dff7',
        borderRadius: 15,
        padding: 10,
        marginVertical: 10,
    },
});

export default TeamCheckinEmployees;