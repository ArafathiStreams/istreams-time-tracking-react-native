import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ChangeEmpImageScreen from '../../src/screen/ChangeEmpImageScreen';
import EmployeeAddComponent from '../components/EmployeeAddComponent';
import Header from '../components/Header';
import GlobalVariables from '../../iStServices/GlobalVariables';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateNonMatchedEmpScreen = () => {
    const [selectedSection, setSelectedSection] = useState('section1');
    const [employeeData, setEmployeeData] = useState();

    useEffect(() =>{
        const fetchEmployeeData = async () => {
            let User_EmpNo = GlobalVariables.EMP_NO;

            const storedData = await AsyncStorage.getItem('EmployeeList');
            if (storedData !== null) {
                const parsedData = JSON.parse(storedData);
                const employee = parsedData.find(emp => emp.EMP_NO === User_EmpNo);
                setEmployeeData(employee);
            }
        };

        fetchEmployeeData();
    }, []);

    return (
        <View style={styles.container}>
            <Header title="Update Non-Matched Emp Image" />

            <ChangeEmpImageScreen />
        </View>
    );
};

export default UpdateNonMatchedEmpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: '#fff',
    },
    toggleContainer: {
        marginTop: 10,
        marginHorizontal: 5,
        flexDirection: 'row',
        backgroundColor: '#fddde0',
        borderRadius: 25,
        padding: 3,
        alignSelf: 'center',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        flex: 1,
        alignItems: 'center',
        borderRadius: 25,
    },
    leftButton: {
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
    },
    rightButton: {
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
    },
    activeButton: {
        backgroundColor: '#f44336',
    },
    inactiveButton: {
        backgroundColor: 'transparent',
    },
    text: {
        fontWeight: 'bold',
    },
    activeText: {
        color: '#fff',
    },
    inactiveText: {
        color: '#999',
    },
});
