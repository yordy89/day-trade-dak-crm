'use client';

import * as React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { CustomThemeProvider } from '@/components/theme/theme-provider';
import { I18nProvider } from '@/components/providers/i18n-provider';
import { Toaster } from 'react-hot-toast';

interface RootProvidersProps {
  children: React.ReactNode;
}

export function RootProviders({ children }: RootProvidersProps): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <LocalizationProvider>
          <CustomThemeProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#10b981',
                  },
                },
                error: {
                  style: {
                    background: '#ef4444',
                  },
                },
              }}
            />
          </CustomThemeProvider>
        </LocalizationProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}