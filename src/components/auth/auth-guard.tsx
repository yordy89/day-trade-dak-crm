'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { createLogger, LogLevel } from '@/lib/logger';
import { useFetchUser } from '@/hooks/use-fetch-user';

export interface AuthGuardProps {
  children: React.ReactNode;
}

const logger = createLogger({
  prefix: '[AuthGuard]',
  level: LogLevel.ALL,
});

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  console.log("[AuthGuard] Rendering...");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authToken = useAuthStore((state) => state.authToken);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  console.log("[AuthGuard] Zustand hydration status:", hasHydrated);
  const { isLoading, error } = useFetchUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);
  React.useEffect(() => {
    if (!hasHydrated || isLoading) return;
  
    if (!authToken && (!user || error)) {
      logger.debug('[AuthGuard]: User is not logged in, redirecting to sign in');
      router.replace(paths.auth.signIn);
      return;
    }
  
    setIsChecking(false);
  }, [isLoading, error, user, authToken, router, hasHydrated]);
  
  if (!hasHydrated || isChecking || isLoading) {
    return null; // Render nothing while Zustand is rehydrating
  }

  if (error) {
    return <Alert severity="error">{error.message || 'An error occurred while checking authentication.'}</Alert>;
  }

  return <>{children}</>;
}
