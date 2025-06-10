import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import LoginScreen from './src/screen/LoginScreen';
import HomeScreen from './src/screen/HomeScreen';
import DataLoadingScreen from './src/screen/DataLoadingScreen';
import EmployeeList from './src/components/EmployeeList';
import TeamCheckin from './src/screen/TeamCheckin';
import TeamCheckinEmployees from './src/screen/TeamCheckinEmployees';
import TeamCheckout from './src/screen/TeamCheckout';
import TeamCheckoutEmployees from './src/screen/TeamCheckoutEmployees';
import SelfCheckin from './src/screen/SelfCheckin';
import SelfCheckout from './src/screen/SelfCheckout';
import NewEmployeeAddScreen from './src/screen/NewEmployeeAddScreen';
import ChangeEmpImageScreen from './src/screen/ChangeEmpImageScreen';
import CaptureImageScreen from './src/components/CaptureImageScreen';
import SwitchUpdateImageScreen from './src/screen/SwitchUpdateImageScreen';
import UpdateNonMatchedEmpScreen from './src/screen/UpdateNonMatchedEmpScreen';
import ProfileScreen from './src/screen/ProfileScreen';
import ViewAttendance from './src/screen/ViewAttendance';
import AddOfcLocation from './src/screen/AddOfcLocation';
import ImageDisplay from './src/screen/ImageDisplay'; 
import ProjectSelfCheckin from './src/screen/ProjectSelfCheckin';
import SuccessAnimationScreen from './src/Animations/SuccessAnimationScreen';
import FailureAnimationScreen from './src/Animations/FailureAnimationScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons, FontAwesome6, AntDesign, Octicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
  </Stack.Navigator>
);

// Placeholder stacks
const OrderStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OrderScreen" component={HomeScreen} />
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
  </Stack.Navigator>
);

// Bottom Tabs
const AppTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#044ab5',
      tabBarInactiveTintColor: '#888',
      tabBarStyle: styles.tabBar,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{
        tabBarIcon: ({ focused, size, color }) => (
          <View style={styles.iconContainer}>
            <AntDesign name="home" size={size} color={color} style={focused && styles.iconShift} />
            {focused && <Text style={styles.savedLabel}>Home</Text>}
          </View>
        ),
        tabBarLabel: () => null, // hide default label
      }}
    />

    <Tab.Screen
      name="Search"
      component={SearchStack}
      options={{
        tabBarIcon: ({ focused, size, color }) => (
          <View style={styles.iconContainer}>
            <Octicons name="search" size={size} color={color} style={focused && styles.iconShift} />
            {focused && <Text style={styles.savedLabel}>Search</Text>}
          </View>
        ),
        tabBarLabel: () => null,
      }}
    />

    <Tab.Screen
      name="Order"
      component={OrderStack}
      options={{
        tabBarIcon: ({ focused, size, color }) => (
          <View style={styles.iconContainer}>
            <Ionicons name="menu" size={size} color={color} style={focused && styles.iconShift} />
            {focused && <Text style={styles.savedLabel}>Order</Text>}
          </View>
        ),
        tabBarLabel: () => null,
      }}
    />

    <Tab.Screen
      name="Profile"
      component={ProfileStack}
      options={{
        tabBarIcon: ({ focused, size, color }) => (
          <View style={styles.iconContainer}>
            <FontAwesome6 name="user" size={size} color={color} style={focused && styles.iconShift} />
            {focused && <Text style={styles.savedLabel}>Profile</Text>}
          </View>
        ),
        tabBarLabel: () => null,
      }}
    />
  </Tab.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fontsLoaded] = useFonts({
    'Inter-SemiBold': require('./assets/fonts/Inter_18pt-SemiBold.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter_18pt-Bold.ttf'),
    'Inter-Regular': require('./assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter_18pt-Medium.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="AppTabs" component={AppTabs} />
      ) : (
        <>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />
            )}
          </Stack.Screen>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="AppTabs" component={AppTabs} />
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
            options={{
              presentation: 'modal',
              headerShown: false,
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="FailureAnimationScreen"
            component={FailureAnimationScreen}
            options={{
              presentation: 'modal',
              headerShown: false,
              animation: 'slide_from_bottom',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => (
  <>
    <StatusBar
      barStyle="light-content"
      backgroundColor="#1e1e1e"
      translucent={false}
    />
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  </>
);

export default App;

const styles = StyleSheet.create({
  savedLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#888',
    textAlign: 'center',
    width: 50,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  tabBar: {
    position: 'absolute',
    height: 50,
    borderRadius: 30,
    paddingTop: 5,
    marginHorizontal: 10,
    marginBottom: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
