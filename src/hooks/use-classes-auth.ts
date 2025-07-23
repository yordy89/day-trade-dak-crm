import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SubscriptionPlan } from '@/types/user';

interface ClassesAuthState {
  isAuthenticated: boolean;
  hasAccess: boolean;
  loading: boolean;
  user: any | null;
}

export function useClassesAuth() {
  const router = useRouter();
  const [state, setState] = useState<ClassesAuthState>({
    isAuthenticated: false,
    hasAccess: false,
    loading: true,
    user: null,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
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
      
      // Check if user has Classes subscription
      const hasClassesAccess = user.activeSubscriptions?.includes(SubscriptionPlan.CLASSES) || 
                              user.role === 'super_admin' ||
                              user.customClassAccess?.reason;

      setState({
        isAuthenticated: true,
        hasAccess: hasClassesAccess,
        loading: false,
        user,
      });
    } catch (error) {
      console.error('Auth check error:', error);
      setState({
        isAuthenticated: false,
        hasAccess: false,
        loading: false,
        user: null,
      });
    }
  };

  return state;
}