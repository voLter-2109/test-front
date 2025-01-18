import * as yup from "yup";

const minDate = new Date();
minDate.setFullYear(minDate.getFullYear() - 18);

const profileFormSchema = yup.object().shape({
  gender: yup.string().required("Пол обязателен"),
  birthDate: yup
    .string()
    .required("Дата рождения обязательна")
    .test("is-valid-date", "Вы должны быть старше 18 лет", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date <= minDate;
    }),
  work: yup.string().required("Профессия обязательна"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  first_name: yup
    .string()
    .matches(/^[A-Za-zА-Яа-яЁё]+$/, "Разрешены только буквенные символы")
    .required("First name is required"),
  last_name: yup
    .string()
    .matches(/^[A-Za-zА-Яа-яЁё]+$/, "Разрешены только буквенные символы")
    .required("Last name is required"),
});

export default profileFormSchema;
