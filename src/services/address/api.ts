import {useAuth} from '../../stores/auth';
import {axiosInstance} from '../axios-instance'; // Adjust the import path as needed

export interface UserAddress {
  id: string;
  createdTime: string;
  updatedTime: string;
  status: boolean;
  userId: string;
  pincode: number;
  longitude: number;
  latitude: number;
  city: string;
  street: string;
  houseNumber: string;
  state: string;
  primary: boolean;
}

export const getAddressList = async () => {
  const {token, cartId} = useAuth.getState();
  const response = await axiosInstance.get(
    `/ecommerce/address/get_address_by_user?token=${token}`,
  );
  return response.data;
};

export const getAddressById = async () => {
  const {token, addressId} = useAuth.getState();
  const response = await axiosInstance.get(
    `/ecommerce/address/getById/${addressId}?token=${token}`,
  );
  return response.data;
};

export const getAllState = async () => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.get(
    `/ecommerce/state/getAll?token=${token}`,
  );
  return response.data;
};

export const getCityByStateId = async (stateId: string) => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.get(
    `/ecommerce/city/get_city_by_state?stateId=${stateId}&token=${token}`,
  );
  console.log('city data ' + JSON.stringify(response));
  return response.data;
};

export const updateAddressList = async addressData => {
  console.log('update address : ' + JSON.stringify(addressData));
  const {token} = useAuth.getState();
  const response = await axiosInstance.put(
    `/ecommerce/address/update/${addressData.id}?token=${token}`,
    addressData,
  );
  return response.data;
};
