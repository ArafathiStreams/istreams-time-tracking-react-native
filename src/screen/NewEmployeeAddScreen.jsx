import React from 'react';
import {
  View, StyleSheet
} from 'react-native';
import Header from '../components/Header';
import EmployeeAddComponent from '../components/EmployeeAddComponent';

const NewEmployeeAddScreen = () => {
  return (
    <View style={styles.innerContainer}>
      <Header title="Add New Employee" />

      <EmployeeAddComponent/>
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    paddingTop: 20,
  }
})


export default NewEmployeeAddScreen;