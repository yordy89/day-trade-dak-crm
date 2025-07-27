import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SubscriptionPlan } from '@/types/user';
import type { User } from '@/types/user';

interface ClassesAuthState {
  isAuthenticated: boolean;
  hasAccess: boolean;
  loading: boolean;
  user: User | null;
}

export function useClassesAuth() {
  const router = useRouter();
  const [state, setState] = useState<ClassesAuthState>({
    isAuthenticated: false,
    hasAccess: false,
    loading: true,
    user: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      // Get token from localStorage (consistent with auth-store)
      const authStorage = localStorage.getItem('auth-storage');
      const authData = authStorage ? JSON.parse(authStorage) : null;
      const token = authData?.state?.authToken;
      
      if (!token) {
        setState({
          isAuthenticated: false,
          hasAccess: false,
          loading: false,
          user: null,
        });
        return;
      }

      // Check authentication
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // If 401 unauthorized, clear auth and redirect to classes login
        if (response.status === 401) {
          localStorage.removeItem('auth-storage');
          router.push('/classes/sign-in');
        }
        
        setState({
          isAuthenticated: false,
          hasAccess: false,
          loading: false,
          user: null,
        });
        return;
      }

      const user = await response.json();
      
      // Debug logging
      console.log('[useClassesAuth] User subscriptions:', user.subscriptions);
      console.log('[useClassesAuth] SubscriptionPlan.CLASSES:', SubscriptionPlan.CLASSES);
      
      // Check if user has Classes subscription
      const hasActiveClassesSubscription = user.subscriptions?.some((sub: any) => {
        if (typeof sub === 'string') {
          const hasAccess = sub === (SubscriptionPlan.CLASSES as string) || sub === 'Classes';
          console.log('[useClassesAuth] Checking string subscription:', sub, 'hasAccess:', hasAccess);
          return hasAccess;
        }
        // Check if subscription is Classes, active, and not expired
        const hasAccess = sub.plan === (SubscriptionPlan.CLASSES as string) && 
               (!sub.status || sub.status === 'active') &&
               (!sub.expiresAt || new Date(sub.expiresAt) > new Date()) &&
               sub.deleted !== true;
        console.log('[useClassesAuth] Checking object subscription:', sub.plan, 'status:', sub.status, 'hasAccess:', hasAccess);
        return hasAccess;
      }) || false;
      
      console.log('[useClassesAuth] Final hasActiveClassesSubscription:', hasActiveClassesSubscription);

      setState({
        isAuthenticated: true,
        hasAccess: hasActiveClassesSubscription,
        loading: false,
        user,
      });
    } catch (error) {
      console.error('[useClassesAuth] Error checking auth:', error);
      setState({
        isAuthenticated: false,
        hasAccess: false,
        loading: false,
        user: null,
      });
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return state;
}