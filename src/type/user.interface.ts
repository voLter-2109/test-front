export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface NewUser {
  gender: 'мужчина' | 'женщина';
  birthDate: number;
  work: string;
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export type SortFields = 'birthDate' | 'last_name' | 'gender' | null;

export interface IUserById {
  data: IUser;
}

export interface Response {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface IGetAllUsers extends Response {
  data: IUser[];
}

export interface IUserAllLocalStorage extends Response {
  data: NewUser[];
}

export interface IUpdateUser {
  updatedAt: string;
}
