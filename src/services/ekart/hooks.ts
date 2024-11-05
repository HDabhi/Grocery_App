import {useMutation, useQuery} from '@tanstack/react-query';
import { getEKartList } from './api';

export const useGetEKartList = () => {
  return useQuery({
    queryKey: ['ekart'],
    queryFn: getEKartList,
  });
};
