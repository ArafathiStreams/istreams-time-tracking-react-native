import React from 'react';
import { View, Text, Image, StyleSheet, Button, ScrollView, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ImageDisplay({ route, navigation }) {
    const { imageUri, faceData } = route.params;

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString();
    };

    const goBack = () => {
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Face Captured Successfully!</Text>
                    <Text style={styles.subtitle}>
                        Captured on {formatDate(faceData.capturedAt)}
                    </Text>
                </View>

                {/* Image Display */}
                <View style={styles.imageContainer}>
                    <Image 
                        source={{ uri: imageUri }} 
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                {/* Face Data Information */}
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>Detection Details</Text>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Faces Detected:</Text>
                        <Text style={styles.infoValue}>{faceData.facesCount}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Face Width:</Text>
                        <Text style={styles.infoValue}>{Math.round(faceData.bounds.size.width)}px</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Face Height:</Text>
                        <Text style={styles.infoValue}>{Math.round(faceData.bounds.size.height)}px</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Roll Angle:</Text>
                        <Text style={styles.infoValue}>{faceData.rollAngle?.toFixed(2)}°</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Yaw Angle:</Text>
                        <Text style={styles.infoValue}>{faceData.yawAngle?.toFixed(2)}°</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Position X:</Text>
                        <Text style={styles.infoValue}>{Math.round(faceData.bounds.origin.x)}px</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Position Y:</Text>
                        <Text style={styles.infoValue}>{Math.round(faceData.bounds.origin.y)}px</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonWrapper}>
                        <Button 
                            title="Back to Camera"
                            onPress={goBack}
                            color="#2196F3"
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

// Styles for ImageDisplay component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    imageContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: width - 60,
        height: (width - 60) * 1.33, // 4:3 aspect ratio
        borderRadius: 8,
    },
    infoContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    infoLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    buttonWrapper: {
        flex: 1,
        marginHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});