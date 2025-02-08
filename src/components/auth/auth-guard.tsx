'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { LogLevel, createLogger } from '@/lib/logger';
import { useAuthStore } from '@/store/auth-store';
import { useFetchUser } from '@/hooks/use-fetch-user';

export interface AuthGuardProps {
  children: React.ReactNode;
}

const logger = createLogger({
  prefix: '[AuthGuard]', 
  level: LogLevel.ALL,
});

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const user = useAuthStore((state) => state.user); // Get user from Zustand store
  const { isLoading, error } = useFetchUser(); // Fetch user session
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  const checkPermissions = React.useCallback((): void => {
    if (isLoading) {
      return; // Still loading, don't check permissions yet
    }

    if (error) {
      setIsChecking(false); // If there's an error, stop checking and show it
      return;
    }

    if (!user) {
      logger.debug('[AuthGuard]: User is not logged in, redirecting to sign in');
      router.replace(paths.auth.signIn); // Redirect to sign-in page
      return;
    }

    setIsChecking(false); // User is authenticated
  }, [isLoading, error, user, router]);

  React.useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  if (isChecking || isLoading) {
    return null; // Render nothing while checking permissions or loading user
  }

  if (error) {
    return <Alert severity="error">{error.message || 'An error occurred while checking authentication.'}</Alert>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
