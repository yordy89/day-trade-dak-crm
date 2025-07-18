import { useMutation } from '@tanstack/react-query';
import { authService, AuthResponse } from '@/services/api/auth.service';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLogin = () => {
  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      return authService.signIn(credentials);
    },
  });
};
