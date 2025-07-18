'use client';

import React, { Component, ReactNode } from 'react';
import { Box, Typography, Button, Stack, Alert, Container } from '@mui/material';
import { ErrorOutline, Refresh, Home } from '@mui/icons-material';
import { logger } from '@/lib/default-logger';
import { errorHandler } from '@/lib/error-handler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = errorHandler.generateCorrelationId();
    
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    logger.error('React Error Boundary caught an error:', {
      error: error.toString(),
      errorInfo: errorInfo.componentStack,
      errorId: this.state.errorId,
    });

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send error to error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      const { error, errorInfo, errorId } = this.state;
      const { showDetails = process.env.NODE_ENV === 'development' } = this.props;

      return (
        <Container maxWidth="md">
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              py: 4,
            }}
          >
            <ErrorOutline
              sx={{
                fontSize: 80,
                color: 'error.main',
                mb: 3,
              }}
            />
            
            <Typography variant="h3" gutterBottom fontWeight={700}>
              Oops! Something went wrong
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600 }}
            >
              We're sorry for the inconvenience. An unexpected error has occurred. 
              Please try refreshing the page or contact support if the problem persists.
            </Typography>

            {errorId && (
              <Alert severity="info" sx={{ mb: 3 }}>
                Error ID: <strong>{errorId}</strong>
                <br />
                <Typography variant="caption" color="text.secondary">
                  Please provide this ID when contacting support
                </Typography>
              </Alert>
            )}

            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleReset}
                size="large"
              >
                Try Again
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={this.handleGoHome}
                size="large"
              >
                Go to Home
              </Button>
            </Stack>

            {showDetails && error && (
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  bgcolor: 'grey.100',
                  borderRadius: 2,
                  maxWidth: '100%',
                  overflow: 'auto',
                  textAlign: 'left',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Error Details (Development Only)
                </Typography>
                
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: 12,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {error.toString()}
                  {'\n\n'}
                  {error.stack}
                </Typography>

                {errorInfo && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Component Stack
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      component="pre"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: 12,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {errorInfo.componentStack}
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

// HOC for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <EnhancedErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </EnhancedErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}