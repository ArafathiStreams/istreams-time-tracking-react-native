import React from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Image,
    StyleSheet,
} from 'react-native';

const EmployeeListCard = ({ loading, selectedEmp }) => {
    return (
        <View style={styles.employeeListContainer}>
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="small" color="#0000ff" />
                </View>
            ) : (
                <FlatList
                    data={selectedEmp}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.EMP_NO.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.container}>
                            <Image
                                source={
                                    item.EMP_IMAGE
                                        ? {
                                            uri: item.EMP_IMAGE.startsWith('data:image')
                                                ? item.EMP_IMAGE 
                                                : `data:image/png;base64,${item.EMP_IMAGE}`
                                        }
                                        : require('../../assets/human.png')
                                }
                                style={styles.empImage}
                            />

                            <View style={styles.innerContainer}>
                                <Text style={styles.txtEmpNo}>{item.EMP_NO}</Text>
                                <Text style={styles.txtEmpName}>{item.EMP_NAME}</Text>
                                <Text style={styles.txtDesignation}>{item.DESIGNATION}</Text>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default EmployeeListCard;

const styles = StyleSheet.create({
    employeeListContainer: {
        flex: 1,
    },
    empImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 10,
    },
    container: {
        flexDirection: 'row',
        backgroundColor: '#dddddb',
        justifyContent: 'space-between',
        borderRadius: 15,
        padding: 10,
        marginBottom: 10
    },
    innerContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
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
})
