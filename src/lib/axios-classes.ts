import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { errorHandler } from './error-handler';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const API_VERSION = 'v1';

const ClassesAPI = axios.create({
  baseURL: `${API_URL}/api/${API_VERSION}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
ClassesAPI.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token from localStorage
    const authStorage = localStorage.getItem('auth-storage');
    const authData = authStorage ? JSON.parse(authStorage) : null;
    const token = authData?.state?.authToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add correlation ID for request tracking
    const correlationId = errorHandler.generateCorrelationId();
    config.headers['X-Correlation-Id'] = correlationId;

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Classes API Request] ${config.method?.toUpperCase()} ${config.url}`, {
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
ClassesAPI.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Classes API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
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

    // Handle authentication errors for classes
    const isAuthError = statusCode === 401;
    const isTokenExpired = 
      isAuthError && (
        message.includes('token expired') ||
        message.includes('jwt expired') ||
        message.includes('Invalid or expired token')
      );

    if (isTokenExpired && typeof window !== 'undefined') {
      console.warn('[Classes Auth] Token expired, redirecting to classes login');
      
      // Clear auth storage
      localStorage.removeItem('auth-storage');
      
      // Don't show error toast for token expiration
      errorHandler.handle(error, {
        showToast: false,
        logError: true,
      });
      
      // Redirect to classes login instead of global login
      window.location.href = '/classes/sign-in';
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
    const shouldShowToast = statusCode !== 400;
    
    errorHandler.handle(error, {
      showToast: shouldShowToast,
      logError: true,
    });

    return Promise.reject(error);
  }
);

export default ClassesAPI;