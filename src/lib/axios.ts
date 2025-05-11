import { paths } from '@/paths';
import { useAuthStore } from '@/store/auth-store';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const API = axios.create({
  baseURL: API_URL,
});

// Add token to each request
API.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().authToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || '';
    const isTokenExpired =
      error.response?.status === 401 &&
      (message.includes('token expired') ||
        message.includes('jwt expired') ||
        message.includes('Invalid or expired token'));

    if (isTokenExpired && typeof window !== 'undefined') {
      console.warn('[Auth] Token expired, triggering logout flag');
      useAuthStore.getState().logout();
      window.location.href = paths.auth.signIn;
    }

    return Promise.reject(error);
  }
);

export default API;
