import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, BackHandler, Alert, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';
import HomeCarousel from '../components/HomeCarousel';
import { GlobalStyles } from '../Styles/styles';
import GlobalVariables from '../../iStServices/GlobalVariables';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';

const HomeScreen = () => {
    const navigation = useNavigation();
    const [showPopup, setShowPopup] = useState(false);

    const handleDPImageCLick = () => {
        setShowPopup(!showPopup);
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.clear(); // Clear all AsyncStorage data
            Alert.alert('Logout Successful', 'You have been logged out.');
            navigation.replace('LoginScreen'); // Navigate back to the login screen
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    };

    const handleTeamCheckin = () => {
        navigation.navigate('TeamCheckin');
    };

    const handleTeamCheckout = () => {
        navigation.navigate('TeamCheckout');
    };

    const handleSelfCheckin = () => {
        navigation.navigate('SelfCheckin');
    };

    const handleSelfCheckout = () => {
        navigation.navigate('SelfCheckout');
    };

    const handleAddEmployee = () => {
        navigation.navigate('NewEmployeeAddScreen');
    };

    const handleChangeEmpImage = () => {
        navigation.navigate('SwitchUpdateImageScreen');
    };
    const actions1 = [
        { icon: 'qrcode-scan', label: 'Team\nCheck-in', onPress: handleTeamCheckin },
        { icon: 'account-group', label: 'Team\nCheck-out', onPress: handleTeamCheckout },
        { icon: 'account-arrow-left', label: 'Self\nCheck-in', onPress: handleSelfCheckin },
        { icon: 'account-arrow-right', label: 'Self\nCheck-out', onPress: handleSelfCheckout },
    ];

    const actions2 = [
        { label: 'Add New Employee', icon: 'user-plus', onPress:handleAddEmployee },
        { label: 'Change Employee Image', icon: 'images', onPress: handleChangeEmpImage },
        { label: 'View Attendance', icon: 'users-viewfinder', onPress: () => { } },
    ];

    const numColumns = 3;
    const itemWidth = Dimensions.get('window').width / numColumns - 30;

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    'Exit App',
                    'Do you want to exit?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Yes', onPress: () => BackHandler.exitApp() },
                    ]
                );
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    return (
        <View style={[GlobalStyles.pageContainer]}>
            <View style={styles.row1Container}>
                <Image
                    source={require('../../assets/logo_edited.png')}
                    style={styles.logo}
                />
                <View style={styles.iconRowContainer}>
                    <View style={styles.iconContainer}>
                        <Fontisto name="bell" size={20} color={'black'} />
                    </View>
                    <View style={styles.iconContainer}>
                        <IonIcons name="settings" size={20} color={'black'} />
                    </View>
                    <TouchableOpacity onPress={handleDPImageCLick}>
                        <Image
                            source={{ uri: `data:image/jpeg;base64,${GlobalVariables.EMP_IMAGE_BASE64}` }}
                            style={styles.iconContainer}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {/* Popup for Account Details and Logout */}
            {showPopup && (
                <View style={styles.popup}>
                    <Text style={styles.popupText}>Account Details</Text>
                    <Button style={styles.btnlogout} title="Logout" onPress={handleLogout} theme={{ colors: { primary: 'white' } }}>Logout</Button>
                </View>
            )}
            <HomeCarousel />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.atteElementsContainer}>
                    <Text style={[GlobalStyles.title1, { marginHorizontal: 16, marginBottom: 10 }]}>Attendance Capturing</Text>
                    <View style={styles.container}>
                        {actions1.map((action, index) => (
                            <TouchableOpacity key={index} style={styles.action} onPress={action.onPress}>
                                <View style={styles.iconWrapper}>
                                    <Icon name={action.icon} size={30} color="#fff" />
                                </View>
                                <Text style={styles.label}>{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.atteElementsContainer1}>
                    <Text style={[styles.title1, { marginHorizontal: 16, marginBottom: 10 }]}>
                        Get Loan, Invest Money
                    </Text>
                    <View style={styles.container1}>
                        {actions2.map((action2, index) => (
                            <TouchableOpacity key={index} style={[styles.action1, { width: itemWidth }]} onPress={action2.onPress}>
                                <View style={styles.iconWrapper1}>
                                    <FontAwesome6Icon name={action2.icon} size={25} color="#fff" />
                                </View>
                                <Text style={styles.label1}>{action2.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    row1Container: {
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between'
    },
    iconRowContainer: {
        width: 140,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    logo: {
        width: 120,
        resizeMode: 'contain',
        height: 60
    },
    iconContainer: {
        height: 40,
        width: 40,
        borderRadius: 25,
        backgroundColor: '#cbcdcc',
        alignItems: 'center',
        justifyContent: 'center'
    },
    atteElementsContainer: {
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginVertical: 10
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    action: {
        alignItems: 'center',
        width: 80,
    },
    iconWrapper: {
        backgroundColor: '#002D72',
        borderRadius: 16,
        padding: 12,
        marginBottom: 6,
    },
    label: {
        textAlign: 'center',
        fontSize: 12,
        color: '#000',
    },
    popup: {
        position: 'absolute',
        top: 85,
        left: '83%',
        transform: [{ translateX: '-50%' }],
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 10,
    },
    popupText: {
        marginBottom: 10,
        fontWeight: 'bold',
    },
    btnlogout: {
        backgroundColor: 'red',
    },

    atteElementsContainer1: {
        paddingVertical: 10,
        backgroundColor: '#f0f8ff',
        borderRadius: 16,
        marginBottom: 50
    },
    title1: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    container1: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    action1: {
        alignItems: 'center',
        margin: 10,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        elevation: 3,
    },
    iconWrapper1: {
        backgroundColor: '#144f76',
        padding: 10,
        borderRadius: 39,
        marginBottom: 8,
    },
    label1: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '600',
    },
});
