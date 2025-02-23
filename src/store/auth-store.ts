import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { User } from '@/types/user';

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
        console.log("[AuthStore] Updating user:", user);
        set(() => ({ user, isAuthenticated: Boolean(user) }));
      },

      setPhase: (phase) => set((state) => ({
        user: { ...state.user!, tradingPhase: phase }
      })),

      setAuthToken: (token) => {
        console.log("[AuthStore] Updating authToken:", token);
        set(() => ({ authToken: token }));
      },

      logout: () => {
        console.log("[AuthStore] Logging out...");
        localStorage.removeItem('auth-storage');
        // set(() => ({
        //   user: null,
        //   authToken: null,
        //   isAuthenticated: false,
        // }));
      },

      _hasHydrated: false,
      setHasHydrated: (state) => {
        console.log("[AuthStore] Hydration complete:", state);
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
