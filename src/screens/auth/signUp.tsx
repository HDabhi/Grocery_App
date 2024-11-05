import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomTextInput from '../../component/customTextInput';
import CustomButton from '../../component/customButton';
import {useNavigation} from '@react-navigation/native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';
import {
  useCreateUser,
  useUpdateFCMToken,
} from '../../services/createUser/hooks';
import {
  useGenerateOTP,
  useAuthenticateByOTP,
} from '../../services/generateOTP/hooks';
import {useAuth} from '../../stores/auth';

import Spinner from '../../component/spinner';
import colors from '../../utils/colors';
import OTPModal from '../../component/OTPModal';
import Toast from 'react-native-toast-message';
import FONTS from '../../component/fonts';
import CheckBox from '../../component/CheckBox';

// Define types for form data and errors
interface SignUpFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
}

interface SignUpErrors {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
}

export const SignUp: React.FC = () => {
  const navigation = useNavigation();
  const mutationUser = useCreateUser();
  const mutationGenerateOTP = useGenerateOTP();
  const mutationAuthenticateByOTP = useAuthenticateByOTP();
  const mutationUpdateFcmToken = useUpdateFCMToken();
  const {changeToken, changeAddressId, changeUserId, changeCartId} =
    useAuth.use.actions();

  const fullNameRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const emailRef = useRef(null);

  // State for form data
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
  });

  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [isTermCondition, setIsTermCondition] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [otp, setOtp] = useState('0');
  // State for form errors
  const [errors, setErrors] = useState<SignUpErrors>({});

  // Handler to update form data
  const handleChange = (field: keyof SignUpFormData, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: SignUpErrors = {};

    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber)
      newErrors.phoneNumber = 'Phone number is required';
    if (!formData.email) newErrors.email = 'Email is required';

    setErrors(newErrors);
    // Check if any errors exist
    return Object.keys(newErrors).length === 0;
  };

  const submitSignUpData = () => {
    if (validateForm()) {
      const signUpPayload = {
        email: formData.email,
        imageUrl: '',
        name: formData.fullName,
        phone: formData.phoneNumber,
        role: 'USER',
        status: true,
      };

      setTimeout(() => {
        mutationUser.mutate(signUpPayload, {
          onSuccess: data => {
            // setIsLoading(false)
            if (data?.status && data?.statusCode == 200) {
              changeUserId(data?.data?.id);
              changeAddressId(data?.data?.addressId);
              generateOtpVerify();
            } else {
              Toast.show({
                type: 'error',
                text1: data?.message,
                visibilityTime: 4000,
              });
            }
            // navio.push('AddOrganization')
          },
          onError: error => {
            // setIsLoading(false)
            console.log('Create profile error : ' + JSON.stringify(error));
          },
        });
      }, 100);
    }
  };

  const generateOtpVerify = () => {
    mutationGenerateOTP.mutate(formData.phoneNumber, {
      onSuccess: data => {
        if (data?.status && data?.statusCode == 200) {
          setOtp(data?.data?.otp);
          setIsModalVisible(true);
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

  const handleSubmitOTP = (otp: string) => {
    const data = {
      otp: otp,
      phoneNumber: formData.phoneNumber,
    };

    mutationAuthenticateByOTP.mutate(data, {
      onSuccess: data => {
        if (data?.status && data?.statusCode == 200) {
          setIsModalVisible(false);
          console.log('token : ' + data?.data?.token);
          changeUserId(data?.data?.user?.id);
          changeAddressId(data?.data?.user?.addressId);
          changeCartId(data?.data?.user?.cartId);
          handleUpdateFcmToken(data?.data?.token);
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
        console.log('Authenticate otp error : ' + JSON.stringify(error));
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
    generateOtpVerify();
    // Alert.alert('OTP Resent', 'A new OTP has been sent.');
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
          mutationUser.isPending ||
          mutationGenerateOTP.isPending ||
          mutationAuthenticateByOTP.isPending ||
          mutationUpdateFcmToken.isPending
        }
      />

      <Image
        style={styles.imageStyle}
        source={require('../../../assets/images/FarmSanta.png')}
      />

      <OTPModal
        otpText={otp}
        visible={isModalVisible}
        onSubmitOTP={handleSubmitOTP}
        onResendOTP={handleResendOTP}
        onClose={() => setIsModalVisible(false)}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={verticalScale(40)}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <CustomTextInput
            label="Full Name"
            value={formData.fullName}
            onChangeText={value => handleChange('fullName', value)}
            placeholder="Enter Full Name"
            error={errors.fullName}
            returnKeyType="next"
            onSubmitEditing={() => phoneNumberRef.current?.focus()}
            blurOnSubmit={false}
          />

          <CustomTextInput
            ref={phoneNumberRef}
            label="Phone Number"
            value={formData.phoneNumber}
            keyboardType="number-pad"
            onChangeText={value => handleChange('phoneNumber', value)}
            placeholder="Enter Phone Number"
            maxLength={10}
            error={errors.phoneNumber}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            blurOnSubmit={false}
          />

          <CustomTextInput
            ref={emailRef}
            label="Email"
            value={formData.email}
            keyboardType="email-address"
            onChangeText={value => handleChange('email', value)}
            placeholder="Enter Email"
            error={errors.email}
            returnKeyType="done"
            blurOnSubmit={true}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}>
            <CheckBox
              label={''}
              value={isTermCondition}
              onChange={newValue => setIsTermCondition(!isTermCondition)}
              checkedColor={colors.GREEN}
              uncheckedColor={colors.GRAY}
            />
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={styles.txtTerm}>{"I've read and accept the "}</Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('TermCondition')}>
                <Text style={styles.txtTermUnderline}>
                  {'Terms Conditions '}
                </Text>
              </TouchableOpacity>

              <Text style={styles.txtTerm}>{'& '}</Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('PrivacyPolicy')}>
                <Text style={styles.txtTermUnderline}>{'Privacy Policy'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: horizontalScale(20)}}>
            <CustomButton
              title="Back"
              onPress={() => navigation.goBack()}
              buttonStyle={{
                flex: 1,
                marginEnd: verticalScale(5),
                backgroundColor: colors.TxtYellow,
              }}
            />

            <CustomButton
              disabled={isTermCondition ? false : true}
              title="Sign Up"
              onPress={() => submitSignUpData()}
              buttonStyle={{flex: 1, marginStart: verticalScale(5)}}
            />
          </View>
        </ScrollView>

        {/* <MapView
          style={styles.map}
          //specify our coordinates.
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        /> */}

        {/* <CustomTextInput
          label="Password"
          value={formData.password}
          onChangeText={value => handleChange('password', value)}
          placeholder="Enter Password"
          error={errors.password}
        /> */}
      </KeyboardAvoidingView>
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
  map: {
    height: verticalScale(100),
  },
  txtTerm: {
    fontSize: moderateScale(13),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
    marginStart: horizontalScale(6),
  },
  txtTermUnderline: {
    textDecorationLine: 'underline',
    fontSize: moderateScale(13),
    fontFamily: FONTS.BOLD,
    color: colors.GREEN,
  },
});
