// Stable selectors for auth store to prevent infinite loops
// Always use these selectors instead of inline functions

import type { AuthState } from './auth-store';

export const selectUser = (state: AuthState) => state.user;
export const selectAuthToken = (state: AuthState) => state.authToken;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectSetUser = (state: AuthState) => state.setUser;
export const selectSetPhase = (state: AuthState) => state.setPhase;
export const selectSetAuthToken = (state: AuthState) => state.setAuthToken;
export const selectLogout = (state: AuthState) => state.logout;
export const selectHasHydrated = (state: AuthState) => state._hasHydrated ?? false;
export const selectSetHasHydrated = (state: AuthState) => state.setHasHydrated;

// Computed selectors
export const selectUserSubscriptions = (state: AuthState) => state.user?.subscriptions || [];
export const selectUserRole = (state: AuthState) => state.user?.role || 'USER';
export const selectUserFirstName = (state: AuthState) => state.user?.firstName || '';
export const selectUserLastName = (state: AuthState) => state.user?.lastName || '';
export const selectUserEmail = (state: AuthState) => state.user?.email || '';
export const selectUserProfileImage = (state: AuthState) => state.user?.profileImage || '';