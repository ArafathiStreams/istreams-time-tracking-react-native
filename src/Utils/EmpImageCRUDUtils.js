import axios from 'axios';
import GlobalVariables from '../../iStServices/GlobalVariables.js';

export const handleEmpImageUpload = async (avatar, empNo, setbtnLoading) => {
    setbtnLoading(true);
    const Username = GlobalVariables.Login_Username;

    const formData = new FormData();
    formData.append('DomainName', Username);
    formData.append('EmpImageFile', {
        uri: avatar,
        type: 'image/jpeg',
        name: 'avatar.jpg',
    });
    formData.append('EmpNo', empNo);

    try {
        const response = await axios.post(
            `http://23.105.135.231:8082/api/EncodeImgToNpy/upload`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (response.data.message === 'Already exists') {
            const updateresponse = await axios.put(
                `http://23.105.135.231:8082/api/EncodeImgToNpy/update`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (updateresponse.data.status === 'Success') {
                alert('Image Updated Successfully');
            }
        }

        if (response.data.status === 'Success') {
            alert('Image Uploaded Successfully');
        }
    } catch (error) {
        console.error('Upload Error:', error);
    } finally {
        setbtnLoading(false);
    }
};

export const handleEmpImageView = async (
    employee,
    setEmpNo,
    setEmpName,
    setDesignation,
    setAvatar
) => {
    const Username = GlobalVariables.Login_Username;
    const domainPart = Username.split('@')[1].split('.')[0];
    const empNoforImg = employee.EMP_NO;

    setEmpNo(employee.EMP_NO);
    setEmpName(employee.EMP_NAME);
    setDesignation(employee.DESIGNATION);

    try {
        const response = await axios.get(
            `http://23.105.135.231:8082/api/EncodeImgToNpy/view`,
            {
                params: {
                    DomainName: domainPart,
                    EmpNo: empNoforImg,
                },
                headers: {
                    accept: '*/*',
                },
                responseType: 'blob',
            }
        );

        const blob = response.data;
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64data = reader.result;
            setAvatar(base64data);
        };

        reader.readAsDataURL(blob);
    } catch (error) {
        console.error('Error fetching image:', error);
        setAvatar(null);
    }
};