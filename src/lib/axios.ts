import { paths } from '@/paths';
import { useAuthStore } from '@/store/auth-store';
import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { errorHandler } from './error-handler';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const API_VERSION = 'v1';

const API = axios.create({
  baseURL: `${API_URL}/api/${API_VERSION}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token
    const token = useAuthStore.getState().authToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add correlation ID for request tracking
    const correlationId = errorHandler.generateCorrelationId();
    config.headers['X-Correlation-Id'] = correlationId;

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        correlationId,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    errorHandler.handle(error, {
      showToast: false,
      logError: true,
    });
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error: AxiosError) => {
    // Extract error details
    const message = (error.response?.data as any)?.message || '';
    const statusCode = error.response?.status;

    // Handle authentication errors
    const isAuthError = statusCode === 401;
    const isTokenExpired = 
      isAuthError && (
        message.includes('token expired') ||
        message.includes('jwt expired') ||
        message.includes('Invalid or expired token')
      );

    if (isTokenExpired && typeof window !== 'undefined') {
      console.warn('[Auth] Token expired, redirecting to login');
      useAuthStore.getState().logout();
      
      // Don't show error toast for token expiration
      errorHandler.handle(error, {
        showToast: false,
        logError: true,
      });
      
      window.location.href = paths.auth.signIn;
      return Promise.reject(error);
    }

    // Handle other auth errors (invalid credentials, etc.)
    if (isAuthError && !isTokenExpired) {
      // Show error but don't redirect
      errorHandler.handle(error, {
        showToast: true,
        logError: true,
      });
      return Promise.reject(error);
    }

    // Handle rate limiting
    if (statusCode === 429) {
      errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Too many requests. Please slow down and try again.',
      });
      return Promise.reject(error);
    }

    // Handle all other errors
    // For 400 errors, let the component handle the toast to avoid duplicates
    // For 404 errors on video-classes endpoint, don't log since it's expected
    const isVideoClassesEndpoint = error.config?.url?.includes('/video-classes');
    const isExpected404 = statusCode === 404 && isVideoClassesEndpoint;
    const shouldShowToast = statusCode !== 400 && !isExpected404;
    const shouldLogError = !isExpected404;
    
    if (shouldLogError) {
      errorHandler.handle(error, {
        showToast: shouldShowToast,
        logError: true,
      });
    }

    return Promise.reject(error);
  }
);

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return response.data.status === 'ok';
  } catch {
    return false;
  }
};

export default API;
