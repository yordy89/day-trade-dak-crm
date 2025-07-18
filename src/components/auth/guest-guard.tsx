'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { LogLevel, createLogger } from '@/lib/logger';
import { useClientAuth } from '@/hooks/use-client-auth';
import { useFetchUser } from '@/hooks/use-fetch-user';

export interface GuestGuardProps {
  children: React.ReactNode;
}

const logger = createLogger({
  prefix: '[AuthGuard]', 
  level: LogLevel.ALL,
});

export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user } = useClientAuth(); // Use client auth hook
  const { isLoading, error } = useFetchUser(); // Fetch user session
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  const checkPermissions = React.useCallback((): void => {
    if (isLoading) {
      return; // Wait for the session fetch to complete
    }

    if (error) {
      setIsChecking(false); // Stop checking if an error occurs
      return;
    }

    if (user) {
      logger.debug('[GuestGuard]: User is logged in, redirecting to academy');
      router.replace(paths.academy.overview); // Redirect authenticated users to the academy
      return;
    }

    setIsChecking(false); // Allow rendering for unauthenticated users
  }, [isLoading, error, user, router]);

  React.useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  if (isChecking || isLoading) {
    return null; // Render nothing while checking permissions or fetching session
  }

  if (error) {
    return <Alert severity="error">{error.message || 'An error occurred while checking authentication.'}</Alert>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
