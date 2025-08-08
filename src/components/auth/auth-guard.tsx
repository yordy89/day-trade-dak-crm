'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CircularProgress, Box } from '@mui/material';
import { useClientAuth } from '@/hooks/use-client-auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

// List of public routes that don't require authentication
const publicRoutes = [
  '/',
  '/blog',
  '/about',
  '/contact',
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/reset-password',
  '/terms',
  '/privacy',
  '/events',
  '/academy/subscription/plans',
  '/academy/subscription/success',
];

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { authToken, isLoading: authLoading } = useClientAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) {
      return;
    }

    // Check if the current route is public
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname?.startsWith(`${route}/`)
    );

    if (isPublicRoute) {
      setIsAuthenticated(true);
      setIsChecking(false);
      return;
    }

    // Check authentication status
    if (!authToken) {
      // Store the intended destination before redirecting
      const redirectUrl = encodeURIComponent(pathname || '/');
      setIsChecking(false);
      router.push(`/auth/sign-in?redirect=${redirectUrl}`);
      return;
    }

    // User is authenticated
    setIsAuthenticated(true);
    setIsChecking(false);
  }, [pathname, router, authToken, authLoading]);

  // Show loading spinner while checking auth
  if (isChecking || authLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // If authenticated (or public route), render children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Not authenticated and not a public route - show nothing while redirecting
  return null;
}