import { ApiService } from './index';
import ENV from '../config/env';
import axios from 'axios';

export const GET_ALL_COUNTRIES = async () => {
  return await axios({
    method: ApiService.GET,
    baseURL: ENV.X_CSCAPI_API_URL,
    url: '/countries',
    headers: {
      'X-CSCAPI-KEY': ENV.X_CSCAPI_API_KEY,
    },
  });
};

export const GET_STATES_BY_COUNTRY = async (id: string) => {
  return await axios({
    method: ApiService.GET,
    baseURL: ENV.X_CSCAPI_API_URL,
    url: `countries/${id}/states`,
    headers: {
      'X-CSCAPI-KEY': ENV.X_CSCAPI_API_KEY,
    },
  });
};

export const GET_CITIES_BY_STATE_AND_COUNTRY = async (countryId: string, stateId: string) => {
  return await axios({
    method: ApiService.GET,
    baseURL: ENV.X_CSCAPI_API_URL,
    url: `countries/${countryId}/states/${stateId}/cities`,
    headers: {
      'X-CSCAPI-KEY': ENV.X_CSCAPI_API_KEY,
    },
  });
};
