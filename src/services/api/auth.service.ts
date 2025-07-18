import API from '@/lib/axios';
import { errorHandler } from '@/lib/error-handler';
import { User } from '@/types/user';
import { useAuthStore } from '@/store/auth-store';

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ResetPasswordData {
  email: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

class AuthService {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const response = await API.post<AuthResponse>('/auth/signup', data);
      
      // Store auth data
      const { access_token, user } = response.data;
      useAuthStore.getState().setAuthToken(access_token);
      useAuthStore.getState().setUser(user);
      
      return response.data;
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to create account. Please try again.',
      });
    }
  }

  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const response = await API.post<AuthResponse>('/auth/login', data);
      
      // Store auth data
      const { access_token, user } = response.data;
      useAuthStore.getState().setAuthToken(access_token);
      useAuthStore.getState().setUser(user);
      
      return response.data;
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Invalid email or password.',
      });
    }
  }

  async signOut(): Promise<void> {
    try {
      // Clear local auth state first
      useAuthStore.getState().logout();
      
      // Optional: Call logout endpoint if available
      // await API.post('/auth/logout');
    } catch (error) {
      // Always clear local state even if API call fails
      useAuthStore.getState().logout();
      
      errorHandler.handle(error, {
        showToast: false,
        logError: true,
      });
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<void> {
    try {
      await API.post('/auth/reset-password', data);
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to send reset email. Please try again.',
      });
    }
  }

  async updatePassword(data: UpdatePasswordData): Promise<void> {
    try {
      await API.patch('/auth/update-password', data);
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to update password. Please check your current password.',
      });
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const response = await API.post<{ access_token: string }>('/auth/refresh');
      const { access_token } = response.data;
      
      // Update stored token
      useAuthStore.getState().setAuthToken(access_token);
      
      return access_token;
    } catch (error) {
      // If refresh fails, logout user
      useAuthStore.getState().logout();
      
      throw errorHandler.handle(error, {
        showToast: false,
        logError: true,
      });
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      await API.get('/auth/validate');
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();