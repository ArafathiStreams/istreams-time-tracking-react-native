import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, FlatList, SectionList } from 'react-native';
import { Provider as PaperProvider, Button, ActivityIndicator } from 'react-native-paper';
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

const TeamCheckinEmployees = () => {
    const navigation = useNavigation();
    const route = useRoute();
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
    }, []);

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
                navigation
            });

            setbtnLoading(false);
        } catch (error) {
            setbtnLoading(false);
            console.error('Error saving Checkin data:', error);
        }
    };

    return (
        <PaperProvider>
            <View style={GlobalStyles.pageContainer}>
                <Header title="Add Check-in Employees" />

                <View style={styles.projectContainer}>
                    <Text style={styles.txtPrjNo}> {projectNo}</Text>
                    <Text style={styles.txtPrjName}> {projectName}</Text>
                </View>

                <ImageRecognitionResult
                    recogloading={recogloading}
                    groupedData={groupedData}
                />

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

                <Text style={styles.txtProjDetails}>Selected Employees</Text>

                <View style={{ flex: 1 }}>
                    <EmployeeListCard loading={loading} selectedEmp={selectedEmp} />
                </View>

                <View style={GlobalStyles.bottomButtonContainer}>
                    <Button mode="contained"
                        onPress={SaveTeamCheckin}
                        disabled={btnloading}
                        loading={btnloading}>
                        Save
                    </Button>
                </View>
            </View>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    projectContainer: {
        backgroundColor: '#d7dff7',
        borderRadius: 15,
        padding: 10,
        marginVertical: 10,
    },
    txtProjDetails: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 5,
        color: '#0685de',
    },
    txtPrjNo: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0685de',
    },
    txtPrjName: {
        fontSize: 15,
        fontWeight: "600"
    },
})

export default TeamCheckinEmployees;