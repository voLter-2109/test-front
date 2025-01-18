import { useAutoAnimate } from "@formkit/auto-animate/react";
import { memo, useCallback, useState } from "react";

import { ReactComponent as Delete } from "../../assets/delete.svg";
import { ReactComponent as Redact } from "../../assets/redact.svg";

import SimpleForm from "../../components/createProfile.tsx/CreateProfile";
import DeleteUser from "../../components/deleteUser/DeleteUser";
import Popup from "../../components/popup/Popup";
import UserSearchInput from "../../components/searchInput/SearchInput";
import getAllUserQuery from "../../hooks/useGetAllUserQuery";
import { NewUser, SortFields } from "../../type/user.interface";
import SortButton from "../../ui/SortButton";
import convertDate from "../../utils/convertDate";

const Home = () => {
  const [listRef] = useAutoAnimate();
  const { data, isError, isFetching, isLoading } = getAllUserQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [selectAction, setSelectAction] = useState<{
    id: number | null;
    action: "delete" | "redact" | null;
  }>({
    id: null,
    action: null,
  });

  const [sortConfig, setSortConfig] = useState<{
    key: SortFields;
    direction: "ascending" | "descending" | null;
  }>({ key: null, direction: null });

  const handleDelete = (id: number) => {
    setSelectAction({
      id,
      action: "delete",
    });
    setIsOpen((prev) => !prev);
  };

  const handleChange = (id: number) => {
    setSelectAction({
      id,
      action: "redact",
    });
    setIsOpen((prev) => !prev);
  };

  const handleClosePopup = () => {
    setIsOpen(false);
    setSelectAction({
      id: null,
      action: null,
    });
  };

  const sortArray = useCallback(
    (
      array: NewUser[],
      sort: {
        key: SortFields;
        direction: "ascending" | "descending" | null;
      }
    ) => {
      if (!sort.key || !sort.direction) return array;

      return array.sort((a, b) => {
        if (sort.key === "last_name") {
          return (
            a.first_name.localeCompare(b.first_name) *
            (sort.direction === "ascending" ? 1 : -1)
          );
        }
        if (sort.key === "gender") {
          return (
            a.gender.localeCompare(b.gender) *
            (sort.direction === "ascending" ? 1 : -1)
          );
        }
        if (sort.key === "birthDate") {
          return (
            (new Date(a.birthDate).getTime() -
              new Date(b.birthDate).getTime()) *
            (sort.direction === "ascending" ? 1 : -1)
          );
        }
        return 0;
      });
    },
    []
  );

  const handleSort = useCallback((field: SortFields) => {
    setSortConfig((prev) => {
      if (prev.key === field) {
        // Если поле уже выбрано, переключаем направление сортировки
        return {
          key: field,
          direction:
            prev.direction === "ascending" ? "descending" : "ascending",
        };
      }
      // Иначе устанавливаем поле и сортируем по возрастанию
      return { key: field, direction: "ascending" };
    });
  }, []);

  if (isLoading) return <p>Загрузка...</p>;
  if (isError) return <p>Произошла ошибка при загрузке данных</p>;
  if (!data) return <p>Данных пользователей нет</p>;

  const sortedData = data.data ? sortArray([...data.data], sortConfig) : [];

  return (
    <>
      {isOpen && (
        <Popup isOpen={isOpen} onClose={handleClosePopup}>
          {selectAction.action === "delete" && selectAction.id && (
            <DeleteUser
              userId={selectAction.id}
              handleClosePopup={handleClosePopup}
            />
          )}
          {selectAction.action === "redact" && (
            <SimpleForm defaultId={selectAction.id} close={handleClosePopup} />
          )}
        </Popup>
      )}
      <div>
        <h1 className="mb-3">
          Пользователи клиники: {data.data.length || 0} пользователей
        </h1>

        <div className="overflow-hidden rounded-2xl pb-4">
          <table className="w-full">
            <thead className="mb-3 [&>tr>th]:p-3 bg-white">
              <tr>
                <th className="w-full" colSpan={6}>
                  <UserSearchInput />
                </th>
              </tr>
              <tr className="[&>th]:text-left">
                <th data-type="string">
                  <div className="flex  gap-2 ">
                    <p>ФИО пользователя</p>
                    <SortButton sortFunc={handleSort} field="last_name">
                      <p className="text-gray-500">По алфавиту А-Я</p>
                    </SortButton>
                  </div>
                </th>
                <th>Контактные данные</th>
                <th>
                  <div className="flex gap-2">
                    <span> Дата рождения</span>
                    <SortButton sortFunc={handleSort} field="birthDate" />
                  </div>
                </th>
                <th>
                  <div className="flex gap-2">
                    <span>Пол</span>
                    <SortButton sortFunc={handleSort} field="gender" />
                  </div>
                </th>
                <th>Роль</th>
                <th>
                  <div />{" "}
                </th>
              </tr>
            </thead>

            <tbody ref={listRef}>
              <tr className="h-4 bg-transparent" />
              {sortedData.length > 0 ? (
                sortedData.map((user) => (
                  <tr
                    key={user.id}
                    className=" mb-2 [&>td]:px-3 h-[35px] border-0 border-b border-solid border-gray-200 hover:shadow-md "
                  >
                    <td>
                      <div className="flex gap-2">
                        <img
                          width={30}
                          height={30}
                          className="rounded-xl"
                          src={user.avatar}
                          alt={`avatar${user.last_name}`}
                        />
                        <p>{user.last_name}</p>
                        <p>{user.first_name}</p>
                      </div>
                    </td>
                    <td className="text-left">{user.email}</td>
                    <td>{convertDate(user.birthDate)}</td>
                    <td>{user.gender}</td>
                    <td>{user.work}</td>
                    <td>
                      <div className="flex gap-1">
                        <Delete
                          width={25}
                          height={25}
                          className="cursor-pointer"
                          onClick={() => handleDelete(user.id)}
                        />
                        <Redact
                          width={25}
                          height={25}
                          className="cursor-pointer"
                          onClick={() => handleChange(user.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>no users</tr>
              )}
            </tbody>
          </table>
        </div>
        {isFetching && <p>Loading...</p>}
      </div>
    </>
  );
};

export default memo(Home);
