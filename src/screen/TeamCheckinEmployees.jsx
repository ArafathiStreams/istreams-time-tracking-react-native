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
import axios from 'axios';
import { SaveAttendance } from '../../iStClasses/SaveAttendance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TeamCheckinEmployees = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [loading, setLoading] = useState(false);
    const [recogloading, setrecogLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [base64Img, setBase64Img] = useState(null);
    const { projectNo, projectName, empTeamImage,
        locationName, entryDate, entryTime, coordinates } = route.params || {};
    const TrackingStatus = 'checkin';
    const [matchingFaceNames, setMatchingFaceNames] = useState([]);
    const [cleanedMatchNames, setCleanedMatchNames] = useState([]);
    const [groupedData, setgroupedData] = useState([]);
    const [selectedEmp, setSelectedEmployees] = useState([]);

    let Username = '';
    let refNo = '';

    const getEmpImage = async (employees) => {
        try {
            setLoading(true);
            const EmployeeListWithImages = [];

            // Optional: establish SOAP connection first
            const doConn_parameters = { LoginUserName: GlobalVariables.Login_Username };
            await callSoapService(GlobalVariables.Client_URL, 'doConnection', doConn_parameters);

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
        ImageRecognition();
    }, []);

    const getNextRefNo = async () => {
        try {
            const current = await AsyncStorage.getItem('refCounter');
            let refNo = current ? parseInt(current, 10) : 1000;

            await AsyncStorage.setItem('refCounter', (refNo + 1).toString());
            return refNo;
        } catch (error) {
            console.error('Failed to get or set refCounter:', error);
            return 1000; // Fallback
        }
    };

    const ImageRecognition = async () => {
        try {
            refNo = await getNextRefNo();

            setrecogLoading(true);
            Username = GlobalVariables.Login_Username;

            const Base64Img = await convertUriToBase64(empTeamImage);
            setBase64Img(Base64Img);

            const response = await axios.post(
                `http://103.168.19.35:8070/api/ImageMatching/upload?DomainName=${Username}`,
                {
                    Base64Images: Base64Img,
                    RefNo: refNo,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            fetchAndDisplayImages();
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const fetchAndDisplayImages = async () => {
        try {
            const domainPart = Username.split('@')[1].split('.')[0];

            setErrorMessage(null);
            const response = await fetch(`http://103.168.19.35:8070/api/View/get-folder-images/${domainPart}/${refNo}`);
            const data = await response.json();

            let finalCombinedList = [];

            if (data["3_matching_faces"]?.length > 0) {
                const matchNames = data["3_matching_faces"].map(img => img.name.replace('.jpg', ''));
                const matchingFaces = data["3_matching_faces"];

                setMatchingFaceNames(matchingFaces.map(i => i.name));
                setCleanedMatchNames(matchNames);

                const storedData = await AsyncStorage.getItem('EmployeeList');
                const parsedData = storedData ? JSON.parse(storedData) : [];

                // Filter matched employees from local data
                const matchedEmployees = parsedData.filter(emp =>
                    matchNames.includes(emp.EMP_NO)
                );

                // Employees found: enrich with image
                const enrichedMatched = matchedEmployees.map(emp => {
                    const img = matchingFaces.find(i => i.name.includes(emp.EMP_NO));
                    return {
                        ...emp,
                        EMP_IMAGE: img?.base64Data || null,
                        MATCH_TYPE: 'MATCHED'
                    };
                });

                finalCombinedList = [...finalCombinedList, ...enrichedMatched];

                // Handle matched images where EMP_NO was not found in local data
                const foundEmpNos = matchedEmployees.map(e => e.EMP_NO);
                const unmatchedImages = matchingFaces.filter(img => {
                    const empNo = img.name.replace('.jpg', '');
                    return !foundEmpNos.includes(empNo);
                });

                const unmatchedImageRecords = unmatchedImages.map(img => ({
                    EMP_NO: img.name.replace('.jpg', ''),
                    EMP_NAME: '',
                    DESIGNATION: '',
                    EMP_IMAGE: img.base64Data,
                    MATCH_TYPE: 'MATCHED_NO_EMP_INLIST',
                }));

                finalCombinedList = [...finalCombinedList, ...unmatchedImageRecords];
            }

            // NON-MATCHING FACES
            if (data["4_non_matching_faces"]?.length > 0) {
                const nonMatched = data["4_non_matching_faces"].map((img, index) => ({
                    EMP_NO: '',
                    EMP_NAME: '',
                    DESIGNATION: '',
                    EMP_IMAGE: img.base64Data,
                    MATCH_TYPE: 'NON_MATCHED',
                }));

                finalCombinedList = [...finalCombinedList, ...nonMatched];
            }

            const matched = finalCombinedList.filter(emp => emp.MATCH_TYPE === 'MATCHED');
            const nonMatched = finalCombinedList.filter(emp => emp.MATCH_TYPE === 'NON_MATCHED');

            const newGroupedData = [];
            if (matched.length > 0) {
                newGroupedData.push({ title: 'Matched Faces', data: matched });
            }
            if (nonMatched.length > 0) {
                newGroupedData.push({ title: 'Non-Matched Faces', data: nonMatched });
            }
            setgroupedData(newGroupedData);

        } catch (error) {
            setErrorMessage(`Error: ${error.message}`);
        } finally {
            setrecogLoading(false);
        }
    };


    const convertUriToBase64 = async (uri) => {
        return await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
    };

    const clearImagePickerCache = async () => {
        try {
            const imagePickerFolder =
                `${FileSystem.documentDirectory}../cache/ExperienceData/%2540anonymous%252FiStreamsTimeTracking-88caeab8-90ad-4f94-b19e-6fa2dbb158eb/ImagePicker/`;

            const folderInfo = await FileSystem.getInfoAsync(imagePickerFolder);
            if (folderInfo.exists && folderInfo.isDirectory) {
                const files = await FileSystem.readDirectoryAsync(imagePickerFolder);

                for (const file of files) {
                    const filePath = imagePickerFolder + file;
                    await FileSystem.deleteAsync(filePath, { idempotent: true });
                }

                console.log('✅ All ImagePicker cache files deleted.');
            } else {
                console.log('❌ ImagePicker folder does not exist or is not a directory.');
            }
        } catch (error) {
            console.error('❌ Failed to clear ImagePicker cache:', error);
        }
    };

    const SaveTeamCheckin = async () => {
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

            clearImagePickerCache();
        } catch (error) {
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

                {recogloading ? (
                    <View style={styles.loaderContainer}>
                        <Text>Analysing your Image. Please Wait...</Text>
                        <ActivityIndicator size="small" color="#0000ff" />
                    </View>
                ) : (
                    <SectionList
                        sections={groupedData}
                        keyExtractor={(item, index) => item.EMP_NO + index}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                backgroundColor: '#eee',
                                padding: 10,
                                color: '#333',
                                marginBottom: 5,
                            }}>
                                {title}
                            </Text>
                        )}
                        renderItem={({ item }) => (
                            <EmployeeListCard
                                loading={false}
                                selectedEmp={[item]} // You already have a FlatList inside
                            />
                        )}
                    />
                )}

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
                        onPress={SaveTeamCheckin}>
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
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default TeamCheckinEmployees;