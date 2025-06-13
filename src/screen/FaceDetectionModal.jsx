import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { IconButton } from 'react-native-paper';
import { clearImagePickerCache } from '../Utils/captureImageUtils';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

export default function FaceDetectionModal({ visible, onClose, onCaptureComplete }) {
    const [cameraType, setCameraType] = useState('front');
    const [isProcessing, setIsProcessing] = useState(false);
    const [detectionError, setDetectionError] = useState(null);
    const [hasCaptured, setHasCaptured] = useState(false);
    const cameraRef = useRef(null);

    useEffect(() => {
        if (visible && !hasCaptured) {
            setTimeout(() => handleCameraReady(), 1000);
        }
    }, [visible]);

    const handleCameraReady = () => {
        captureImage();
    };

    const captureImage = async () => {
        if (hasCaptured || !cameraRef.current) return;
        setHasCaptured(true);
        setIsProcessing(true);
        setDetectionError(null);

        try {
            await clearImagePickerCache();

            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Camera access is needed to take a photo.');
                return;
            }
            
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.1 });

            const fileInfo = await FileSystem.getInfoAsync(photo.uri);
            console.log('Image size in bytes:', fileInfo.size);

            const result = await FaceDetector.detectFacesAsync(photo.uri, {
                mode: FaceDetector.FaceDetectorMode.fast,
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                runClassifications: FaceDetector.FaceDetectorClassifications.none,
            });

            if (result?.faces?.length > 0) {
                const face = result.faces[0];

                const resizedPhoto = await ImageManipulator.manipulateAsync(
                    photo.uri,
                    [{ resize: { width: 300 } }], // Resize to width of 800px; height is auto-calculated to maintain aspect ratio
                    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
                );

                console.log('Resized image URI:', resizedPhoto.uri);
                console.log('New dimensions:', resizedPhoto.width, 'x', resizedPhoto.height);

                const fileInfo = await FileSystem.getInfoAsync(resizedPhoto.uri);
                console.log('Resized image size in bytes:', fileInfo.size);

                onCaptureComplete({
                    capturedImage: resizedPhoto.uri
                });
                onClose();
            } else {
                setDetectionError('No face detected.');
            }
        } catch (err) {
            setDetectionError('Error detecting face.');
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRetry = () => {
        setDetectionError(null);
        setIsProcessing(false);
        setHasCaptured(false);
        captureImage();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.container}>
                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing={cameraType}
                    onCameraReady={handleCameraReady}
                >
                    <View style={styles.faceFrame}>
                        <View style={styles.frameOverlay}>
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />
                        </View>
                    </View>
                    <View style={styles.closeFrame}>
                        <IconButton icon="close" iconColor="red" size={35} title="Cancel" onPress={onClose} />
                    </View>

                    <View style={styles.overlay}>
                        {isProcessing ? (
                            <Text style={styles.status}>Processing...</Text>
                        ) : detectionError ? (
                            <Text style={styles.error}>{detectionError}</Text>
                        ) : (
                            <Text style={styles.status}>Ready</Text>
                        )}
                        <IconButton icon="refresh" iconColor="white" size={35} onPress={handleRetry} />
                    </View>
                </CameraView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, marginTop: 30 },
    camera: { flex: 1 },
    faceFrame: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',
    },
    frameOverlay: {
        width: 320, height: 350, position: 'relative',
    },
    corner: {
        position: 'absolute', width: 30, height: 30, borderColor: '#00ff00', borderWidth: 6,
    },
    topLeft: {
        top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 8,
    },
    topRight: {
        top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 8,
    },
    bottomLeft: {
        bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 8,
    },
    bottomRight: {
        bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 8,
    },
    overlay: {
        position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center'
    },
    closeFrame: {
        position: 'absolute', top: 10, right: 10, zIndex: 1, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 30,
    },
    status: { color: 'white', fontSize: 18, marginBottom: 10 },
    error: { color: 'red', fontSize: 18, marginBottom: 10 },
});