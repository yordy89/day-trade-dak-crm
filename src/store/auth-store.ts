import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { User } from '@/types/user';

export interface AuthState {
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
      
      setUser: (newUser) => {
        set(() => ({ user: newUser, isAuthenticated: Boolean(newUser) }));
      },

      setPhase: (newPhase) => set((state) => ({
        user: { ...state.user!, tradingPhase: newPhase }
      })),

      setAuthToken: (newToken) => {
        set(() => ({ authToken: newToken }));
      },

      logout: () => {
        set(() => ({
          user: null,
          authToken: null,
          isAuthenticated: false,
        }));
      },

      _hasHydrated: false,
      setHasHydrated: (hydrated) => {
        set(() => ({ _hasHydrated: hydrated }));
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
