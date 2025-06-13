import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalVariables from '../../iStServices/GlobalVariables';
import { formatNormalDate, formatNormalTime } from './dataTimeUtils';

export const ImageRecognition = async (
    empTeamImage,
    setRecogLoading,
    setBase64Img,
    setMatchingFaceNames,
    setCleanedMatchNames,
    setGroupedData,
    setErrorMessage
) => {
    try {
        const getDeviceID = async () => {
            const deviceID = GlobalVariables.AndroidID;
            if(!deviceID) {
                const deviceID = GlobalVariables.USER_NAME;
                return deviceID;
            }
            return deviceID;
        }
        const getUniqueRefNo = async () => {
            const now = new Date();
            const date = formatNormalDate(now);
            const time = formatNormalTime(now);

            const dateStr = date + time;

            return dateStr;
        }

        const refNo = await getUniqueRefNo();
        const DEVICE_ID = await getDeviceID();
        setRecogLoading(true);
        const Username = GlobalVariables.Login_Username;
        
        const formData = new FormData();
        formData.append('file', {
            uri: empTeamImage,
            name: 'uploaded_img.jpeg',
            type: 'image/jpeg'
        });
        formData.append('RefNo', refNo);
        formData.append('DomainName', Username);
        formData.append('DeviceName', DEVICE_ID);

        try {
            const response = await axios.post(
                'http://23.105.135.231:8100/ImageMatching',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json',
                    },
                }
            );
            
        } catch (error) {
            setErrorMessage('Image recognition error:', error.response?.data || error.message);
        }

        const fetchAndDisplayImages = async () => {
            try {
                const domainPart = Username.split('@')[1].split('.')[0];
                setErrorMessage(null);

                const response = await fetch(
                    `http://23.105.135.231:8082/api/View/get-folder-images/${domainPart}/${DEVICE_ID}/${refNo}`
                );

                const text = await response.text();
                if (!text) {
                    throw new Error('Empty response received from image matching API.');
                }

                let data;
                try {
                    data = JSON.parse(text);
                } catch (parseError) {
                    throw new Error('Invalid JSON response received: ' + parseError.message);
                }

                let finalCombinedList = [];

                if (data["3_matching_faces"]?.length > 0) {
                    const matchNames = data["3_matching_faces"].map(img => img.name.replace('.jpg', ''));
                    const matchingFaces = data["3_matching_faces"];
                    setMatchingFaceNames(matchingFaces.map(i => i.name));
                    setCleanedMatchNames(matchNames);

                    const storedData = await AsyncStorage.getItem('EmployeeList');
                    const parsedData = storedData ? JSON.parse(storedData) : [];

                    const matchedEmployees = parsedData.filter(emp => matchNames.includes(emp.EMP_NO));
                    const enrichedMatched = matchedEmployees.map(emp => {
                        const img = matchingFaces.find(i => i.name.includes(emp.EMP_NO));
                        return {
                            ...emp,
                            EMP_IMAGE: img?.base64Data || null,
                            MATCH_TYPE: 'MATCHED'
                        };
                    });

                    finalCombinedList = [...finalCombinedList, ...enrichedMatched];

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

                if (data["4_non_matching_faces"]?.length > 0) {
                    const nonMatched = data["4_non_matching_faces"].map(img => ({
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
                const matchedNoEmp = finalCombinedList.filter(emp => emp.MATCH_TYPE === 'MATCHED_NO_EMP_INLIST');

                const newGroupedData = [];
                if (matched.length > 0) newGroupedData.push({ title: 'Matched Faces', data: matched });
                if (nonMatched.length > 0) newGroupedData.push({ title: 'Non-Matched Faces', data: nonMatched });
                if (matchedNoEmp.length > 0) newGroupedData.push({ title: 'Matched Faces (No Employee in List)', data: matchedNoEmp });

                setGroupedData(newGroupedData);
            } catch (error) {
                setErrorMessage(`Error: ${error.message}`);
            } finally {
                setRecogLoading(false);
            }
        };

        await fetchAndDisplayImages();

    } catch (error) {
        setErrorMessage('Image recognition error:', error);
        setRecogLoading(false);
    }
};
