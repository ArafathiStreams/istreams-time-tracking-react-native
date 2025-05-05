import { 
    StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Alert, ActivityIndicator 
  } from 'react-native';
  import React, { useState, useEffect } from 'react';
  import * as ImagePicker from 'expo-image-picker';
  import { Ionicons } from '@expo/vector-icons';
  import Modal from 'react-native-modal';
  const { width, height } = Dimensions.get('window');
  import AsyncStorage from '@react-native-async-storage/async-storage';

  
  const CaptureImageScreen = () => {
    const [avatar, setAvatar] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
  
    useEffect(() => {
      loadProfilePicture();
    }, []);
  
    const loadProfilePicture = async () => {
      try {
        const savedAvatar = await AsyncStorage.getItem('profilePicture');
        if (savedAvatar) {
          setAvatar(savedAvatar);
        }
      } catch (error) {
        console.error('Error loading profile picture:', error);
      }
    };
  
    const handlePickImage = async (source) => {
      let result;
  
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Camera access is needed to take a photo.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing : false,
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
          allowsEditing: false,
        });
      }
  
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setAvatar(imageUri);
        await AsyncStorage.setItem('profilePicture', imageUri); 
        uploadImage(imageUri);
      }
      setIsModalVisible(false);
    };
  
  
    const removeImage = async () => {
      setAvatar(null);
      await AsyncStorage.removeItem('profilePicture'); // Remove from AsyncStorage
      setIsModalVisible(false);
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={avatar ? { uri: avatar } : require('../../assets/logo_edited.png')}
            style={styles.avatar}
            testID="profile-avatar"
          />
          {uploading && <ActivityIndicator size="small" color="#000" style={{ marginTop: 10 }} />}
          <TouchableOpacity 
            style={styles.iconContainer} 
            onPress={() => setIsModalVisible(true)} 
            testID="image-picker-button"
          >
            <Ionicons name="camera" size={width * 0.06} color="white" />
          </TouchableOpacity>
        </View>
  
        {/* Image Picker Modal */}
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setIsModalVisible(false)}
          style={styles.modal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle} testID="profile-photo-title">Profile Photo</Text>
            <View style={styles.iconOptions}>
              <TouchableOpacity style={styles.option} onPress={() => handlePickImage('camera')}>
                <Ionicons name="camera" size={width * 0.1} color="black" />
                <Text style={styles.optionText}>Camera</Text>
              </TouchableOpacity>
  
              <TouchableOpacity style={styles.option} onPress={() => handlePickImage('gallery')}>
                <Ionicons name="images" size={width * 0.1} color="black" />
                <Text style={styles.optionText}>Gallery</Text>
              </TouchableOpacity>
  
              <TouchableOpacity style={styles.option} onPress={removeImage}>
                <Ionicons name="trash-bin" size={width * 0.1} color="black" />
                <Text style={styles.optionText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileContainer: {
      position: 'relative', 
    },
    avatar: {
      width: width * 0.25,
      height: width * 0.25,
      borderRadius: (width * 0.25) / 2, 
      borderWidth: 2,
      borderColor: '#ddd',
    },
    iconContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: '#007AFF',
      borderRadius: width * 0.1,
      padding: width * 0.02,
    },
    modal: {
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: width * 0.05,
      borderRadius: 20,
      width: width * 0.8,
    },
    modalTitle: {
      fontSize: width * 0.05,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: height * 0.02,
    },
    iconOptions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    option: {
      alignItems: 'center',
    },
    optionText: {
      fontSize: width * 0.04,
      marginTop: 5,
    },
  });
  
  export default CaptureImageScreen;