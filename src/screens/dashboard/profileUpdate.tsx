import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import Spinner from '../../component/spinner';
import CustomTextInput from '../../component/customTextInput';
import {useEffect, useRef, useState} from 'react';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';
import CustomHeader from '../../component/CustomHeader';
import {useNavigation, useRoute} from '@react-navigation/native';
import colors from '../../utils/colors';
import CustomButton from '../../component/customButton';
import {useUpdateUser, useUploadUserImage} from '../../services/createUser/hooks';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

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

export const ProfileUpdate: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {profileData} = route.params;
  console.log('profileData : ' + JSON.stringify(profileData));
  const mutationUpdateUser = useUpdateUser();
  const mutationUploadImage = useUploadUserImage();
  const phoneNumberRef = useRef(null);
  const emailRef = useRef(null);
  const [response, setResponse] = useState<any>(null);
  const [imageUri, setImageUri] = useState('');

  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
  });

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
    if (profileData) {
      setFormData(prevState => ({
        ...prevState,
        fullName: profileData.name,
        email: profileData.email,
        phoneNumber: profileData.phone,
      }));
    }
  }, [profileData]);

  const updateProfile = () => {
    if (validateForm()) {
      const profileItem = {
        id: profileData.id,
        status: true,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        addressList: profileData.addressList,
        role: profileData.role,
        addressId: profileData.addressId,
        imageUrl: profileData.imageUrl,
        cartId: profileData.cartId,
      };

      mutationUpdateUser.mutate(profileItem, {
        onSuccess: data => {
          // setIsLoading(false)
          console.log('Update profile data : ' + JSON.stringify(data));
          if (data?.status && data?.statusCode == 200) {
            Toast.show({
              type: 'success',
              text1: 'Updated',
              text2: 'Profile updated successfully',
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
    }
  };

  const uploadUserImage = (image) => {
    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,   // Local file path of the image
      type: image.type, // MIME type of the image
      name: image.fileName, // File name
    });

      mutationUploadImage.mutate(formData, {
        onSuccess: data => {
          // setIsLoading(false)
          console.log('upload Image data : ' + JSON.stringify(data));
          if (data?.status && data?.statusCode == 200) {
           
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
    
  };

  const validateForm = (): boolean => {
    const newErrors: SignUpErrors = {};

    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber)
      newErrors.phoneNumber = 'Phone number is required';
    if (!formData.email) newErrors.email = 'Email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const includeExtra = true;

  // {
  //   "timestamp": "2024-09-29T20:33:56.000+0530",
  //   "originalPath": "file:///data/user/0/com.farmsanta.fresh_farmsanta/cache/rn_image_picker_lib_temp_86e9e92a-479b-471b-8b33-d4c702339108.jpg",
  //   "type": "image/jpeg",
  //   "height": 8000,
  //   "id": "rn_image_picker_lib_temp_86e9e92a-479b-471b-8b33-d4c702339108.jpg",
  //   "width": 6000,
  //   "fileName": "rn_image_picker_lib_temp_86e9e92a-479b-471b-8b33-d4c702339108.jpg",
  //   "fileSize": 12803125,
  //   "uri": "file:///data/user/0/com.farmsanta.fresh_farmsanta/cache/rn_image_picker_lib_temp_86e9e92a-479b-471b-8b33-d4c702339108.jpg"
  // }

  const takePhoto = () => {

    const options = {
      title: 'Select Image',
      quality: 0.3,
      storageOptions: {
        cameraRoll: true,
        skipBackup: true,
        path: 'images',
      },
      saveToPhotos: true,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else if (response.assets) {
        const capturedImage = response.assets[0];
        setImageUri(capturedImage?.uri);
        uploadUserImage(capturedImage)
        console.log('Captured Image URI:', JSON.stringify(capturedImage));
      }
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <CustomHeader
        title="Update Profile"
        onBackPress={() => navigation.goBack()}
      />

      {/* <Spinner
            visible={}

          /> */}

      <View style={{alignSelf: 'center', marginVertical: verticalScale(20)}}>
        {imageUri == '' ? (
          <Image
            style={{
              width: horizontalScale(80),
              height: verticalScale(80),
              resizeMode: 'contain',
              borderRadius: moderateScale(20),
            }}
            source={require('../../../assets/images/user.jpeg')}
          />
        ) : (
          <Image
            style={{
              width: horizontalScale(120),
              height: verticalScale(140),
              resizeMode: 'cover',
              borderRadius: moderateScale(20),
            }}
            source={{uri: imageUri}}
          />
        )}

        {/* <TouchableOpacity
          onPress={() => takePhoto()}
          style={{position: 'absolute', bottom: -10, right: -5}}>
          <Icon name="camera" size={verticalScale(40)} color={colors.BLACK} />
        </TouchableOpacity> */}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          paddingHorizontal: horizontalScale(20),
          marginTop: verticalScale(10),
        }}
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

          <CustomButton
            title="Update"
            onPress={() => updateProfile()}
            buttonStyle={{marginStart: verticalScale(5)}}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
