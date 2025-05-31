import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');

export const GlobalStyles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        paddingTop: 15,
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
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 20,
    },
    title1: {
        fontSize: 19,
        fontFamily: 'Inter-Bold',
    },
    subtitle: {
        fontSize: 15,
        fontFamily: 'Inter-Bold',
    },
    subtitle_1: {
        fontSize: 17,
        fontFamily: 'Inter-Bold',
    },
    subtitle_2: {
        fontSize: 15,
        fontFamily: 'Inter-Bold',
    },
    subtitle_3: {
        fontSize: 13,
        fontFamily: 'Inter-Bold',
    },
    subtitle_4: {
        fontSize: 12,
        fontFamily: 'Inter-Bold',
    },
    body:{
        fontSize: 16,
        fontFamily: 'Inter-Regular',
    },
    content: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
    },
    txtEmpNo: {
        fontSize: 14,
        fontFamily: 'Inter-Bold',
    },
    txtEmpName: {
        fontSize: 15,
        fontFamily: 'Inter-Bold',
    },
    txtDesignation: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
    },
    bottomButtonContainer: {
        marginVertical: 10,
    },
    shimmerInput: {
        height: height * 0.07,
        width: '100%',
        borderRadius: 8,
        marginBottom: 20,
    },
    shimmerText: {
        height: 20,
        width: '40%',
        borderRadius: 5,
    },
    shimmerButton: {
        height: 40,
        width: '100%',
        borderRadius: 8,
    },
});