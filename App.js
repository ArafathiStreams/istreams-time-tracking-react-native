import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
import CaptureImageScreen from './src/components/CaptureImageScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons, Entypo, Ionicons, FontAwesome6 } from '@expo/vector-icons';

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

const CartStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CartScreen" component={HomeScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileScreen" component={HomeScreen} />
  </Stack.Navigator>
);

// Bottom Tabs
const AppTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: 'blue',
      tabBarStyle: styles.tabBar,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{
        tabBarIcon: ({ size, color }) => (
          <Entypo name="home" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Order"
      component={OrderStack}
      options={{
        tabBarIcon: ({ size, color }) => (
          <Ionicons name="menu" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Cart"
      component={CartStack}
      options={{
        tabBarIcon: ({ size, color }) => (
          <View style={styles.cartIconContainer}>
            <MaterialCommunityIcons name="cart" size={size} color={color} />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStack}
      options={{
        tabBarIcon: ({ size, color }) => (
          <FontAwesome6 name="user" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="Tabs" component={AppTabs} />
      ) : (
        <>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />
            )}
          </Stack.Screen>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="Tabs" component={AppTabs} />
          <Stack.Screen name="DataLoading" component={DataLoadingScreen} />
          <Stack.Screen name="EmployeeList" component={EmployeeList} />
          <Stack.Screen name="TeamCheckin" component={TeamCheckin} />
          <Stack.Screen name="CaptureImageScreen" component={CaptureImageScreen} />
          <Stack.Screen name="TeamCheckinEmployees" component={TeamCheckinEmployees} />
          <Stack.Screen name="TeamCheckout" component={TeamCheckout} />
          <Stack.Screen name="TeamCheckoutEmployees" component={TeamCheckoutEmployees} />
          <Stack.Screen name="SelfCheckin" component={SelfCheckin} />
          <Stack.Screen name="SelfCheckout" component={SelfCheckout} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => (
  <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    height: 50,
    paddingTop: 5,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
