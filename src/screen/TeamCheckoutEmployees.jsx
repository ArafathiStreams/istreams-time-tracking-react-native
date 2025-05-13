import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import { callSoapService } from '../../SoapRequest/callSoapService ';
import GlobalVariables from '../../iStServices/GlobalVariables';
import { GlobalStyles } from '../Styles/styles';
import { ActivityIndicator, Button, Checkbox } from 'react-native-paper';
import { SaveAttendance } from '../../iStClasses/SaveAttendance';
import * as FileSystem from 'expo-file-system';

const TeamCheckoutEmployees = () => {
    const route = useRoute();
    const { projectNo, chosenCheckinDate, entryDate, entryTime, coordinates, locationName, empTeamImage } = route.params || {};
    const [btnloading, setbtnLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkinEmp, setcheckinEmp] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [base64Img, setBase64Img] = useState(null);
    const TrackingStatus = 'checkout';

    const getCurrentCheckinEmp = async (projectNo, chosenCheckinDate) => {
        try {
            setLoading(true);
            const EmployeeListWithImages = [];

            try {
                const retCheckinEmp_parameters = {
                    LogDate: chosenCheckinDate,
                    PROJECT_NO: projectNo
                };
                const CurrentCheckinEmp = await callSoapService(GlobalVariables.Client_URL, 'Retrieve_Project_Current_Employees', retCheckinEmp_parameters);

                const parsed_CurrentCheckinEmp = JSON.parse(CurrentCheckinEmp);

                for (const emp of parsed_CurrentCheckinEmp) {
                    let empImage = null;

                    try {
                        // Call SOAP API for employee image
                        empImage = await callSoapService(GlobalVariables.Client_URL, 'getpic_bytearray', {
                            EmpNo: emp.emp_no,
                        });

                    } catch (error) {
                        console.warn(`Failed to fetch image for ${emp.emp_no}`, error);
                        empImage = null;
                    }

                    EmployeeListWithImages.push({
                        ...emp,
                        EMP_IMAGE: empImage,
                    });
                }

                setcheckinEmp(EmployeeListWithImages);

                const initialChecks = {};
                parsed_CurrentCheckinEmp.forEach(emp => {
                    initialChecks[emp.emp_no] = false;
                });
                setCheckedItems(initialChecks);

            } catch (error) {
                console.warn(error);
            }
        }
        catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCheckbox = (empNo) => {
        setCheckedItems(prevState => ({
            ...prevState,
            [empNo]: !prevState[empNo]
        }));
    };

    useEffect(() => {
        getCurrentCheckinEmp(projectNo, chosenCheckinDate);

        ConvertToBase64();
    }, []);

    const convertUriToBase64 = async (uri) => {
        return await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
    };
    const ConvertToBase64 = async () => {
        try {
            const Base64Img = await convertUriToBase64(empTeamImage);
            setBase64Img(Base64Img);
        } catch (error) {
            console.error('Error Converting image to Base64:', error);
        }
    };
    const SaveTeamCheckout = async () => {
        setbtnLoading(true);
        const selectedEmp = checkinEmp.filter(emp => checkedItems[emp.emp_no]);

        if (selectedEmp.length === 0) {
            alert('Employee not selected');
            return;
        }

        const empData = selectedEmp
            .map(emp => emp.emp_no ? `<string>${emp.emp_no}</string>` : '')
            .join('');

        try {
            await SaveAttendance({
                projectNo,
                locationName,
                entryDate,
                entryTime,
                coordinates,
                TrackingStatus,
                empTeamImage,
                selectedEmp: empData,
                base64Img,
            });

            setbtnLoading(false);
        } catch (error) {
            setbtnLoading(false);
            console.error('Error saving Checkout data:', error);
        }
    };


    return (
        <View style={GlobalStyles.pageContainer}>
            <Header title="Check-out Employees" />

            <View style={styles.employeeListContainer}>
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="small" color="#0000ff" />
                    </View>
                ) : (
                    <FlatList
                        data={checkinEmp}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => (item.EMP_NO ? item.EMP_NO.toString() : `emp-${index}`)}
                        renderItem={({ item }) => (
                            <View style={styles.container}>
                                <Image
                                    source={
                                        item.EMP_IMAGE
                                            ? { uri: `data:image/png;base64,${item.EMP_IMAGE}` }
                                            : require('../../assets/human.png')
                                    }
                                    style={styles.empImage}
                                />
                                <View style={styles.innerContainer}>
                                    <Text style={styles.txtEmpNo}>{item.emp_no}</Text>
                                    <Text style={styles.txtEmpName}>{item.emp_name}</Text>
                                    <Text style={styles.txtDesignation}>{item.inout_status}</Text>
                                </View>
                                <View style={styles.checkBoxSection}>
                                    <Checkbox
                                        status={checkedItems[item.emp_no] ? 'checked' : 'unchecked'}
                                        onPress={() => toggleCheckbox(item.emp_no)}
                                    />
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>

            <View style={GlobalStyles.bottomButtonContainer}>
                <Button mode="contained"
                    onPress={SaveTeamCheckout}
                    loading={btnloading}
                    disabled={btnloading}>
                    Save
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    employeeListContainer: {
        flex: 1,
        marginVertical: 10
    },
    empImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    container: {
        flexDirection: 'row',
        backgroundColor: '#dddddb',
        justifyContent: 'space-between',
        borderRadius: 15,
        padding: 10,
        marginBottom: 10
    },
    innerContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    txtEmpNo: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0685de',
    },
    txtEmpName: {
        fontSize: 15,
        fontWeight: "600"
    },
    txtDesignation: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    checkBoxSection: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TeamCheckoutEmployees;
