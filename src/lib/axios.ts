import axios from 'axios';
import { useAuthStore } from '@/store/auth-store';

const API = axios.create({
  baseURL: 'https://your-api.com', // Replace with your API's base URL
});

// Add an interceptor to include the token in every request
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
