import classNames from "classnames";
import { ChangeEvent, useCallback, useMemo, useState } from "react";

import getAllUserCash from "../../hooks/useGetAllUserCash";
import SimpleForm from "../createProfile.tsx/CreateProfile";
import Popup from "../popup/Popup";

const UserSearchInput = () => {
  const data = getAllUserCash();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const search = useMemo(() => {
    if (!searchTerm || !data) return [];

    return data.data.filter((user) => {
      return user.last_name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, data]);

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  }, []);

  const resetSearchTerm = () => {
    setSearchTerm("");
  };

  const handleAddUser = useCallback(() => {
    toggleOpen();
  }, [toggleOpen]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = search.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(search.length / usersPerPage);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {isOpen && (
        <Popup isOpen={isOpen} onClose={toggleOpen}>
          <SimpleForm defaultId={null} close={toggleOpen} />
        </Popup>
      )}
      <div className="flex flex-col bg-[#f2f4f7] rounded-lg p-2 relative ">
        <input
          type="text"
          placeholder="Поиск по фамилии"
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm && (
          <button
            type="button"
            className="absolute px-2 right-2 border-solid border-[0.5px]
            transition-all border-gray-400 rounded-2xl hover:shadow-lg"
            onClick={resetSearchTerm}
          >
            X
          </button>
        )}
        <div
          className="transition-all h-fit absolute top-[50px]
        w-full text-left left-0 bg-white z-10 rounded-xl shadow-lg overflow-hidden"
        >
          {searchTerm.length > 0 && (
            <>
              <ul className="[&>li]:h-[44px] [&>li]:px-2 [&>li]:py-2 border-solid border-[1px] rounded-xl border-gray-300 ">
                {currentUsers.length ? (
                  currentUsers.map((user) => {
                    const lastName = user.last_name;
                    const regex = new RegExp(`(${searchTerm})`, "i");
                    const parts = lastName.split(regex);

                    return (
                      <li
                        key={user.id}
                        className="px-1 py-2  border-0 border-b border-solid border-gray-200 hover:shadow-md"
                      >
                        {parts.map((part) =>
                          regex.test(part) ? (
                            <span key={`${part}`} className="text-black">
                              {part}
                            </span>
                          ) : (
                            <span key={part} className="text-gray-400">
                              {part}
                            </span>
                          )
                        )}
                        <span className="ml-2 text-gray-400">
                          {user.first_name}
                        </span>
                      </li>
                    );
                  })
                ) : (
                  <>
                    <li>
                      <span className="text-xs font-normal">
                        Пользователя с такими параметрами не найден, проверьте
                        правильность написания или создайте нового!
                      </span>
                    </li>
                    <li className="bg-[#4DA2D6] transition-all text-cyan-50 !p-0 hover:bg-[#2f5772]">
                      <button
                        type="button"
                        onClick={handleAddUser}
                        className="w-full text-left h-full px-2 "
                      >
                        + Добавить пользователя
                      </button>
                    </li>
                  </>
                )}
              </ul>
              {search.length > usersPerPage ? (
                <div className="flex justify-start m-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => handlePageClick(index + 1)}
                      className={classNames(
                        "px-2 py-1 mx-1 rounded bg-gray-200",
                        {
                          "bg-blue-500 text-white": currentPage === index + 1,
                        }
                      )}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              ) : search.length ? (
                <button
                  type="button"
                  className="px-2 py-1 m-2 bg-gray-200 rounded"
                >
                  1
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserSearchInput;
