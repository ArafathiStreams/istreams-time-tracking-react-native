import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { TextInput, Checkbox } from "react-native-paper";
import { useEffect, useState } from "react";
import Logo from "../components/Logo";
import { loginBLL } from "../../iStClasses/LoginBLL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from '@react-navigation/native';

const LoginScreen = ({ navigation, setIsLoggedIn }) => {
    const [loading, setLoading] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        loadCredentials();
    }, []);

    const loadCredentials = async () => {
        try {
            const storedUsername = await AsyncStorage.getItem('username');
            const storedPassword = await AsyncStorage.getItem('password');
            if (storedUsername && storedPassword) {
                setUsernameInput(storedUsername);
                setPasswordInput(storedPassword);
                setRememberMe(true);
            }
        } catch (error) {
            console.error('Error loading credentials:', error);
        }
    };

    const handleSoapCall = async () => {
        try {
            setLoading(true);

            const username = usernameInput;
            const password = passwordInput;

            if (!username || !password) {
                alert('Enter Username and Password');
                return;
            }
            try {
                const response = await loginBLL(username, password, navigation);

                if (response === "Authetication passed") {
                    if (rememberMe) {
                        await AsyncStorage.setItem('username', username);
                        await AsyncStorage.setItem('password', password);
                    }
                    else {
                        await AsyncStorage.removeItem('username');
                        await AsyncStorage.removeItem('password');
                    }
                    setLoading(false);

                    const isFirstLogin = await AsyncStorage.getItem('isFirstLogin');
                    if (!isFirstLogin) {
                        await AsyncStorage.setItem('isFirstLogin', 'true');
                        navigation.navigate("DataLoading");
                    } else {
                        navigation.dispatch(
                            CommonActions.reset({
                              index: 0,
                              routes: [{ name: 'AppTabs' }],
                            })
                          );
                    }
                }
                else {
                    alert(response);
                }
            }
            catch (error) {
                console.error('SOAP Call Failed:', error);
            }
        }
        catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    {/* Logo */}
                    <View style={{ marginVertical: 70 }}>
                        <Logo />
                    </View>

                    {/* Form Container */}
                    <View style={styles.formContainer}>
                        {/* Login Title */}
                        <Text style={styles.title}>Login</Text>

                        <TextInput
                            mode="outlined"
                            label="Username"
                            value={usernameInput}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={setUsernameInput}
                            placeholder="Enter username"
                            style={styles.input}
                        />

                        <TextInput
                            mode="outlined"
                            label="Password"
                            value={passwordInput}
                            onChangeText={setPasswordInput}
                            autoCapitalize="none"
                            placeholder="Enter your password"
                            style={styles.input}
                            secureTextEntry={!passwordVisible}
                            right={
                                <TextInput.Icon
                                    icon={passwordVisible ? "eye-off" : "eye"}
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                />
                            }
                        />

                        {/* Remember Me Checkbox */}
                        <View style={styles.checkboxContainer}>
                            <View style={styles.checkBoxSection}>
                                <Checkbox
                                    status={rememberMe ? "checked" : "unchecked"}
                                    onPress={() => setRememberMe(!rememberMe)}
                                />
                                <Text style={styles.checkboxLabel}>Remember me</Text>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword1")}>
                                <Text style={styles.forgotPass}>Forgot Password</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} disabled={loading} onPress={handleSoapCall}>
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Login</Text>
                            )}
                        </TouchableOpacity>

                        {/* Sign Up Text */}
                        <View style={styles.signUpTextContainer}>
                            <Text style={styles.signUpText}>
                                Don't have an account?
                            </Text>
                            <TouchableOpacity onPress={
                                () => navigation.navigate("SignUpScreen")}>
                                <Text style={styles.signUpLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#b4acdc",
    },
    formContainer: {
        flex: 1,
        backgroundColor: "#f2f1ff",
        paddingHorizontal: 20,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginVertical: 30,
        textAlign: "center",
        fontFamily: "WinkySans Regular",
    },
    input: {
        width: "100%",
        height: 60,
        marginBottom: 20,
        backgroundColor: '#f2f1ff'
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        justifyContent: "space-between"
    },
    checkboxLabel: {
        fontSize: 16,
    },
    checkBoxSection: {
        flexDirection: "row",
        alignItems: "center"
    },
    button: {
        backgroundColor: "#5046fb",
        padding: 15,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    signUpTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    signUpText: {
        marginVertical: 10,
        fontSize: 15,
        color: "gray",
    },
    signUpLink: {
        color: "#362ce2",
        fontWeight: "bold",
        marginHorizontal: 10,
        fontSize: 15,
    },
    forgotPass: {
        color: "#362ce2",
        fontWeight: "bold",
    },
    buttonDisabled: {
        opacity: 0.7
    },
});