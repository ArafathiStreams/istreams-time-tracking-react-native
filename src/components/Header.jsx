import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import GlobalVariables from '../../iStServices/GlobalVariables';

const Header = ({ title = "Header", style }) => {
    const navigation = useNavigation();

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.touchableArea}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="arrow-back" color={"black"} size={24} />
            </TouchableOpacity>

            <Text style={styles.title}>{title}</Text>

            <Image
                source={{ uri: `data:image/jpeg;base64,${GlobalVariables.EMP_IMAGE_BASE64}` }}
                style={styles.dp}
            />
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
    },
    touchableArea: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appIcon: {
        height: 28,
        width: 28,
        tintColor: "black"
    },
    dp: {
        height: 44,
        width: 44,
        borderRadius: 22,
    },
    title: {
        fontSize: 20,
        color: "black",
        fontWeight: "bold",
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center"
    }
});
