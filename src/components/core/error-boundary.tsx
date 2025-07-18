'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, Container } from '@mui/material';
import { Warning } from '@phosphor-icons/react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }: { error?: Error }) {
  const router = useRouter();

  React.useEffect(() => {
    // Auto redirect to home after 3 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Warning size={64} weight="duotone" color="#ef4444" />
        <Typography variant="h4" fontWeight={700}>
          Oops! Algo salió mal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {error?.message || 'Ha ocurrido un error inesperado'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Serás redirigido a la página principal en 3 segundos...
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/')}
          sx={{ mt: 2 }}
        >
          Ir a Inicio
        </Button>
      </Box>
    </Container>
  );
}