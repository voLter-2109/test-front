import axios, { CreateAxiosDefaults } from 'axios';

import { SERVER_API } from '../constant/constants';

const mainApi: CreateAxiosDefaults = {
  baseURL: SERVER_API,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const apiClassic = axios.create(mainApi);
export default apiClassic;
