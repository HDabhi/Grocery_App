import {axiosInstance} from '../axios-instance'; // Adjust the import path as needed


export const generateOTP = async (phoneNumber) => {
  const response = await axiosInstance.get(`/ecommerce/user/generate_otp?username=${phoneNumber}`);
  console.log("Otp res : " + JSON.stringify(response))
  return response.data;
};


export const authenticateByOTP = async (data) => {
  const response = data?.roleType == "EKART" ? await axiosInstance.get(`/ecommerce/ekart/authenticate?mobile=${data?.phoneNumber}&otp=${data?.otp}`) : await axiosInstance.get(`/ecommerce/user/authenticate?otp=${data?.otp}&username=${data?.phoneNumber}`);
  console.log("Authenticate res : " + JSON.stringify(response))
  return response.data;
};
