'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { selectLogout } from '@/store/auth-selectors';

export function useLogout() {
  const router = useRouter();
  const logoutFromStore = useAuthStore(selectLogout);
  
  const logout = useCallback(() => {
    logoutFromStore();
    router.push('/auth/sign-in');
  }, [logoutFromStore, router]);
  
  return logout;
}