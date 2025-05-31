import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

export const handleCaptureImage = async (setImageCallback) => {
    try {
        clearImagePickerCache();
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Camera access is needed to take a photo.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            quality: 0.3,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            setImageCallback(imageUri); 
        }
    } catch (error) {
        Alert.alert(error, 'Something went wrong while picking the image.');
        console.error(error);
    }
};

export const clearImagePickerCache = async () => {
    try {
        const imagePickerFolder =
            `${FileSystem.documentDirectory}../cache/ExperienceData/%2540anonymous%252FiStreamsTimeTracking-88caeab8-90ad-4f94-b19e-6fa2dbb158eb/`;

        const folderInfo = await FileSystem.getInfoAsync(imagePickerFolder);
        if (folderInfo.exists && folderInfo.isDirectory) {
            const files = await FileSystem.readDirectoryAsync(imagePickerFolder);

            for (const file of files) {
                const filePath = imagePickerFolder + file;
                await FileSystem.deleteAsync(filePath, { idempotent: true });
            }
        } else {
            console.log('❌ ImagePicker folder does not exist or is not a directory.');
        }
    } catch (error) {
        console.error('❌ Failed to clear ImagePicker cache:', error);
    }
};