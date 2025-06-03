import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
const { width, height } = Dimensions.get('window');
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalVariables from '../iStServices/GlobalVariables';
import axios from 'axios';
import { GlobalStyles } from '../src/Styles/styles';
import { Button } from 'react-native-paper';


const ImageEditPopUp = ({ setAvatar, empNo }) => {

    const handlePickImage = async (source) => {
        let result;

        if (source === 'camera') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Camera access is needed to take a photo.');
                return;
            }
            result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 0.3,
            });
        } else {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Media library access is needed to select a photo.');
                return;
            }
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.3,
            });
        }

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            setAvatar(imageUri);
            await AsyncStorage.setItem('profilePicture', imageUri);
            uploadImage(imageUri);
        }
    };

    const removeImage = async () => {
        setAvatar(null);

        await AsyncStorage.removeItem('profilePicture'); // Remove from AsyncStorage

        const Username = GlobalVariables.Login_Username;
        const domainPart = Username.split('@')[1].split('.')[0];
        let empNoforImg = empNo;

        const response = await axios.delete(
            `http://23.105.135.231:8082/api/EncodeImgToNpy/delete`,
            {
                params: {
                    DomainName: domainPart,
                    EmpNo: empNoforImg,
                },
                headers: {
                    'accept': '*/*',
                },
            }
        );

        alert(response.data.message);
    };

    const uploadImage = async (imageUri) => {
        try {

        } catch (error) {
            console.error('Upload Error:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to upload profile picture');
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={GlobalStyles.subtitle_1}>Profile Image Actions</Text>
            <View style={styles.iconOptions}>
                <TouchableOpacity style={styles.option} onPress={() => handlePickImage('camera')}>
                    <Feather name="camera" size={width * 0.07} color="#1c9aa5" />
                    <Text style={[GlobalStyles.subtitle_2, styles.optionText]}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={() => handlePickImage('gallery')}>
                    <MaterialIcons name="insert-photo" size={width * 0.07} color="#1c9aa5" />
                    <Text style={[GlobalStyles.subtitle_2, styles.optionText]}>Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={removeImage}>
                    <MaterialIcons name="delete" size={width * 0.07} color="#1c9aa5" />
                    <Text style={[GlobalStyles.subtitle_2, styles.optionText]}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    iconOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    option: {
        alignItems: 'center',
        padding: 10,
    },
    optionText: {
        marginTop: 5,
        color: '#333',
    },
});

export default ImageEditPopUp;