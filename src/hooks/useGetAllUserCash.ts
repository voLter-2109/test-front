import { useQueryClient } from '@tanstack/react-query';

import { IUserAllLocalStorage } from '../type/user.interface';

const useGetAllUserCash = () => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<IUserAllLocalStorage>([
    'get all users',
  ]);
  return data;
};

export default useGetAllUserCash;
