import {useAuth} from '../../stores/auth';
import {axiosInstance} from '../axios-instance';

export const getEKartList = async () => {
    const {token} = useAuth.getState();
    const response = await axiosInstance.get(
      `/ecommerce/ekart/getAll?token=${token}`,
    );
    return response.data;
  };