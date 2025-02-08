import { User } from '@/types/user';
import { create } from 'zustand';

interface AuthState {
  user: User | null; // Replace `any` with your User type
  authToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: any | null) => void;
  setAuthToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  authToken: null,
  isAuthenticated: false,
  setUser: (user) => set(() => ({ user, isAuthenticated: Boolean(user) })),
  setAuthToken: (token) => set(() => ({ authToken: token })),
  logout: () =>
    set(() => ({
      user: null,
      authToken: null,
      isAuthenticated: false,
    })),
}));
