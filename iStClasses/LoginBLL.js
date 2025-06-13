import { callSoapService } from "../SoapRequest/callSoapService ";
import GlobalVariables from "../iStServices/GlobalVariables";
import config from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';

export const loginBLL = async (username, password) => {
    const Public_ServiceURL = config.API_BASE_URL;

    GlobalVariables.Login_Username = username;

    let name = '';

    const doConn_parameters = {
        LoginUserName: username,
    };

    GlobalVariables.doConnectionParameter = doConn_parameters;

    try {
        const Public_doConnResponse = await callSoapService(Public_ServiceURL, 'doConnection', doConn_parameters);

        if (Public_doConnResponse === "SUCCESS") {
            const Public_GetServiceURL = await callSoapService(Public_ServiceURL, 'GetServiceURL_Local', doConn_parameters);

            GlobalVariables.Client_URL = Public_GetServiceURL;

            const Client_doConnResponse = await callSoapService(GlobalVariables.Client_URL, 'doConnection', doConn_parameters);

            if (Client_doConnResponse === "SUCCESS") {
                name = username.split('@')[0];

                const verify_Auth_parameters = {
                    username: name,
                    password: password,
                };

                const Client_verifyAuth = await callSoapService(GlobalVariables.Client_URL, 'verifyauthentication', verify_Auth_parameters);

                if (Client_verifyAuth === "Authetication passed") {
                    const alreadySetup = await loadFromStorage('INITIALIZED');

                    if (!alreadySetup) {
                        const Client_companyCode = await callSoapService(GlobalVariables.Client_URL, 'General_Get_DefaultCompanyCode', '');
                        const branchCode_parameters = { 
                            CompanyCode: Client_companyCode 
                        };
                        const Client_branchCode = await callSoapService(GlobalVariables.Client_URL, 'General_Get_DefaultBranchCode', branchCode_parameters);
                        const companyName_parameters = { 
                            CompanyCode: Client_companyCode, BranchCode: Client_branchCode 
                        };
                        const Client_companyName = await callSoapService(GlobalVariables.Client_URL, 'General_Get_DefaultCompanyName', companyName_parameters);
                        const empDetails_parameters = { 
                            userfirstname: name 
                        };
                        const Client_EmpDetails = await callSoapService(GlobalVariables.Client_URL, 'getemployeename_and_id', empDetails_parameters);
                        const parsedData = JSON.parse(Client_EmpDetails);
                        const Employee = parsedData[0];

                        const empImage_parameters = { EmpNo: Employee.EMP_NO };
                        let empImage = null;

                        try {
                            empImage = await callSoapService(GlobalVariables.Client_URL, 'getEmpPic_bytearray_Medium', empImage_parameters);
                        } catch (error) {
                            empImage = null;
                        }

                        const android = Device.osInternalBuildId;

                        const userData = {
                            CompanyCode: Client_companyCode,
                            BranchCode: Client_branchCode,
                            CompanyName: Client_companyName,
                            USER_NAME: Employee.USER_NAME,
                            EMP_NO: Employee.EMP_NO,
                            EMP_IMAGE_BASE64: empImage?.trim() ?? null,
                            AndroidID: android
                        };

                        await saveToStorage('USER_DATA', userData);
                        await saveToStorage('INITIALIZED', true);

                        Object.assign(GlobalVariables, userData); 
                    } else {
                        const userData = await loadFromStorage('USER_DATA');
                        if (userData) {
                            Object.assign(GlobalVariables, userData);
                        }
                    }

                    return Client_verifyAuth;
                }
                else {
                    return Client_verifyAuth;
                }
            }
            else {
                return Client_doConnResponse;
            }
        }
        else {
            return Public_doConnResponse;
        }
    }
    catch (error) {
        console.error(error);
        return (error);
    }
}

const saveToStorage = async (key, value) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
};

const loadFromStorage = async (key) => {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
};


export default class EmployeeDetails {
    constructor({ USER_NAME, EMP_NO }) {
        this.EMP_NO = EMP_NO;
        this.USER_NAME = USER_NAME;
    }
}