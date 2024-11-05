import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FONTS from '../../component/fonts';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import BagIcon from 'react-native-vector-icons/Feather';
import LocationIcon from 'react-native-vector-icons/Octicons';
import {useAuth, useLogout} from '../../stores/auth';
import CustomHeader from '../../component/CustomHeader';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useGetUser} from '../../services/createUser/hooks';
import {useCallback, useEffect, useState} from 'react';
import colors from '../../utils/colors';
import CustomText from '../../component/customText';
import DeviceInfo from 'react-native-device-info';

export const SettingScreen: React.FC = () => {
  const navigation = useNavigation();
  const {mutate: logout} = useLogout();
  const {userId} = useAuth.getState();

  const {data: userData, error, isLoading, refetch} = useGetUser();
  const [userInformation, setUserInformation] = useState('');

  console.log('userId : ' + userId);

  useEffect(() => {
    if (userData) {
      if (userData.status && userData.statusCode === 200) {
        setUserInformation(userData.data);
      } else {
        setUserInformation('');
      }
    }
  }, [userData]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

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
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: horizontalScale(20),
          paddingVertical: verticalScale(20),
          alignItems: 'center',
        }}>
        <Image
          style={style.avtarImageStyle}
          source={require('../../../assets/images/user.jpeg')}
        />
        <View style={{marginStart: horizontalScale(10)}}>
          <CustomText textStyle={style.userNameStyle}>
            {userInformation?.name}
          </CustomText>
          <CustomText textStyle={style.userEmailStyle}>
            {userInformation?.email}
          </CustomText>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProfileUpdate', {profileData: userInformation})
          }
          style={{
            width: horizontalScale(30),
            height: verticalScale(30),
            alignItems: 'center',
            justifyContent: 'center',
            marginStart: horizontalScale(6),
            marginTop: verticalScale(6),
          }}>
          <Icon name="edit" size={horizontalScale(26)} color={colors.GREEN} />
        </TouchableOpacity>
      </View>

      <View style={style.lineStyle} />

      <TouchableOpacity
        onPress={() => navigation.navigate('OrderListing')}
        style={style.viewStyle}>
        <BagIcon
          name="shopping-bag"
          size={verticalScale(20)}
          color={colors.BLACK}
        />
        <CustomText
          viewStyle={{flex: 1}}
          textStyle={{
            fontFamily: FONTS.SEMI_BOLD,
            fontSize: moderateScale(14),
            color: colors.BLACK,
            marginStart: horizontalScale(10),
          }}>
          {'My Orders'}
        </CustomText>
        <BagIcon
          name="chevron-right"
          size={verticalScale(25)}
          color={colors.BLACK}
        />
      </TouchableOpacity>

      <View style={style.lineStyle} />

      <TouchableOpacity
        onPress={() => navigation.navigate('AddressList')}
        style={style.viewStyle}>
        <LocationIcon
          name="location"
          size={verticalScale(20)}
          color={colors.BLACK}
        />
        <CustomText
          viewStyle={{flex: 1}}
          textStyle={{
            fontFamily: FONTS.SEMI_BOLD,
            fontSize: moderateScale(14),
            color: colors.BLACK,
            marginStart: horizontalScale(10),
          }}>
          {'Delivery Address'}
        </CustomText>
        <BagIcon
          name="chevron-right"
          size={verticalScale(25)}
          color={colors.BLACK}
        />
      </TouchableOpacity>

      <View style={style.lineStyle} />

      <TouchableOpacity
        onPress={() => navigation.navigate('AboutUs')}
        style={style.viewStyle}>
        <Icon
          name="info-outline"
          size={verticalScale(20)}
          color={colors.BLACK}
        />
        <CustomText
          viewStyle={{flex: 1}}
          textStyle={{
            fontFamily: FONTS.SEMI_BOLD,
            fontSize: moderateScale(14),
            color: colors.BLACK,
            marginStart: horizontalScale(10),
          }}>
          {'About Us'}
        </CustomText>
        <BagIcon
          name="chevron-right"
          size={verticalScale(25)}
          color={colors.BLACK}
        />
      </TouchableOpacity>

      <View style={style.lineStyle} />

      <TouchableOpacity
        onPress={() => navigation.navigate('TermCondition')}
        style={style.viewStyle}>
        <Image
          style={{
            width: horizontalScale(17),
            height: verticalScale(17),
            resizeMode: 'contain',
          }}
          source={require('../../../assets/images/termsConditions.png')}
        />
        <CustomText
          viewStyle={{flex: 1}}
          textStyle={{
            fontFamily: FONTS.SEMI_BOLD,
            fontSize: moderateScale(14),
            color: colors.BLACK,
            marginStart: horizontalScale(10),
          }}>
          {'Terms & Conditions'}
        </CustomText>
        <BagIcon
          name="chevron-right"
          size={verticalScale(25)}
          color={colors.BLACK}
        />
      </TouchableOpacity>

      <View style={style.lineStyle} />

      <TouchableOpacity
        onPress={() => navigation.navigate('PrivacyPolicy')}
        style={style.viewStyle}>
        <Icon
          name="privacy-tip"
          size={verticalScale(20)}
          color={colors.BLACK}
        />
        <CustomText
          viewStyle={{flex: 1}}
          textStyle={{
            fontFamily: FONTS.SEMI_BOLD,
            fontSize: moderateScale(14),
            color: colors.BLACK,
            marginStart: horizontalScale(10),
          }}>
          {'Privacy Policy'}
        </CustomText>
        <BagIcon
          name="chevron-right"
          size={verticalScale(25)}
          color={colors.BLACK}
        />
      </TouchableOpacity>

      <View style={style.lineStyle} />

      <TouchableOpacity
        onPress={() => navigation.navigate('RefundReturn')}
        style={style.viewStyle}>
        <IconCommunity
          name="cash-refund"
          size={verticalScale(20)}
          color={colors.BLACK}
        />
        <CustomText
          viewStyle={{flex: 1}}
          textStyle={{
            fontFamily: FONTS.SEMI_BOLD,
            fontSize: moderateScale(14),
            color: colors.BLACK,
            marginStart: horizontalScale(10),
          }}>
          {'Refund & Cancellation Policy'}
        </CustomText>
        <BagIcon
          name="chevron-right"
          size={verticalScale(25)}
          color={colors.BLACK}
        />
      </TouchableOpacity>

      <View style={style.lineStyle} />

      <TouchableOpacity
        onPress={() => navigation.navigate('ShippingDelivery')}
        style={style.viewStyle}>
        <Icon
          name="local-shipping"
          size={verticalScale(20)}
          color={colors.BLACK}
        />
        <CustomText
          viewStyle={{flex: 1}}
          textStyle={{
            fontFamily: FONTS.SEMI_BOLD,
            fontSize: moderateScale(14),
            color: colors.BLACK,
            marginStart: horizontalScale(10),
          }}>
          {'Shipping & Delivery Policy'}
        </CustomText>
        <BagIcon
          name="chevron-right"
          size={verticalScale(25)}
          color={colors.BLACK}
        />
      </TouchableOpacity>

      <View style={style.lineStyle} />

      {/* Logout View */}
      <View>
      
        <TouchableOpacity
          onPress={() => showLogoutAlert()}
          style={style.logoutViewStyle}>
          <Icon
            style={{position: 'absolute', left: horizontalScale(15)}}
            color={colors.GREEN}
            name="logout"
            size={moderateScale(19)}
          />
          <CustomText textStyle={style.logoutTextStyle}>{'Log Out'}</CustomText>
        </TouchableOpacity>

        <Text style={style.versionStyle}>{"Version : " + DeviceInfo.getVersion()}</Text>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  lineStyle: {
    height: verticalScale(1),
    backgroundColor: colors.BORDER_LINE,
  },
  viewStyle: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutViewStyle: {
    height: verticalScale(50),
    backgroundColor: colors.BORDER,
    borderRadius: moderateScale(12),
    marginHorizontal: horizontalScale(20),
    marginVertical: verticalScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(15),
  },
  logoutTextStyle: {
    textAlign: 'center',
    fontSize: moderateScale(14),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.GREEN,
  },
  avtarImageStyle: {
    width: horizontalScale(60),
    height: verticalScale(60),
    resizeMode: 'contain',
    borderRadius: moderateScale(20),
  },
  userNameStyle: {
    fontSize: moderateScale(14),
    color: colors.BLACK,
    fontFamily: FONTS.SEMI_BOLD,
  },
  userEmailStyle: {
    fontSize: moderateScale(12),
    color: colors.GRAY,
    fontFamily: FONTS.MEDIUM,
  },
  versionStyle:{
    fontSize: moderateScale(15),
    color: colors.GREEN,
    fontFamily: FONTS.MEDIUM,
    textAlign:'center'
  }
});
