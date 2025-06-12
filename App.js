import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigation from './src/Navigation/StackNavigation';

const App = () => (
  <>
    <StatusBar barStyle="light-content" backgroundColor="#1e1e1e" />
    <SafeAreaProvider>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </SafeAreaProvider>
  </>
);

export default App;