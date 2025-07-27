import React from 'react';
import { useModuleAccess } from '@/hooks/use-module-access';
import { type ModuleType } from '@/types/module-permission';
import { Box, CircularProgress, Alert, Button } from '@mui/material';
import { Lock } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface ModuleAccessGuardProps {
  moduleType: ModuleType;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  loadingComponent?: React.ReactNode;
}

/**
 * Component wrapper to protect content based on module access
 */
export function ModuleAccessGuard({ 
  moduleType, 
  children, 
  fallback,
  showUpgradePrompt = true,
  loadingComponent
}: ModuleAccessGuardProps) {
  const { hasAccess, loading, error } = useModuleAccess(moduleType);
  const router = useRouter();

  if (loading) {
    return loadingComponent || (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error al verificar acceso: {error}
      </Alert>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showUpgradePrompt) {
      return (
        <Box 
          sx={{
            textAlign: 'center',
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 2,
            maxWidth: 600,
            mx: 'auto',
            my: 4,
          }}
        >
          <Lock sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <h2 style={{ marginBottom: '16px' }}>Contenido Restringido</h2>
          <p style={{ marginBottom: '24px', color: 'text.secondary' }}>
            Necesitas una suscripción activa o permisos especiales para acceder a este contenido.
          </p>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => router.push('/planes')}
          >
            Ver Planes Disponibles
          </Button>
        </Box>
      );
    }

    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        No tienes acceso a este contenido
      </Alert>
    );
  }

  return <>{children}</>;
}

/**
 * HOC version for wrapping components
 */
export function withModuleAccess<P extends object>(
  Component: React.ComponentType<P>,
  moduleType: ModuleType,
  fallback?: React.ReactNode
) {
  return function ProtectedComponent(props: P) {
    return (
      <ModuleAccessGuard moduleType={moduleType} fallback={fallback}>
        <Component {...props} />
      </ModuleAccessGuard>
    );
  };
}