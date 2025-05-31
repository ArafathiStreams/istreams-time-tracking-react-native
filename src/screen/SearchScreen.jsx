// SearchScreen.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeContent from '../components/HomeContent';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        {/* 🔍 Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Employee Actions..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* 🧩 Reusable HomeContent with search filtering */}
        <HomeContent
          searchQuery={searchQuery}
          onTeamCheckin={() => navigation.navigate('TeamCheckin')}
          onTeamCheckout={() => navigation.navigate('TeamCheckout')}
          onSelfCheckin={() => navigation.navigate('SelfCheckin')}
          onSelfCheckout={() => navigation.navigate('SelfCheckout')}
          onAddEmployee={() => navigation.navigate('NewEmployeeAddScreen')}
          onUpdateEmpImage={() => navigation.navigate('SwitchUpdateImageScreen')}
        />
      </View>
    </SafeAreaProvider>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f1f1f1',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
