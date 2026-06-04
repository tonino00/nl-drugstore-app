import type { AxiosInstance } from 'axios';
import toast from 'react-hot-toast';

import api from './api';
import { logout } from '../store/slices/authSlice';

type MinimalStore = {
  getState: () => any;
  dispatch: (action: any) => any;
};

let initialized = false;
let sessionExpiredNotified = false;

export const setupApiInterceptors = (store: MinimalStore, client: AxiosInstance = api) => {
  if (initialized) return;
  initialized = true;

  client.interceptors.request.use(
    (config) => {
      const token = store.getState().auth?.csrfToken;
      if (token) {
        config.headers = config.headers || {};
        config.headers['X-CSRF-Token'] = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        store.dispatch(logout());
        if (!sessionExpiredNotified) {
          sessionExpiredNotified = true;
          toast.error('Sessão expirada. Faça login novamente.');
        }
      }
      return Promise.reject(error);
    }
  );
};
