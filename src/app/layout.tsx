'use client';

import * as React from 'react';
import type { Viewport } from 'next';
import '@/styles/global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

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
