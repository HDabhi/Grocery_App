import {useMutation, useQuery} from '@tanstack/react-query';
import {getOrderById, getOrderListing, orderCancelReturn, orderProductDetails, orderStatusUpdate, uploadImage} from './api';

export const useGetOrderList = (page : number) => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => getOrderListing(page),
  });
};

export const useGetOrderById = () => {
  return useMutation({
    mutationKey: ['orders'],
    mutationFn: getOrderById,
  });
};

export const useOrderCancelReturn = () => {
  return useMutation({
    mutationKey: ['orders'],
    mutationFn: orderCancelReturn,
  });
};

export const useOrderStatusUpdate = () => {
  return useMutation({
    mutationKey: ['orders'],
    mutationFn: orderStatusUpdate,
  });
};

export const useOrderProductDetails = () => {
  return useMutation({
    mutationKey: ['orders_product_details'],
    mutationFn: orderProductDetails,
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationKey: ['image_order'],
    mutationFn: uploadImage,
  });
};

// export const useAddProductToCart = () => {
//   return useMutation({
//     mutationKey: ['carts'],
//     mutationFn: addProductToCart,
//   });
// };

// export const useUpdateCartItem = () => {
//   return useMutation({
//     mutationKey: ['carts'],
//     mutationFn: updateCartItem,
//   });
// };

// export const useRemoveCartItem = () => {
//   return useMutation({
//     mutationKey: ['carts'],
//     mutationFn: removeCartItem,
//   });
// };
