import {useMutation, useQuery} from '@tanstack/react-query';
import {
  getCartListing,
  addProductToCart,
  updateCartItem,
  removeCartItem,
  placeCartOrder,
  generateRazorpayOrderId,
  updatePaymentStatus,
} from './api';

export const useGetCartList = () => {
  return useQuery({
    queryKey: ['carts'],
    queryFn: getCartListing,
  });
};

export const useAddProductToCart = () => {
  return useMutation({
    mutationKey: ['carts'],
    mutationFn: addProductToCart,
  });
};

export const useUpdateCartItem = () => {
  return useMutation({
    mutationKey: ['carts'],
    mutationFn: updateCartItem,
  });
};

export const useRemoveCartItem = () => {
  return useMutation({
    mutationKey: ['carts'],
    mutationFn: removeCartItem,
  });
};

export const usePlaceCartOrder = () => {
  return useMutation({
    mutationKey: ['carts_order'],
    mutationFn: placeCartOrder,
  });
};

export const useGenerateRazorpayOrderId = () => {
  return useMutation({
    mutationKey: ['razorpay'],
    mutationFn: generateRazorpayOrderId,
  });
};

export const useUpdatePaymentStatus = () => {
  return useMutation({
    mutationKey: ['razorpay_payment'],
    mutationFn: updatePaymentStatus,
  });
};

