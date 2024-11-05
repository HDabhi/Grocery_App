import {useAuth} from '../../stores/auth';
import {axiosInstance} from '../axios-instance'; // Adjust the import path as needed

export const getCartListing = async () => {
  const {token, cartId} = useAuth.getState();


  const response = await axiosInstance.get(
    `/ecommerce/cart/get_cart?cartId=${cartId}&token=${token}`,
  );
  return response.data;
};

export const addProductToCart = async cartData => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.post(
    `/ecommerce/cart/add_product?token=${token}`,
    cartData,
  );
  return response.data;
};

export const updateCartItem = async cartItem => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.get(
    `/ecommerce/cart/update_product?cartItemId=${cartItem?.cartItemId}&quantity=${cartItem?.quantity}&token=${token}`,
  );
  return response.data;
};

export const removeCartItem = async (cartItemId: string) => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.get(
    `/ecommerce/cart/remove_product?cartItemId=${cartItemId}&token=${token}`,
  );
  return response.data;
};

export const placeCartOrder = async (modeOfPayment: string) => {
  const {token, addressId, cartId} = useAuth.getState();
  const response = await axiosInstance.get(
    `/ecommerce/order/place_cart_order?addressId=${addressId}&cartId=${cartId}&paymentMode=${modeOfPayment}&token=${token}`,
  );
  console.log('res place : ' + JSON.stringify(response));
  return response.data;
};

export const generateRazorpayOrderId = async amount => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.get(
    `/ecommerce/payment/getRazorPayOrderId?amount=${amount}&currency=INR&token=${token}`,
  );
  return response.data;
};

export const updatePaymentStatus = async paymentData => {
  const {token} = useAuth.getState();
  const response = await axiosInstance.get(
    `/ecommerce/payment/updatePaymentStatus?orderId=${paymentData?.orderId}&paymentId=${paymentData?.razorpay_payment_id}&paymentStatus=true&razorPayOrderId=${paymentData?.razorpay_order_id}&paymentSignature=${paymentData?.razorpay_signature}&token=${token}`,
  );
  return response.data;
};
