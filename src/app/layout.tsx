import * as React from 'react';
import type { Viewport, Metadata } from 'next';
import '@/styles/global.css';
import { RootProviders } from '@/components/providers/root-providers';

export const metadata: Metadata = {
  title: 'DayTradeDak CRM',
  description: 'Professional trading platform CRM',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <RootProviders>
          {children}
        </RootProviders>
      </body>
    </html>
  );
}
