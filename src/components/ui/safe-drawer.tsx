'use client';

import React from 'react';
import { Drawer as MuiDrawer, DrawerProps } from '@mui/material';

// Wrapper component to handle React 19 ref deprecation issue with MUI Drawer
export function SafeDrawer(props: DrawerProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Only render the Drawer after mounting to avoid SSR issues
  if (!mounted) {
    return null;
  }

  // Render the drawer only when it's open to avoid ref issues
  if (!props.open) {
    return null;
  }

  return <MuiDrawer {...props} />;
}