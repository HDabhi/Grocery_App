import {useQuery} from '@tanstack/react-query';
import {getStoreClosingMsg} from './api';

export const useGetStoreClosingMsg = () => {
  return useQuery({
    queryKey: ['error_msg'],
    queryFn: getStoreClosingMsg,
  });
};
