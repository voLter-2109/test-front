import { useQuery } from "@tanstack/react-query";

import { getAllUser } from "../api/users/users";
import { DOCTOR_PROFESSION, GENDER } from "../constant/constants";
import getRandomDate from "../utils/getRandomDate";
import getRandomElement from "../utils/getrandomElement";

const useGetAllUserQuery = () => {
  const fetchUserList = async (pageInt: number) => {
    const res = await getAllUser({
      page: pageInt,
      per_page: 50,
    });
    return {
      ...res.data,
      data: res.data.data.map((item) => {
        return {
          ...item,
          gender: getRandomElement(GENDER),
          birthDate: getRandomDate(),
          work: getRandomElement(DOCTOR_PROFESSION),
        };
      }),
    };
  };

  const { data, isFetching, isLoading, isError } = useQuery({
    queryKey: ["get all users"],
    queryFn: ({ pageParam = 1 }) => {
      return fetchUserList(pageParam);
    },
  });

  return {
    data,
    isFetching,
    isLoading,
    isError,
  };
};

export default useGetAllUserQuery;
