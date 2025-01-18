import { IParametersRequest } from '../../type/filterParams.interface';
import {
  IGetAllUsers,
  IUpdateUser,
  IUserById,
  NewUser,
} from '../../type/user.interface';
import apiClassic from '../api-config';

/**
 * @description запрос на получение списка users
 */

export const getAllUser = (params?: IParametersRequest) =>
  apiClassic.get<IGetAllUsers>('/users', { params });

/**
 * @description запрос на получение user по id
 */

export const getUserById = (id: number) =>
  apiClassic.get<IUserById>(`/users/${id}`);

/**
 * @description запрос на обновление user по id
 * put - полная перезапись
 */

export const updateUserByIdPut = (uid: number, data: NewUser) =>
  apiClassic.put<IUpdateUser>(`/users/${uid}`, {
    data,
  });

/**
 * @description запрос на обновление user по id
 * patch - частичная перезапись
 */

export const updateUserByIdPatch = (id: number, data: NewUser) =>
  apiClassic.patch<IUpdateUser>(`/users/${id}`, {
    data,
  });

/**
 * @description запрос на удаление user по id
 */

export const deleteUserById = (id: number) => apiClassic.delete(`/users/${id}`);
