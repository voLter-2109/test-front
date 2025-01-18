import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteUserById } from "../api/users/users";
import { IUserAllLocalStorage } from "../type/user.interface";

import getAllUserCash from "./useGetAllUserCash";

const useDeleteUserQuery = (id: number) => {
  const queryClient = useQueryClient();
  const data = getAllUserCash();

  const handleChangeStorage = () => {
    if (!data) return;

    queryClient.setQueryData<IUserAllLocalStorage>(["get all users"], (old) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.filter((user) => user.id !== id),
      };
    });
  };

  const { isLoading, mutate, isSuccess } = useMutation({
    mutationKey: ["delete user"],
    mutationFn: () => {
      return deleteUserById(id);
    },
    onSuccess: () => {
      handleChangeStorage();
    },
  });

  return {
    isLoading,
    mutate,
    isSuccess,
  };
};

export default useDeleteUserQuery;
