import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { updateUserByIdPatch, updateUserByIdPut } from "../../api/users/users";
import { ReactComponent as SuccessIcon } from "../../assets/succes.svg";
import getAllUserCash from "../../hooks/useGetAllUserCash";
import profileFormSchema from "../../schema/profileForm";
import { IUserAllLocalStorage, NewUser } from "../../type/user.interface";
import CustomButton from "../../ui/CustomButton";
import ErrorMessage from "../../ui/ErrorMessage";
import convertDate from "../../utils/convertDate";
import randomInteger from "../../utils/getRandomNumber";

interface Props {
  defaultId: number | null;
  close: () => void;
}

const SimpleForm = ({ defaultId, close }: Props) => {
  const data = getAllUserCash();
  const queryClient = useQueryClient();

  const defaultUser = useMemo(() => {
    const newDef = data?.data.find((user) => user.id === defaultId);
    if (defaultId && newDef) {
      return {
        ...newDef,
        birthDate: convertDate(newDef.birthDate),
      };
    }

    return undefined;
  }, [data, data?.data]);

  const {
    mutate: updateMutateUser,
    isLoading: loadingUpdateUser,
    isSuccess: successUpdateUser,
    isError: errorUpdateUser,
  } = useMutation({
    mutationKey: ["update user", defaultUser?.id],
    mutationFn: ({ uid, dataForm }: { uid: number; dataForm: NewUser }) => {
      return updateUserByIdPatch(uid, dataForm);
    },
    onSuccess: (_, { dataForm }) => {
      if (!data) return;

      queryClient.setQueryData<IUserAllLocalStorage>(
        ["get all users"],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            data: old.data.map((user) => {
              if (user.id === dataForm.id) {
                return {
                  ...dataForm,
                };
              }

              return user;
            }),
          };
        }
      );
    },
  });

  const {
    mutate: createMutateUser,
    isLoading: loadingCreateUser,
    isSuccess: successCreateUser,
    isError: errorCreateUser,
  } = useMutation({
    mutationKey: ["create user"],
    mutationFn: ({ uid, dataForm }: { uid: number; dataForm: NewUser }) => {
      return updateUserByIdPut(uid, dataForm);
    },
    onSuccess: (_, variables) => {
      const { dataForm } = variables;
      console.log(variables);
      console.log(dataForm);
      queryClient.setQueryData<IUserAllLocalStorage>(
        ["get all users"],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            data: [...old.data, dataForm],
          };
        }
      );
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileFormSchema),
    mode: "onBlur",
    defaultValues: defaultUser,
    shouldFocusError: true,
    reValidateMode: "onSubmit",
  });

  const gender = watch("gender");
  const work = watch("work");
  const selectWork = getValues("work");
  const [workOptions, setWorkOptions] = useState([
    "Доктор",
    "Медсестра/Медбрат",
    "Админ",
  ]);

  useEffect(() => {
    console.log(work);
  }, [work]);

  useEffect(() => {
    switch (gender) {
      case "женщина":
        switch (selectWork) {
          case "Медбрат":
            setWorkOptions(["Доктор", "Медсестра", "Админ"]);
            setValue("work", "Медсестра");
            break;
          default:
            setWorkOptions(["Доктор", "Медсестра", "Админ"]);
            break;
        }
        break;
      case "мужчина":
        switch (selectWork) {
          case "Медсестра":
            setWorkOptions(["Доктор", "Медбрат", "Админ"]);
            setValue("work", "Медбрат");
            break;
          default:
            setWorkOptions(["Доктор", "Медбрат", "Админ"]);
            break;
        }
        break;
      default:
        setWorkOptions(["Доктор", "Медсестра/Медбрат", "Админ"]);
        break;
    }
  }, [gender, setValue]);

  const onSubmit = (newDate: any) => {
    // Преобразуем дату рождения в миллисекунды
    const birthDateInMilliseconds = new Date(newDate.birthDate).getTime();
    const uuid = randomInteger(10, 1000);

    const formData = {
      ...newDate,
      birthDate: birthDateInMilliseconds,
      id: defaultUser?.id || uuid,
      avatar:
        defaultUser?.avatar ||
        "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100270.jpg",
    };

    if (defaultUser && defaultUser.id) {
      console.log(formData);
      return updateMutateUser({ uid: defaultUser.id, dataForm: formData });
    }

    return createMutateUser({
      dataForm: formData,
      uid: uuid,
    });
  };

  if (successUpdateUser || successCreateUser) {
    return (
      <div className="p-4 flex flex-col justify-center items-center gap-4">
        <SuccessIcon width={80} height={80} />
        <p>Данные успешно сохранены</p>
        <CustomButton styleBtn="cancel" type="button" onClick={close}>
          Close
        </CustomButton>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="[&>div]:border-0 [&>div]:border-b-[0.5px] [&>div]:border-solid
      [&>div]:border-gray-400 border-gray-400
      [&>div]:w-[500px] [&>div]:text-center
      flex flex-col gap-3 items-center"
    >
      <div>
        <label htmlFor="first_name">
          <p> First Name</p>
          <input
            className="w-full border-solid p-2
          rounded-xl border-[0.5px] border-gray-400"
            id="first_name"
            {...register("first_name")}
          />
        </label>
        {errors.first_name && (
          <ErrorMessage message={errors.first_name.message} />
        )}
      </div>

      <div>
        <label htmlFor="last_name">
          <p> Last Name</p>
          <input
            className="w-full border-solid p-2
          rounded-xl border-[0.5px] border-gray-400"
            id="last_name"
            {...register("last_name")}
          />
        </label>

        {errors.last_name && (
          <ErrorMessage message={errors.last_name.message} />
        )}
      </div>

      <div className="">
        <select
          className="w-full border-solid p-2
            rounded-xl border-[0.5px] border-gray-400"
          id="gender"
          {...register("gender")}
        >
          <option value="">Выберите пол</option>
          <option value="мужчина">Мужчина</option>
          <option value="женщина">Женщина</option>
        </select>
        {errors.gender && <ErrorMessage message={errors.gender.message} />}
      </div>

      <div>
        <label htmlFor="birthDate">
          <p> Birth Date</p>
          <input
            className="w-full border-solid p-2
            rounded-xl border-[0.5px] border-gray-400"
            type="date"
            id="birthDate"
            {...register("birthDate")}
          />
        </label>

        {errors.birthDate && (
          <ErrorMessage message={errors.birthDate.message} />
        )}
      </div>

      <div>
        <Controller
          name="work"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              id="work"
              className="w-full border-solid p-2
            rounded-xl border-[0.5px] border-gray-400"
            >
              <option value="">Выберите профессию</option>
              {workOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        />

        {errors.work && <ErrorMessage message={errors.work.message} />}
      </div>

      <div>
        <label htmlFor="email">
          <p>Email</p>
          <input
            className="w-full border-solid p-2
            rounded-xl border-[0.5px] border-gray-400"
            id="email"
            type="email"
            {...register("email")}
          />
        </label>

        {errors.email && <ErrorMessage message={errors.email.message} />}
      </div>

      <div className="flex gap-2 justify-center">
        <CustomButton styleBtn="save" type="submit">
          {loadingUpdateUser || loadingCreateUser ? <>Loading...</> : <>Save</>}
        </CustomButton>
        <CustomButton styleBtn="cancel" type="button" onClick={close}>
          Close
        </CustomButton>
      </div>
      {errorUpdateUser ||
        (errorCreateUser && (
          <ErrorMessage message="Не удалось сохранить данные" />
        ))}
    </form>
  );
};

export default SimpleForm;
