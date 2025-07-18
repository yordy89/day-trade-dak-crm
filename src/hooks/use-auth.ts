'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';

// Custom hook that ensures proper hydration and stable references
export function useAuth() {
  const [isClient, setIsClient] = useState(false);
  
  // Use shallow comparison for specific properties
  const user = useAuthStore((state) => state.user);
  const authToken = useAuthStore((state) => state.authToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state._hasHydrated ?? false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const isReady = isClient && hasHydrated;
  
  return {
    user: isReady ? user : null,
    authToken: isReady ? authToken : null,
    isAuthenticated: isReady ? isAuthenticated : false,
    hasHydrated: isReady,
    userSubscriptions: isReady ? (user?.subscriptions || []) : [],
    userRole: isReady ? (user?.role || 'USER') : 'USER',
    isLoading: !isReady,
  };
}