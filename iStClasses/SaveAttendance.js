import { callSoapService } from '../SoapRequest/callSoapService ';
import GlobalVariables from '../iStServices/GlobalVariables';

export const SaveAttendance = async ({
    projectNo,
    locationName,
    entryDate,
    entryTime,
    coordinates,
    TrackingStatus,
    selectedEmp,
    base64Img,
    navigation,
    returnTo,
    officeLocation
}) => {
    try {
        console.log(officeLocation);
        const Attendance_parameters = {
            CompanyCode: GlobalVariables.CompanyCode,
            BranchCode: GlobalVariables.BranchCode,
            LogDate: entryDate,
            LogTime: entryTime,
            MachineNo: '22',
            EmpNo: '',
            tracking_status: TrackingStatus,
            gps_location: coordinates,
            Username: GlobalVariables.USER_NAME,
            PROJECT_NO: projectNo,
            PROJECT_LOCATION: locationName,
            EmpData: selectedEmp
        };
                
        const empAttendance = await callSoapService(GlobalVariables.Client_URL, 'AddAttendance', Attendance_parameters);

        if (Number.isInteger(empAttendance)) {
            const AttendanceImg_parameters = {
                CompanyCode: GlobalVariables.CompanyCode,
                BranchCode: GlobalVariables.BranchCode,
                AttendanceRefBatchNo: empAttendance,
                ImageData: base64Img,
                ImageExtension: 'jpeg',
            };

            const empAttendanceImg = await callSoapService(GlobalVariables.Client_URL, 'AddAttendance_Image', AttendanceImg_parameters);

            if (empAttendanceImg === null) {
                alert('Attendance Capture Failed');
            } 
            else {
                navigation.navigate('SuccessAnimationScreen', {
                    message: 'Attendance Captured Successfully',
                    details: `Attendance Ref Batch No: ${empAttendance}`,
                    returnTo: returnTo || 'AppTabs',
                });
            }
        }
    } catch (error) {
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Headers:', error.response?.headers);
    }
};
