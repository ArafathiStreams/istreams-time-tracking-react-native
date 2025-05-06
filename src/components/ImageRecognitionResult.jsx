import React from 'react';
import {
    View,
    Text,
    SectionList,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import EmployeeListCard from './EmployeeListCard';

const ImageRecognitionResult = ({ recogloading, groupedData }) => {
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
                    renderItem={({ item }) => (
                        <EmployeeListCard
                            loading={false}
                            selectedEmp={[item]} // You already have a FlatList inside
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
    }
})
