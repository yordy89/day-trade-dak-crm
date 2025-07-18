import API from '@/lib/axios';
import { errorHandler } from '@/lib/error-handler';
import { User } from '@/types/user';

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
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load user profile.',
      });
    }
  }

  async updateUser(data: UpdateUserData): Promise<User> {
    try {
      const response = await API.patch<User>('/users/profile', data);
      
      // Don't update store here - let the calling hook handle it
      
      return response.data;
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to update profile.',
      });
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
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to upload profile image.',
      });
    }
  }

  async updateTradingPhase(phase: number): Promise<User> {
    try {
      const response = await API.patch<User>('/users/trading-phase', { phase });
      
      // Don't update store here - let the calling hook handle it
      
      return response.data;
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to update trading phase.',
      });
    }
  }

  async getSubscriptions(): Promise<string[]> {
    try {
      const response = await API.get<{ subscriptions: string[] }>('/users/subscriptions');
      return response.data.subscriptions;
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load subscriptions.',
      });
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await API.delete(`/users/subscriptions/${subscriptionId}`);
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to cancel subscription.',
      });
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
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load users.',
      });
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const response = await API.get<User>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load user details.',
      });
    }
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    try {
      const response = await API.patch<User>(`/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to update user role.',
      });
    }
  }
}

export const userService = new UserService();