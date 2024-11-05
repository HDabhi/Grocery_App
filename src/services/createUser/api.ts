import {useAuth} from '../../stores/auth';
import {axiosInstance} from '../axios-instance'; // Adjust the import path as needed

export const createUser = async userData => {
  const response = await axiosInstance.post('/ecommerce/user/save', userData);
  console.log('User prfile res : ' + JSON.stringify(response));
  return response.data;
};

export const getUserById = async () => {
  const {token, userId} = useAuth.getState();
  const response = await axiosInstance.get(
    `/ecommerce/user/getById/${userId}?token=${token}`,
  );
  return response.data;
};

export const updateFCMToken = async (token :  string) => {
  const {fcmToken} = useAuth.getState();
  console.log("TOKEN : " + token)
  console.log("FCM TOKEN : " + fcmToken)
  const response = await axiosInstance.get(
    `/ecommerce/user/update_fmc_token?fmcToken=${fcmToken}&token=${token}`,
  );
  return response.data;
};

export const UpdateUserById = async profileData => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.put(
    `/ecommerce/user/update/${profileData?.id}?token=${token}`,
    profileData,
  );
  console.log('update profile res : ' + JSON.stringify(response));
  return response.data;
};

export const addAddressDetails = async addressData => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.post(
    `/ecommerce/address/save?token=${token}`,
    addressData,
  );
  console.log('Address res : ' + JSON.stringify(response));
  return response.data;
};


export const uploadUserImage = async (formData) => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.post(
    `/ecommerce/aws/upload_image?token=${token}`,
    formData,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  console.log('image upload res : ' + JSON.stringify(response));
  return response.data;
};
