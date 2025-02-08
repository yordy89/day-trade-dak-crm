import { useMutation } from '@tanstack/react-query';
import API from '@/lib/axios';
import { useAuthStore } from '@/store/auth-store';
import { createLogger, LogLevel } from '@/lib/logger';

const logger = createLogger({
  prefix: '[App]',
  level: LogLevel.ALL,
});

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLogin = () => {
  const setAuthToken = useAuthStore((state) => state.setAuthToken);
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await API.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      setUser(data.user);
    },
    onError: (error: Error) => {
      logger.error(error.message);
    },
  });
};
