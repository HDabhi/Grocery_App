import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../component/customButton';
import CustomText from '../../component/customText';
import CustomTextInput from '../../component/customTextInput';
import {useEffect, useState} from 'react';
import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import colors from '../../utils/colors';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';
import OTPModal from '../../component/OTPModal';
import {
  useGenerateOTP,
  useAuthenticateByOTP,
} from '../../services/generateOTP/hooks';
import {useAuth} from '../../stores/auth';
import Spinner from '../../component/spinner';
import FONTS from '../../component/fonts';
import OTPTextView from 'react-native-otp-textinput';
import {useUpdateFCMToken} from '../../services/createUser/hooks';
import Toast from 'react-native-toast-message';
import DeviceInfo from 'react-native-device-info';

export const Login = () => {
  const navigation = useNavigation();
  const mutationGenerateOTP = useGenerateOTP();
  const mutationAuthenticateByOTP = useAuthenticateByOTP();
  const mutationUpdateFcmToken = useUpdateFCMToken();
  const {
    changeToken,
    changeUserId,
    changeAddressId,
    changeCartId,
    changeRoleType,
  } = useAuth.use.actions();
  const {token, fcmToken} = useAuth.getState();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorPhone, setErrorPhone] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [otp, setOtp] = useState('0');
  const [roleType, setRoleType] = useState('');

  const handleSubmitOTP = (otp: string) => {
    const data = {
      otp: otp,
      phoneNumber: phoneNumber,
      roleType: roleType,
    };

    mutationAuthenticateByOTP.mutate(data, {
      onSuccess: data => {
        if (data?.status && data?.statusCode == 200) {
          setIsModalVisible(false);
          changeUserId(data?.data?.user?.id);
          changeAddressId(data?.data?.user?.addressId);
          changeCartId(data?.data?.user?.cartId);
          if (roleType == 'EKART') {
            changeToken(data?.data?.token);
          } else {
            handleUpdateFcmToken(data?.data?.token);
          }
        } else {
          Toast.show({
            type: 'error',
            text1: data?.message,
            visibilityTime: 4000,
          });
        }
      },
      onError: error => {
        // setIsLoading(false)
      },
    });
  };

  const handleUpdateFcmToken = (token: string) => {
    mutationUpdateFcmToken.mutate(token, {
      onSuccess: data => {
        if (data?.status && data?.statusCode == 200) {
          changeToken(token);
        } else {
          Toast.show({
            type: 'error',
            text1: data?.message,
            visibilityTime: 4000,
          });
        }
      },
      onError: error => {
        console.log('Fcm Token error : ' + JSON.stringify(error));
      },
    });
  };

  const handleResendOTP = () => {
    loginHandler();
    // Alert.alert('OTP Resent', 'A new OTP has been sent.');
  };

  const loginHandler = () => {
    mutationGenerateOTP.mutate(phoneNumber, {
      onSuccess: data => {
        if (data?.status && data?.statusCode == 200) {
          setRoleType(data?.data?.role);
          changeRoleType(data?.data?.role);
          setOtp(data?.data?.otp);
          setTimeout(() => {
            setIsModalVisible(true);
          }, 200);
        } else {
          Toast.show({
            type: 'error',
            text1: data?.message,
            visibilityTime: 4000,
          });
        }
      },
      onError: error => {
        // setIsLoading(false)
        console.log('generate otp error : ' + JSON.stringify(error));
      },
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.WHITE,
        paddingHorizontal: horizontalScale(20),
      }}>
      <Spinner
        visible={
          mutationGenerateOTP.isPending ||
          mutationAuthenticateByOTP.isPending ||
          mutationUpdateFcmToken.isPending
        }
      />
      <Image
        style={styles.imageStyle}
        source={require('../../../assets/images/FarmSanta.png')}
      />
      <View style={{marginTop: horizontalScale(20)}}>
        <CustomTextInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter Phone Number"
          keyboardType="numeric"
          maxLength={10}
          error={errorPhone}
        />

        {/* <CustomTextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter Password"
          error={errorPwd}
        /> */}

        <CustomButton title="Login" onPress={() => loginHandler()} />

        {/* navigation.navigate("SignUp") */}
        <OTPModal
          otpText={otp}
          visible={isModalVisible}
          onSubmitOTP={handleSubmitOTP}
          onResendOTP={handleResendOTP}
          onClose={() => setIsModalVisible(false)}
        />
        <View
          style={{flexDirection: 'row', marginTop: 20, alignSelf: 'center'}}>
          <CustomText
            textStyle={{
              fontFamily: FONTS.MEDIUM,
              fontSize: moderateScale(14),
              color: colors.GRAY,
            }}>
            {"Don't have an account? "}
          </CustomText>
          <CustomText
            enable={true}
            onPress={() => navigation.navigate('SignUp')}
            textStyle={{
              fontSize: moderateScale(14),
              color: colors.GREEN,
              marginTop: verticalScale(-1),
              fontFamily: FONTS.BOLD,
            }}>
            {'SignUp'}
          </CustomText>
        </View>
      </View>

      <View
        style={{
          justifyContent: 'flex-end',
          flex: 1,
          marginBottom: verticalScale(16),
        }}>
        <Text style={styles.versionStyle}>
          {'Version : ' + DeviceInfo.getVersion()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: horizontalScale(220),
    height: verticalScale(100),
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  versionStyle: {
    fontSize: moderateScale(15),
    color: colors.GREEN,
    fontFamily: FONTS.MEDIUM,
    textAlign: 'center',
  },
});
