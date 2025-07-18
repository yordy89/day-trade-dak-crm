'use client';

import React from 'react';
import {
  Box,
  CircularProgress,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { ShowChart, TrendingUp } from '@mui/icons-material';

interface LoadingStateProps {
  variant?: 'circular' | 'linear' | 'skeleton' | 'trading';
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
  skeletonRows?: number;
  delay?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'circular',
  size = 'medium',
  text,
  fullScreen = false,
  skeletonRows = 3,
  delay = 0,
}) => {
  const theme = useTheme();
  const [show, setShow] = React.useState(delay === 0);

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!show) return null;

  const sizes = {
    small: 24,
    medium: 40,
    large: 60,
  };

  const content = () => {
    switch (variant) {
      case 'linear':
        return (
          <Stack spacing={2} sx={{ width: '100%' }}>
            {text ? <Typography variant="body2" color="text.secondary" align="center">
                {text}
              </Typography> : null}
            <LinearProgress />
          </Stack>
        );

      case 'skeleton':
        return (
          <Stack spacing={2} sx={{ width: '100%' }}>
            {Array.from({ length: skeletonRows }).map((_, index) => (
              <Skeleton
                key={`skeleton-row-${index}`}
                variant="rectangular"
                height={60}
                animation="wave"
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Stack>
        );

      case 'trading':
        return (
          <Stack spacing={3} alignItems="center">
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress
                size={sizes[size]}
                thickness={2}
                sx={{
                  color: theme.palette.primary.main,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShowChart
                  sx={{
                    fontSize: sizes[size] * 0.5,
                    color: theme.palette.primary.main,
                    animation: 'pulse 1.5s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 0.6 },
                      '50%': { opacity: 1 },
                      '100%': { opacity: 0.6 },
                    },
                  }}
                />
              </Box>
            </Box>
            {text ? <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <TrendingUp sx={{ fontSize: 16 }} />
                {text}
              </Typography> : null}
          </Stack>
        );

      default:
        return (
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={sizes[size]} />
            {text ? <Typography variant="body2" color="text.secondary" align="center">
                {text}
              </Typography> : null}
          </Stack>
        );
    }
  };

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          zIndex: theme.zIndex.modal,
        }}
      >
        {content()}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        minHeight: 200,
      }}
    >
      {content()}
    </Box>
  );
};

// Specialized loading components
export const PageLoader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <LoadingState variant="trading" size="large" text={text} fullScreen />
);

export const ContentLoader: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <LoadingState variant="skeleton" skeletonRows={rows} />
);

export const ButtonLoader: React.FC = () => (
  <CircularProgress size={20} color="inherit" />
);

// Loading wrapper component
interface LoadingWrapperProps {
  loading: boolean;
  error?: Error | null;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  delay?: number;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  loading,
  error,
  children,
  loadingComponent,
  errorComponent,
  delay = 200,
}) => {
  if (error) {
    return (
      <>
        {errorComponent || (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="error" variant="h6" gutterBottom>
              Error loading content
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error.message || 'An unexpected error occurred'}
            </Typography>
          </Box>
        )}
      </>
    );
  }

  if (loading) {
    return <>{loadingComponent || <LoadingState delay={delay} />}</>;
  }

  return <>{children}</>;
};