import {useMutation, useQuery} from '@tanstack/react-query';
import {
  createUser,
  addAddressDetails,
  getUserById,
  UpdateUserById,
  updateFCMToken,
  uploadUserImage,
} from './api';

export const useCreateUser = () => {
  return useMutation({
    mutationKey: ['users'],
    mutationFn: createUser,
  });
};

export const useGetUser = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUserById,
  });
};

export const useUpdateFCMToken = () => {
  return useMutation({
    mutationKey: ['fcmtoken'],
    mutationFn: updateFCMToken,
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationKey: ['users'],
    mutationFn: UpdateUserById,
  });
};

export const useAddAddressDetails = () => {
  return useMutation({
    mutationKey: ['address'],
    mutationFn: addAddressDetails,
  });
};

export const useUploadUserImage = () => {
  return useMutation({
    mutationKey: ['userImage'],
    mutationFn: uploadUserImage,
  });
};
