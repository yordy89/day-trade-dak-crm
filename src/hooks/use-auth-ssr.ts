'use client';

import { useCallback, useRef } from 'react';
import { useSyncExternalStore } from 'react';
import { useAuthStore } from '@/store/auth-store';
import type { AuthState } from '@/store/auth-store';

// Server-side snapshot (always returns the same object)
const serverSnapshot = {
  user: null,
  authToken: null,
  isAuthenticated: false,
  hasHydrated: false,
  userSubscriptions: [],
  userRole: 'USER' as const,
  isLoading: true,
};

const getServerSnapshot = () => serverSnapshot;

// Custom hook that works with SSR
export function useAuthSSR() {
  const snapshotRef = useRef<any>(null);
  
  const getSnapshot = useCallback(() => {
    const state = useAuthStore.getState();
    const hasHydrated = state._hasHydrated ?? false;
    
    const newSnapshot = {
      user: hasHydrated ? state.user : null,
      authToken: hasHydrated ? state.authToken : null,
      isAuthenticated: hasHydrated ? state.isAuthenticated : false,
      hasHydrated,
      userSubscriptions: hasHydrated ? (state.user?.subscriptions || []) : [],
      userRole: hasHydrated ? (state.user?.role || 'USER') : 'USER',
      isLoading: !hasHydrated,
    };
    
    // Only update the ref if the data actually changed
    if (!snapshotRef.current || 
        snapshotRef.current.user !== newSnapshot.user ||
        snapshotRef.current.authToken !== newSnapshot.authToken ||
        snapshotRef.current.isAuthenticated !== newSnapshot.isAuthenticated ||
        snapshotRef.current.hasHydrated !== newSnapshot.hasHydrated) {
      snapshotRef.current = newSnapshot;
    }
    
    return snapshotRef.current;
  }, []);
  
  const subscribe = useCallback((callback: () => void) => {
    const unsubscribe = useAuthStore.subscribe(callback);
    return unsubscribe;
  }, []);

  const authData = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return authData;
}