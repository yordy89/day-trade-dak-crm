import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  authToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setPhase: (phase: number) => void;
  setAuthToken: (token: string | null) => void;
  logout: () => void;
  _hasHydrated?: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      authToken: null,
      isAuthenticated: false,
      
      setUser: (user) => {
        set(() => ({ user, isAuthenticated: Boolean(user) }));
      },

      setPhase: (phase) => set((state) => ({
        user: { ...state.user!, tradingPhase: phase }
      })),

      setAuthToken: (token) => {
        set(() => ({ authToken: token }));
      },

      logout: () => {
        localStorage.removeItem('auth-storage');
        // set(() => ({
        //   user: null,
        //   authToken: null,
        //   isAuthenticated: false,
        // }));
      },

      _hasHydrated: false,
      setHasHydrated: (state) => {
        set(() => ({ _hasHydrated: state }));
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        authToken: state.authToken,
        isAuthenticated: state.isAuthenticated,
        user: state.user, // ✅ Persist user info
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
