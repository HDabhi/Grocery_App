import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import CustomButton from '../../component/customButton';
import CustomTextInput from '../../component/customTextInput';
import { useAddAddressDetails } from '../../services/createUser/hooks';
import { useAuth } from '../../stores/auth';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';

import Toast from 'react-native-toast-message';
import CustomHeader from '../../component/CustomHeader';
import FONTS from '../../component/fonts';
import Spinner from '../../component/spinner';
import {
  useGetAllState,
  useGetCityByStateId,
} from '../../services/address/hooks';
import colors from '../../utils/colors';

// Define types for form data and errors
interface SignUpFormData {
  houseNumber: string;
  pincode: string;
  city: string;
  state: string;
  street: string;
}

interface SignUpErrors {
  houseNumber: string;
  pincode: string;
  city: string;
  state: string;
  street: string;
}

export const AddNewAddress: React.FC = () => {
  const navigation = useNavigation();
  const mutationAddAddress = useAddAddressDetails();
  const {
    data: stateData,
    error: stateError,
    isLoading: stateLoading,
  } = useGetAllState();
  
  const {changeAddressId} = useAuth.use.actions();
  const {userId} = useAuth.getState();

  const houseNumberRef = useRef(null);
  const pincodeRef = useRef(null);
  const streetRef = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);

  // State for form data
  const [formData, setFormData] = useState<SignUpFormData>({
    houseNumber: '',
    pincode: '',
    city: '',
    state: '',
    street: '',
  });

  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');
  const [stateId, setStateId] = useState<string>();
  // State for form errors
  const [errors, setErrors] = useState<SignUpErrors>({});

  const {
    data: cityData,
    error: cityError,
    isLoading: cityLoading,
    refetch
  } = useGetCityByStateId(stateId);

  // Handler to update form data
  const handleChange = (field: keyof SignUpFormData, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  useEffect(() => {
    if(stateId){
      refetch()
    }
  },[stateId])
  
  useEffect(() => {
    if (stateData) {
      if (stateData.status && stateData.statusCode === 200) {
        const transformedData = stateData.data.map(item => ({
          label: item.name,
          value: item.name,
          id: item.id,
        }));

        setStateList(transformedData);
      } else {
        Toast.show({
          type: 'error',
          text1: stateData?.message,
          visibilityTime:4000
        });
      }
    }
  }, [stateData]);

  useEffect(() => {
    if (cityData) {
      if (cityData.status && cityData.statusCode === 200) {
        const transformedData = cityData.data.map(item => ({
          label: item.name,
          value: item.name,
          id: item.id,
        }));

        setCityList(transformedData);
      } else {
        Toast.show({
          type: 'error',
          text1: cityData?.message,
          visibilityTime:4000
        });
      }
    }
  }, [cityData]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getOneTimeLocation();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Permission Denied',
            visibilityTime:4000
          });
        }
      } catch (err) {
        console.warn(err);
      }
    };
    requestLocationPermission();

    return () => {
      // Geolocation.clearWatch();
    };
  }, []);

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);

        setCurrentLongitude(currentLongitude);
        setCurrentLatitude(currentLatitude);
      },
      error => {
        // setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const validateForm = (): boolean => {
    const newErrors: SignUpErrors = {};

    if (!formData.houseNumber)
      newErrors.houseNumber = 'House number is required';
    if (!formData.street) newErrors.street = 'Street is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    if (!stateName) newErrors.state = 'State is required';
    if (!cityName) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitAddressData = () => {
    if (validateForm()) {
      const addressPayload = {
        city: cityName,
        houseNumber: formData.houseNumber,
        latitude: currentLatitude,
        longitude: currentLongitude,
        pincode: formData.pincode,
        primary: true,
        state: stateName,
        status: true,
        street: formData.street,
        userId: userId,
      };

      setTimeout(() => {
        mutationAddAddress.mutate(addressPayload, {
          onSuccess: data => {
            if (data?.status && data?.statusCode == 200) {
              Toast.show({
                type: 'success',
                text1: 'Added',
                text2: 'New Address added successfully',
              });
              navigation.goBack();
            } else {
              Toast.show({
                type: 'error',
                text1: data?.message,
                visibilityTime:4000
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

  const renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <CustomHeader
        title="Add New Address"
        onBackPress={() => navigation.goBack()}
      />

      <Spinner visible={mutationAddAddress.isPending} />

      {/* <Image
        style={styles.imageStyle}
        source={require('../../../assets/images/FarmSanta.png')}
      /> */}

      {/* <OTPModal
                visible={isModalVisible}
                onSubmitOTP={handleSubmitOTP}
                onResendOTP={handleResendOTP}
                onClose={() => setIsModalVisible(false)}
            /> */}

      {/* <CustomText
        textStyle={{
          fontFamily: FONTS.BOLD,
          fontSize: moderateScale(20),
          color: colors.GREEN,
          textAlign: 'center',
        }}>
        {'Address Details'}
      </CustomText> */}
      <View
        style={{
          paddingHorizontal: horizontalScale(20),
          marginTop: verticalScale(10),
          flex: 1,
        }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1, marginTop: verticalScale(10)}}
          keyboardVerticalOffset={verticalScale(100)}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* <View style={{flexDirection: 'row', gap: horizontalScale(10)}}>
          <View style={{flex: 1}}>
            
          </View>

          <View style={{flex: 1}}>
            
          </View>
        </View> */}

            <CustomTextInput
              ref={houseNumberRef}
              label="House Number"
              value={formData.houseNumber}
              onChangeText={value => handleChange('houseNumber', value)}
              placeholder="Enter House Number"
              error={errors.houseNumber}
              returnKeyType="next"
              onSubmitEditing={() => streetRef.current?.focus()}
              blurOnSubmit={false}
            />

            <CustomTextInput
              ref={streetRef}
              label="Street"
              value={formData.street}
              onChangeText={value => handleChange('street', value)}
              placeholder="Enter Street"
              error={errors.street}
              returnKeyType="next"
              onSubmitEditing={() => pincodeRef.current?.focus()}
              blurOnSubmit={false}
            />

            <CustomTextInput
              ref={pincodeRef}
              label="Pincode"
              value={formData.pincode}
              keyboardType="numeric"
              onChangeText={value => handleChange('pincode', value)}
              placeholder="Enter Pincode"
              maxLength={6}
              error={errors.pincode}
              returnKeyType="done"
            />

            <CustomTextInput
              isDropDown
              label="State"
              list={stateList}
              value={stateName}
              onChangeText={item => {
                setStateName(item?.value);
                setStateId(item?.id);
              }}
              placeholder="Select State"
              error={errors.state}
            />

            <CustomTextInput
              isDropDown
              label="City"
              list={cityList}
              value={cityName}
              onChangeText={item => {
                setCityName(item?.value);
              }}
              placeholder="Select City"
              error={errors.city}
            />

            <CustomButton
              title="Add"
              onPress={() => submitAddressData()}
              buttonStyle={{marginStart: verticalScale(5)}}
            />
          </ScrollView>
        </KeyboardAvoidingView>
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
  dropdown: {
    height: verticalScale(45),
    backgroundColor: 'white',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  icon: {
    marginRight: 0,
  },
  item: {
    padding: horizontalScale(11),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: moderateScale(14.5),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
  },
  placeholderStyle: {
    fontSize: moderateScale(14.5),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.GRAY,
    marginStart: horizontalScale(-12),
  },
  selectedTextStyle: {
    fontSize: moderateScale(14.5),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
    marginStart: horizontalScale(-12),
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  label: {
    fontSize: moderateScale(13),
    color: colors.GRAY,
    fontFamily: FONTS.MEDIUM,
  },
  error: {
    marginTop: verticalScale(4),
    color: 'red',
    fontSize: moderateScale(12),
    fontFamily: FONTS.REGULAR,
  },
});
