'use client';

import * as React from 'react';
import type { Viewport } from 'next';
import '@/styles/global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
// import { useFetchUser } from '@/hooks/use-fetch-user';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

// function UserFetcher({ children }: { children: React.ReactNode }) {
//   useFetchUser(); // Fetch user data after QueryClientProvider is initialized
//   return <>{children}</>;
// }

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body>
          <LocalizationProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </LocalizationProvider>
        </body>
      </html>
    </QueryClientProvider>
  );
}
