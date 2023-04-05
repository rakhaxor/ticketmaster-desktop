import axios from 'axios';
import {EnhancedStore} from '@reduxjs/toolkit/src/configureStore';
import { logout } from '@renderer/redux/slices/authSlice';

let store: EnhancedStore<any, any, [any]>;

export const injectStore = (_store: EnhancedStore<any, any, [any]>): void => {
  store = _store;
};

const axiosClient = axios.create({
  baseURL: window.baseURL || 'https://fan.basicsms.com/fan/basicsms/api/v1',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN': window.csrfToken || '',
    Accept: 'application/json',
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(config => {
  const { token } = store.getState().auth;
  if (config?.headers) {
    if (token) {
      config.headers.Authorization = `Bearer ${store.getState().auth.token}`;
    }
  }

  return config;
});

axiosClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401 && error.config.url !== '/login') {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
