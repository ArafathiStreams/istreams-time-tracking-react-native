import AsyncStorage from "@react-native-async-storage/async-storage";
import { callSoapService } from "../SoapRequest/callSoapService ";
import GlobalVariables from "../iStServices/GlobalVariables";

export const loadData = async (taskKey) => {
    try {
        if (taskKey === 'fetchEmployees') {
            const EmpList_SQLQueryParameter = {
                SQLQuery: 'SELECT EMP_NO, EMP_NAME, DESIGNATION from emp_master'
            };

            const EmployeeList = await callSoapService(GlobalVariables.Client_URL, 'DataModel_GetDataFrom_Query', EmpList_SQLQueryParameter);

            const parsedEmployeeListData = JSON.parse(EmployeeList);

            await AsyncStorage.setItem('EmployeeList', JSON.stringify(parsedEmployeeListData));
        }

        if (taskKey === 'fetchProjects') {
            const ProjectList = await callSoapService(GlobalVariables.Client_URL, 'getallprojects', '');

            const parsedProjectListData = JSON.parse(ProjectList);

            await AsyncStorage.setItem('ProjectList', JSON.stringify(parsedProjectListData));
        }

        if (taskKey === 'fetchManpowerSuppliers') {
            const ManSupplier_SQLQueryParameter = {
                SQLQuery: 'SELECT SUPPLIER_NAME from manpower_supplier_master'
            };

            const ManPowerSupplierList = await callSoapService(GlobalVariables.Client_URL, 'DataModel_GetDataFrom_Query', ManSupplier_SQLQueryParameter);

            const parsedManPowerSupplierListData = JSON.parse(ManPowerSupplierList);

            await AsyncStorage.setItem('ManPowerSupplierList', JSON.stringify(parsedManPowerSupplierListData));
        }
    } catch (error) {
        console.error("❌ loadData error:", error);
    }
};