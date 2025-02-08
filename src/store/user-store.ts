import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import type { User } from '@/types/user';

// Define the state interface
interface UserState {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

// Properly typed state creator
const userStoreCreator: StateCreator<UserState> = (set) => ({
  user: null,
  error: null,
  isLoading: false,
  setUser: (user) => {
    set(() => ({ user }));
  },
  setError: (error) => {
    set(() => ({ error })); 
  },
  setLoading: (isLoading) => {
    set(() => ({ isLoading })); 
  },
});

// Create Zustand store with correct typing
export const useUserStore = create<UserState>(userStoreCreator);
