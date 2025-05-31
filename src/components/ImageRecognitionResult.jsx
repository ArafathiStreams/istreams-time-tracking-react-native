import React from 'react';
import {
    View,
    Text,
    SectionList,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import EmployeeListCard from './EmployeeListCard';
import { useNavigation } from '@react-navigation/native';

const ImageRecognitionResult = ({ recogloading, groupedData }) => {
    const navigation = useNavigation();

    const handleAddEmployee = () => {
            navigation.navigate('UpdateNonMatchedEmpScreen');
    };

    return (
        <View style={styles.employeeListContainer}>
            {recogloading ? (
                <View style={styles.loaderContainer}>
                    <Text>Analysing your Image. Please Wait...</Text>
                    <ActivityIndicator size="small" color="#0000ff" />
                </View>
            ) : (
                <SectionList
                    sections={groupedData}
                    keyExtractor={(item, index) => item.EMP_NO + index}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            backgroundColor: '#eee',
                            padding: 10,
                            color: '#333',
                            marginBottom: 5,
                        }}>
                            {title}
                        </Text>
                    )}
                    renderItem={({ item, section }) => (
                        <EmployeeListCard
                            loading={false}
                            selectedEmp={[item]}
                            onPress={section.title === 'Non-Matched Faces' ? () => handleAddEmployee() : null}
                        />
                    )}
                />
            )}
        </View>
    );
};

export default ImageRecognitionResult;

const styles = StyleSheet.create({
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 10,
    },
    popupHeader: {
        alignItems: 'center',
    },
});