import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Ionicons, FontAwesome6, Octicons } from '@expo/vector-icons';

import HomeScreen from '../screen/HomeScreen';
import ProfileScreen from '../screen/ProfileScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Individual stacks
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SearchScreen" component={HomeScreen} />
  </Stack.Navigator>
);

const OrderStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OrderScreen" component={HomeScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
  </Stack.Navigator>
);

const BottomNavigation = () => (
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
        tabBarLabel: () => null,
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

export default BottomNavigation;
