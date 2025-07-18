import API from '@/lib/axios';
import { errorHandler } from '@/lib/error-handler';
import type { User } from '@/types/user';

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profileImage?: string;
}

export interface UploadProfileImageData {
  file: File;
}

class UserService {
  async getCurrentUser(): Promise<User> {
    try {
      const response = await API.get<User>('/users/profile');
      
      // Don't update store here - let the calling hook handle it
      
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load user profile.',
      });
      throw new Error(apiError.message);
    }
  }

  async updateUser(data: UpdateUserData): Promise<User> {
    try {
      const response = await API.patch<User>('/users/profile', data);
      
      // Don't update store here - let the calling hook handle it
      
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to update profile.',
      });
      throw new Error(apiError.message);
    }
  }

  async uploadProfileImage(file: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      
      const response = await API.post<{ imageUrl: string }>(
        '/users/upload-profile-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Don't update store here - let the calling hook handle it
      
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to upload profile image.',
      });
      throw new Error(apiError.message);
    }
  }

  async updateTradingPhase(phase: number): Promise<User> {
    try {
      const response = await API.patch<User>('/users/trading-phase', { phase });
      
      // Don't update store here - let the calling hook handle it
      
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to update trading phase.',
      });
      throw new Error(apiError.message);
    }
  }

  async getSubscriptions(): Promise<string[]> {
    try {
      const response = await API.get<{ subscriptions: string[] }>('/users/subscriptions');
      return response.data.subscriptions;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load subscriptions.',
      });
      throw new Error(apiError.message);
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await API.delete(`/users/subscriptions/${subscriptionId}`);
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to cancel subscription.',
      });
      throw new Error(apiError.message);
    }
  }

  // Admin endpoints
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<{
    users: User[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const response = await API.get('/users', { params });
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load users.',
      });
      throw new Error(apiError.message);
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const response = await API.get<User>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load user details.',
      });
      throw new Error(apiError.message);
    }
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    try {
      const response = await API.patch<User>(`/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to update user role.',
      });
      throw new Error(apiError.message);
    }
  }
}

export const userService = new UserService();