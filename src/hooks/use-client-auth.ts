'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Role } from '@/types/user';

// Simple client-only auth hook
export function useClientAuth() {
  const [mounted, setMounted] = useState(false);
  
  // Direct store access - only use specific selectors
  const user = useAuthStore((state) => state.user);
  const authToken = useAuthStore((state) => state.authToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Return null values during SSR/initial render
  if (!mounted) {
    return {
      user: null,
      authToken: null,
      isAuthenticated: false,
      userSubscriptions: [],
      userRole: Role.USER,
      isLoading: true,
    };
  }
  
  // Return actual values after mount
  return {
    user,
    authToken,
    isAuthenticated,
    userSubscriptions: user?.subscriptions || [],
    userRole: user?.role || Role.USER,
    isLoading: false,
  };
}