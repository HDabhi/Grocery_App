// src/components/CustomDrawerContent.tsx
import React from 'react';
import {View, Text, Button, StyleSheet, Image, Alert} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {useAuth, useLogout} from '../stores/auth';
import {horizontalScale, moderateScale, verticalScale} from '../utils/Metrics';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../utils/colors';
import FONTS from './fonts';

const CustomDrawerContent = (props: any) => {
  const {mutate: logout} = useLogout(); // Assuming you have a logout method in your auth store

  const showLogoutAlert = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout Cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: logout,
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image
          style={styles.imageStyle}
          source={require('../../assets/images/FarmSanta.png')}
        />
        {/* <Text style={styles.drawerTitle}>My Custom Drawer</Text> */}
      </View>
      {/* Add more DrawerItems for navigation */}
      <DrawerItem
        icon={() => <Icon name="logout" size={moderateScale(20)} />}
        label="Logout"
        labelStyle={styles.drawerItemLabel}
        onPress={() => {
          showLogoutAlert();
        }}
      />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageStyle: {
    width: horizontalScale(200),
    height: verticalScale(50),
    resizeMode: 'cover',
  },
  drawerItemLabel: {
    fontSize: moderateScale(15), // Customize label font size
    color: colors.BLACK, // Customize label color
    fontFamily: FONTS.BOLD,
  },
});

export default CustomDrawerContent;
