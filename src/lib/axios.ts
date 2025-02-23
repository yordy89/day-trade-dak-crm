import axios from 'axios';
import { useAuthStore } from '@/store/auth-store';

const API = axios.create({
  baseURL: "http://localhost:3000",
});

API.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().authToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
