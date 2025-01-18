import { FC, memo, useMemo } from "react";

import { ReactComponent as DeleteIcon } from "../../assets/deleteIcon.svg";
import deleteUserQuery from "../../hooks/useDeleteUserQuery";
import getAllUserCash from "../../hooks/useGetAllUserCash";
import CustomButton from "../../ui/CustomButton";

interface Props {
  userId: number;
  handleClosePopup: () => void;
}

const DeleteUser: FC<Props> = ({ userId, handleClosePopup }) => {
  const data = getAllUserCash();

  const foundUser = useMemo(() => {
    return data?.data?.find((user) => user.id === userId);
  }, []);

  if (!foundUser) return <p>пользователь не найден</p>;

  const { isLoading, isSuccess, mutate } = deleteUserQuery(foundUser.id);

  const handleDelete = () => {
    mutate();
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <DeleteIcon width={80} height={80} />
      {isSuccess ? (
        <p>Пользователь удален</p>
      ) : (
        <>
          <p>Вы хотите удалить пользователя:</p>
        </>
      )}
      <div className="flex gap-1 [&>p]:text-lg">
        <p>{foundUser?.last_name}</p>
        <p>{foundUser?.first_name}</p>
      </div>

      {isSuccess ? (
        <CustomButton styleBtn="save" onClick={handleClosePopup}>
          <p>Закрыть</p>
        </CustomButton>
      ) : (
        <div className="flex  gap-3 ">
          <CustomButton
            disabled={isLoading}
            styleBtn="delete"
            onClick={handleDelete}
          >
            {isLoading ? "удаление..." : "Удалить"}
          </CustomButton>
          <CustomButton
            disabled={isLoading}
            styleBtn="cancel"
            onClick={handleClosePopup}
          >
            отменить
          </CustomButton>
        </div>
      )}
    </div>
  );
};

export default memo(DeleteUser);
