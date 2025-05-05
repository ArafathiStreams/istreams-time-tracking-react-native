import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const handleCaptureImage = async (setImageCallback) => {
    try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Camera access is needed to take a photo.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            setImageCallback(imageUri); // pass the state setter
        }
    } catch (error) {
        Alert.alert('Error', 'Something went wrong while picking the image.');
        console.error(error);
    }
};
