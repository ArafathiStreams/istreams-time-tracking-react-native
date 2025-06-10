import React from 'react';
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Image } from 'react-native';
import GlobalVariables from "../../iStServices/GlobalVariables";
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalStyles } from '../Styles/styles';

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <ImageBackground
        source={require('../../assets/profile_bg.jpg')}
        style={[GlobalStyles.pageContainer, { paddingTop: insets.top, paddingHorizontal: 0 }]}
        resizeMode="stretch"
      >
        <View style={styles.safeContainer}>
          <View style={styles.titleContainer}>
            <Text style={[GlobalStyles.title, { color: 'white' }]}>Profile</Text>
          </View>
          <View style={styles.row1Container}>
            <View style={styles.imgContainer}>
              <Image style={styles.userImg} source={{ uri: `data:image/jpeg;base64,${GlobalVariables.EMP_IMAGE_BASE64}` }} />
            </View>
            <View style={styles.userContainer}>
              <Text style={[GlobalStyles.title, { color: 'white' }]}>{GlobalVariables.USER_NAME}</Text>
              <View style={styles.userRow}>
                <Text style={[GlobalStyles.subtitle, { color: 'white' }]}>{GlobalVariables.Login_Username}</Text>
              </View>
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              {/* Account Settings */}
              <Text style={[styles.sectionTitle, GlobalStyles.subtitle_1]}>Account Settings</Text>
              <SettingsItem icon="user" label="Personal Information" />
              <SettingsItem icon="lock" label="Password & Security" />
              <SettingsItem icon="bell" label="Notifications Preferences" />

              {/* Community Settings */}
              <Text style={[styles.sectionTitle, GlobalStyles.subtitle_1]}>Community Settings</Text>
              <SettingsItem icon="users" label="Friends & Social" />
              <SettingsItem icon="list" label="Following List" />

              {/* Other */}
              <Text style={[styles.sectionTitle, GlobalStyles.subtitle_1]}>Other</Text>
              <SettingsItem icon="help-circle" label="FAQ" />
              <SettingsItem icon="info" label="Help Center" />
              <SettingsItem icon="phone" label="Contact Us" />
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </>
  );
};

const SettingsItem = ({ icon, label }) => (
  <TouchableOpacity style={styles.item}>
    <View style={styles.itemContent}>
      <Icon name={icon} size={20} color="#333" />
      <Text style={[styles.itemText, GlobalStyles.body]}>{label}</Text>
    </View>
    <Icon name="chevron-right" size={20} color="#999" />
  </TouchableOpacity>
);
export default ProfileScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  titleContainer: {
    padding: 10,
  },
  userImg: {
    height: 80,
    width: 80,
    borderRadius: 40
  },
  row1Container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    marginBottom: 30
  },
  scrollView: {
    flex: 1
  },
  imgContainer: {
    padding: 10,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20
  },
  userContainer: {
    marginHorizontal: 15,
    justifyContent: "center",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "#f2f1ff",
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 60,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    marginLeft: 12,
  },
});