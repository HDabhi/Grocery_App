import {useAuth} from '../../stores/auth';
import {axiosInstance} from '../axios-instance'; // Adjust the import path as needed

export const getStoreClosingMsg = async () => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.get(
    `/ecommerce/general_assets/get_store_closing_message?token=${token}`,
  );
  return response.data;
};
