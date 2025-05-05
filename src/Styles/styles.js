import { StyleSheet, Dimensions} from "react-native";
const { width, height } = Dimensions.get('window');

export const GlobalStyles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        paddingTop: 25,
        paddingHorizontal: 10,
    },
    locationContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    twoInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    container1: {
        flex: 1,
        marginRight: 10,
    },
    container2: {
        flex: 1,
    },
    camButtonContainer: {
        marginTop: 10,
        alignItems: 'flex-end',
    },
    imageContainer: {
        flex: 1,
    },    
    fullImage: {
        marginTop: 10,
        width: width * 0.95,
        height: width * 0.75,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    title1:{
        fontSize: 19,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 15,
        fontWeight: "bold",
    },
    subtitle_1: {
        fontSize: 17,
        fontWeight: "bold",
    },
    txtEmpNo: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    txtEmpName: {
        fontSize: 15,
        fontWeight: "600"
    },
    txtDesignation: {
        fontSize: 14,
    },
    bottomButtonContainer:{
        marginVertical: 10,
    },
});