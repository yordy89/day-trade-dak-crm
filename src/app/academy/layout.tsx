'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';
import { useTheme as useMuiTheme, alpha } from '@mui/material';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainNav } from '@/components/academy/layout/main-nav';
import { SideNav } from '@/components/academy/layout/side-nav';
import { useTheme } from '@/components/theme/theme-provider';

interface LayoutProps {
  children: React.ReactNode;
}

// Background pattern component - memoized to prevent re-renders
const TradingPattern = React.memo(({ isDarkMode }: { isDarkMode: boolean }) => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      opacity: isDarkMode ? 0.02 : 0.01,
      pointerEvents: 'none',
      zIndex: 0,
    }}
  >
    <svg width="100%" height="100%" viewBox="0 0 1920 1080">
      <defs>
        <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#16a34a" strokeWidth="0.5" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      
      {/* Abstract trading lines */}
      <path
        d="M 0 540 Q 480 500 960 460 T 1920 420"
        stroke="#16a34a"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M 0 600 Q 640 560 1280 520 T 1920 480"
        stroke="#22c55e"
        strokeWidth="1"
        fill="none"
        opacity="0.2"
      />
    </svg>
  </Box>
));

TradingPattern.displayName = 'TradingPattern';

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  
  // Memoize theme-dependent styles to prevent recalculation on every render
  const boxBackground = React.useMemo(() => 
    isDarkMode
      ? `linear-gradient(180deg, ${alpha('#0a0a0a', 0.95)} 0%, ${alpha('#121212', 0.95)} 100%)`
      : `linear-gradient(180deg, ${alpha('#fafafa', 0.95)} 0%, ${alpha('#f5f5f5', 0.95)} 100%)`,
    [isDarkMode]
  );
  
  const mainBackground = React.useMemo(() => 
    isDarkMode
      ? `radial-gradient(ellipse at top left, ${alpha(muiTheme.palette.primary.dark, 0.05)} 0%, transparent 50%),
         radial-gradient(ellipse at bottom right, ${alpha(muiTheme.palette.secondary.dark, 0.05)} 0%, transparent 50%)`
      : `radial-gradient(ellipse at top left, ${alpha(muiTheme.palette.primary.light, 0.03)} 0%, transparent 50%),
         radial-gradient(ellipse at bottom right, ${alpha(muiTheme.palette.secondary.light, 0.03)} 0%, transparent 50%)`,
    [isDarkMode, muiTheme.palette]
  );
  
  return (
    <AuthGuard>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '64px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1200,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1300,
          },
        }}
      />
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-default)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100vh',
          background: boxBackground,
        }}
      >
        <TradingPattern isDarkMode={isDarkMode} />
        <SideNav />
        <Box 
          sx={{ 
            display: 'flex', 
            flex: '1 1 auto', 
            flexDirection: 'column', 
            pl: { lg: 'var(--SideNav-width)' },
            position: 'relative',
            zIndex: 1,
          }}
        >
          <MainNav />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 4,
              px: { xs: 2, sm: 3, md: 4 },
              background: mainBackground,
            }}
          >
            <Container 
              maxWidth="xl" 
              sx={{ 
                position: 'relative',
                zIndex: 1,
              }}
            >
              {children}
            </Container>
          </Box>
        </Box>
      </Box>
    </AuthGuard>
  );
}
