import {useMutation, useQuery} from '@tanstack/react-query';
import {
  getAddressList,
  updateAddressList,
  getAllState,
  getCityByStateId,
  getAddressById
} from './api';

export const useGetAddressList = () => {
  return useQuery({
    queryKey: ['address'],
    queryFn: getAddressList,
  });
};

export const useGetAddressById = () => {
  return useQuery({
    queryKey: ['addressByID'],
    queryFn: getAddressById,
  });
};

export const useUpdateAddressList = () => {
  return useMutation({
    mutationKey: ['address'],
    mutationFn: updateAddressList,
  });
};

export const useGetAllState = () => {
  return useQuery({
    queryKey: ['state'],
    queryFn: getAllState,
  });
};

export const useGetCityByStateId = (stateId) => {
  return useQuery({
    queryKey: ['city'],
    queryFn: () => getCityByStateId(stateId),
    enabled: !!stateId
  });
};

