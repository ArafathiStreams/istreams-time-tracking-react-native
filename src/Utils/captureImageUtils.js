import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

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
            const resizedPhoto = await ImageManipulator.manipulateAsync(
                imageUri,
                [{ resize: { width: 800 } }],
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );

            console.log('Resized image URI:', resizedPhoto.uri);
            console.log('New dimensions:', resizedPhoto.width, 'x', resizedPhoto.height);

            const fileInfo = await FileSystem.getInfoAsync(resizedPhoto.uri);
            console.log('Resized image size in bytes:', fileInfo.size);
            setImageCallback(resizedPhoto.uri);
        }
    } catch (error) {
        Alert.alert(error, 'Something went wrong while picking the image.');
        console.error(error);
    }
};

export const clearImagePickerCache = async () => {
    // const folderUri = FileSystem.cacheDirectory + 'ExperienceData/%2540anonymous%252FiStreamsTimeTracking-88caeab8-90ad-4f94-b19e-6fa2dbb158eb/ImagePicker/';
    const imageManipulatorCache = FileSystem.cacheDirectory + 'ImageManipulator/';

    // try {
    //     const folderInfo = await FileSystem.getInfoAsync(folderUri);
    //     if (folderInfo.exists && folderInfo.isDirectory) {
    //         await FileSystem.deleteAsync(folderUri, { idempotent: true });
    //         console.log('✅ ImagePicker folder deleted successfully.');
    //     } else {
    //         console.log('⚠️ Folder does not exist or is not a directory.');
    //     }
    // } catch (error) {
    //     console.error('❌ Failed to delete ImagePicker folder:', error);
    // }

    try {
        const manipulatorInfo = await FileSystem.getInfoAsync(imageManipulatorCache);
        if (manipulatorInfo.exists && manipulatorInfo.isDirectory) {
            await FileSystem.deleteAsync(imageManipulatorCache, { idempotent: true });
        } else {
            console.log('⚠️ ImageManipulator folder does not exist or is not a directory.');
        }
    } catch (error) {
        console.error('❌ Failed to delete ImageManipulator folder:', error);
    }
};
