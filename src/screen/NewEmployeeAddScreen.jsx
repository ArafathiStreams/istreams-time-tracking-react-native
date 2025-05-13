import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
  Dimensions, KeyboardAvoidingView, ScrollView, Platform,
} from 'react-native';
import { TextInput, Button, Switch } from 'react-native-paper';
import ImageEditPopUp from '../../Popup/ImageEditPopUp';
import Header from '../components/Header';
import { GlobalStyles } from '../Styles/styles';
import { Ionicons } from '@expo/vector-icons';
const { width, height } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { handleEmpImageUpload } from '../Utils/EmpImageCRUDUtils';
import EmployeeAddComponent from '../components/EmployeeAddComponent';

const NewEmployeeAddScreen = () => {
  const navigation = useNavigation();
  const [btnloading, setbtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [empNo, setEmpNo] = useState();
  const [empName, setEmpName] = useState();
  const [designation, setDesignation] = useState();

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);

    
  }, []);

  return (
    <View style={styles.innerContainer}>
      <Header title="Add New Employee" />

      <EmployeeAddComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    marginTop: 30,
    justifyContent: 'space-between',
  }
})


export default NewEmployeeAddScreen;