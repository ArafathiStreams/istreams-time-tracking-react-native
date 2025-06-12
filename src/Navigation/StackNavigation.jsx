import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

import BottomNavigation from './BottomNavigation';

import LoginScreen from '../screen/LoginScreen';
import HomeScreen from '../screen/HomeScreen';
import DataLoadingScreen from '../screen/DataLoadingScreen';
import EmployeeList from '../components/EmployeeList';
import TeamCheckin from '../screen/TeamCheckin';
import TeamCheckinEmployees from '../screen/TeamCheckinEmployees';
import TeamCheckout from '../screen/TeamCheckout';
import TeamCheckoutEmployees from '../screen/TeamCheckoutEmployees';
import SelfCheckin from '../screen/SelfCheckin';
import SelfCheckout from '../screen/SelfCheckout';
import NewEmployeeAddScreen from '../screen/NewEmployeeAddScreen';
import ChangeEmpImageScreen from '../screen/ChangeEmpImageScreen';
import CaptureImageScreen from '../components/CaptureImageScreen';
import SwitchUpdateImageScreen from '../screen/SwitchUpdateImageScreen';
import UpdateNonMatchedEmpScreen from '../screen/UpdateNonMatchedEmpScreen';
import ImageDisplay from '../screen/ImageDisplay';
import ViewAttendance from '../screen/ViewAttendance';
import AddOfcLocation from '../screen/AddOfcLocation';
import ProjectSelfCheckin from '../screen/ProjectSelfCheckin';
import SuccessAnimationScreen from '../Animations/SuccessAnimationScreen';
import FailureAnimationScreen from '../Animations/FailureAnimationScreen';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    'Inter-SemiBold': require('../../assets/fonts/Inter_18pt-SemiBold.ttf'),
    'Inter-Bold': require('../../assets/fonts/Inter_18pt-Bold.ttf'),
    'Inter-Regular': require('../../assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter-Medium': require('../../assets/fonts/Inter_18pt-Medium.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
      ) : (
        <>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
          <Stack.Screen name="DataLoading" component={DataLoadingScreen} />
          <Stack.Screen name="EmployeeList" component={EmployeeList} />
          <Stack.Screen name="TeamCheckin" component={TeamCheckin} />
          <Stack.Screen name="CaptureImageScreen" component={CaptureImageScreen} />
          <Stack.Screen name="TeamCheckinEmployees" component={TeamCheckinEmployees} />
          <Stack.Screen name="TeamCheckout" component={TeamCheckout} />
          <Stack.Screen name="TeamCheckoutEmployees" component={TeamCheckoutEmployees} />
          <Stack.Screen name="SelfCheckin" component={SelfCheckin} />
          <Stack.Screen name="SelfCheckout" component={SelfCheckout} />
          <Stack.Screen name="NewEmployeeAddScreen" component={NewEmployeeAddScreen} />
          <Stack.Screen name="ChangeEmpImageScreen" component={ChangeEmpImageScreen} />
          <Stack.Screen name="SwitchUpdateImageScreen" component={SwitchUpdateImageScreen} />
          <Stack.Screen name="UpdateNonMatchedEmpScreen" component={UpdateNonMatchedEmpScreen} />
          <Stack.Screen name="ImageDisplay" component={ImageDisplay} />
          <Stack.Screen name="ViewAttendance" component={ViewAttendance} />
          <Stack.Screen name="ProjectSelfCheckin" component={ProjectSelfCheckin} />
          <Stack.Screen name="AddOfcLocation" component={AddOfcLocation} />
          <Stack.Screen
            name="SuccessAnimationScreen"
            component={SuccessAnimationScreen}
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="FailureAnimationScreen"
            component={FailureAnimationScreen}
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigation;
