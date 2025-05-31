import { callSoapService } from "../SoapRequest/callSoapService ";
import GlobalVariables from "../iStServices/GlobalVariables";

export const loginBLL = async (username, password) => {

    const Public_ServiceURL = GlobalVariables.Public_Service_URL;

    GlobalVariables.Login_Username = username;

    let name = '';

    const doConn_parameters = {
        LoginUserName: username,
    };

    GlobalVariables.doConnectionParameter = doConn_parameters;
    
    try {
        const Public_doConnResponse = await callSoapService(Public_ServiceURL, 'doConnection', doConn_parameters);

        if (Public_doConnResponse === "SUCCESS") 
        {
            const Public_GetServiceURL = await callSoapService(Public_ServiceURL, 'GetServiceURL_Local', doConn_parameters);

            GlobalVariables.Client_URL = Public_GetServiceURL;
            
            const Client_doConnResponse = await callSoapService(GlobalVariables.Client_URL, 'doConnection', doConn_parameters);

            if (Client_doConnResponse === "SUCCESS") 
            {
                name = username.split('@')[0];

                const verify_Auth_parameters = {
                    username: name,
                    password: password,
                };

                const Client_verifyAuth = await callSoapService(GlobalVariables.Client_URL, 'verifyauthentication', verify_Auth_parameters);

                if (Client_verifyAuth === "Authetication passed") 
                {
                    const empDetails_parameters = {
                        userfirstname: name,
                    };
                    const Client_EmpDetails = await callSoapService(GlobalVariables.Client_URL, 'getemployeename_and_id', empDetails_parameters);
                    const parsedData = JSON.parse(Client_EmpDetails);

                    const Employee = parsedData[0];

                    GlobalVariables.USER_NAME = Employee.USER_NAME;
                    GlobalVariables.EMP_NO = Employee.EMP_NO;

                    const empImage_parameters = {
                        EmpNo: GlobalVariables.EMP_NO,
                    };
                    try {
                    const Client_EmpImage = await callSoapService(GlobalVariables.Client_URL, 'getEmpPic_bytearray_Medium', empImage_parameters);
                    
                    GlobalVariables.EMP_IMAGE_BASE64 = Client_EmpImage.trim();
                    }
                    catch (error) {
                        GlobalVariables.EMP_IMAGE_BASE64 = null;
                    }
                    return Client_verifyAuth;
                }
                else{
                    return Client_verifyAuth;
                }
            }
            else{
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

export default class EmployeeDetails {
    constructor({ USER_NAME, EMP_NO }) {
        this.EMP_NO = EMP_NO;
        this.USER_NAME = USER_NAME;
    }
}