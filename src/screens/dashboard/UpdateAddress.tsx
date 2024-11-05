import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import CustomTextInput from '../../component/customTextInput';
import CustomButton from '../../component/customButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';
import Geolocation from '@react-native-community/geolocation';
import {useAddAddressDetails} from '../../services/createUser/hooks';
import {useAuth} from '../../stores/auth';

import Spinner from '../../component/spinner';
import colors from '../../utils/colors';
import CustomText from '../../component/customText';
import FONTS from '../../component/fonts';
import CustomHeader from '../../component/CustomHeader';
import {
  useGetAllState,
  useGetCityByStateId,
  useUpdateAddressList,
} from '../../services/address/hooks';
import Toast from 'react-native-toast-message';

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

export const UpdateAddress: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {addressItem} = route.params;
  const mutationUpdateAddressData = useUpdateAddressList();
  // const mutationGetCity = useGetCityByStateId();
  const {
    data: stateData,
    error: stateError,
    isLoading: stateLoading,
  } = useGetAllState();

  const {changeAddressId} = useAuth.use.actions();
  const {userId} = useAuth.getState();

  console.log('Userid : ' + userId);

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


  const {
    data: cityData,
    error: cityError,
    isLoading: cityLoading,
    refetch
  } = useGetCityByStateId(stateId);

  // State for form errors
  const [errors, setErrors] = useState<SignUpErrors>({});

  // Handler to update form data
  const handleChange = (field: keyof SignUpFormData, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (stateData) {
      if (stateData.status && stateData.statusCode === 200) {
        console.log('stateData : ' + JSON.stringify(stateData));
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
    if(stateList.length > 0){
      const foundItem = stateList.find(item => item.value === stateName);
      if(foundItem){
        setStateId(foundItem?.id)
      }
    }
  },[stateList]) 

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
    if(stateId){
      refetch()
    }
  },[stateId])

  // useEffect(() => {
  //   if (stateId) {
  //     mutationGetCity.mutate(stateId, {
  //       onSuccess: data => {
  //         console.log('City data : ' + JSON.stringify(data));
  //         if (data?.status && data?.statusCode == 200) {
  //           const cityData = data?.data.map(item => ({
  //             label: item.name,
  //             value: item.name,
  //           }));
  //           setCityList(cityData);
  //         } else {
  //           Alert.alert(data?.message);
  //         }
  //       },
  //       onError: error => {
  //         Alert.alert(error?.message);
  //       },
  //     });
  //   }
  // }, [stateId]);

  useEffect(() => {
    if (addressItem) {
      setFormData(prevState => ({
        ...prevState,
        houseNumber: addressItem.houseNumber,
        street: addressItem.street,
        pincode: addressItem.pincode + '',
      }));

      setStateName(addressItem.state);
      setCityName(addressItem.city);
    }
  }, [addressItem]);

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
        console.log('position : ' + JSON.stringify(position));
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
    console.log('validate form : ' + validateForm());
    console.log('City Name : ' + cityName);
    if (validateForm()) {
      const addressPayload = {
        id: addressItem?.id,
        city: cityName,
        houseNumber: formData.houseNumber,
        latitude: currentLatitude,
        longitude: currentLongitude,
        pincode: formData.pincode,
        primary: addressItem?.primary,
        state: stateName,
        status: addressItem?.status,
        street: formData.street,
        userId: addressItem?.userId,
      };

      console.log('Update address  : ' + JSON.stringify(addressPayload));

      setTimeout(() => {
        mutationUpdateAddressData.mutate(addressPayload, {
          onSuccess: data => {
            // setIsLoading(false)
            console.log('Create profile data : ' + JSON.stringify(data));
            if (data?.status && data?.statusCode == 200) {
              Toast.show({
                type: 'success',
                text1: 'Updated',
                text2: 'Address updated successfully',
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

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <CustomHeader
        title="Update Address"
        onBackPress={() => navigation.goBack()}
      />

      <Spinner visible={mutationUpdateAddressData.isPending} />

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
            <CustomTextInput
              ref={houseNumberRef}
              label="House Number"
              value={formData.houseNumber}
              onChangeText={value => handleChange('houseNumber', value)}
              placeholder="Enter House Number"
              error={errors.houseNumber}
              returnKeyType="next"
              onSubmitEditing={() => pincodeRef.current?.focus()}
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
              onSubmitEditing={() => cityRef.current?.focus()}
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
              returnKeyType="next"
              onSubmitEditing={() => streetRef.current?.focus()}
              blurOnSubmit={false}
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

            {/* <CustomTextInput
              ref={cityRef}
              label="City"
              value={formData.city}
              onChangeText={value => handleChange('city', value)}
              placeholder="Enter City"
              error={errors.city}
              returnKeyType="next"
              onSubmitEditing={() => stateRef.current?.focus()}
              blurOnSubmit={false}
            />

            <CustomTextInput
              ref={stateRef}
              label="State"
              value={formData.state}
              onChangeText={value => handleChange('state', value)}
              placeholder="Enter State"
              error={errors.state}
              returnKeyType="done"
            /> */}

            <CustomButton
              title="Update"
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
});
