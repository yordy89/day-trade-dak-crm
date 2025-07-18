'use client';

import * as React from 'react';
import { useClientAuth } from '@/hooks/use-client-auth';
import { useAuthStore } from '@/store/auth-store';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  Box,
  Chip,
  IconButton,
  Badge,
  Paper,
  alpha,
  useTheme,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { SubscriptionPlan } from '@/types/user';
import API from '@/lib/axios';
import { mapMembershipName } from '@/lib/memberships';
import { 
  Camera,
  Crown,
  X,
  Warning,
  CheckCircle,
  User,
  EnvelopeSimple,
  CalendarBlank,
  Shield,
} from '@phosphor-icons/react';

export function AccountInfo(): React.JSX.Element {
  const theme = useTheme();
  const { user } = useClientAuth();
  const setUser = useAuthStore.getState().setUser;

  const queryClient = useQueryClient();

  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // User data comes from the auth store via useClientAuth
  // No need to fetch it again
  const userData = user;
  const isLoading = !user;

  // Don't update user in useEffect - causes infinite loops

  // ✅ Subscription Cancellation Mutation
  const cancelSubscription = useMutation({
    mutationFn: async (plan: string) => {
      await API.delete(`/payments/cancel/${plan}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      setIsDialogOpen(false);
    },
  });

  // ✅ Image Upload Functionality
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);

    try {
      const response = await API.post(`user/${user?._id}/upload-profile-image/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.avatarUrl) {
        setUser({ ...response.data });
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const isDarkMode = theme.palette.mode === 'dark';
  const isPremium = user?.activeSubscriptions && user.activeSubscriptions.length > 0;

  if (isLoading) return (
    <Card sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Card>
  );

  return (
    <Card 
      sx={{ 
        overflow: 'visible',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: isDarkMode ? 4 : 1,
      }}
    >
      {/* Profile Header with Background */}
      <Box
        sx={{
          height: 120,
          background: isPremium 
            ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
            : `linear-gradient(135deg, ${theme.palette.grey[800]} 0%, ${theme.palette.grey[700]} 100%)`,
          position: 'relative',
        }}
      />
      
      <CardContent sx={{ position: 'relative', pt: 0, pb: 4 }}>
        <Stack spacing={3} sx={{ alignItems: 'center', mt: -8 }}>
          {/* Profile Image with Upload */}
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <IconButton
                component="label"
                htmlFor="upload-avatar"
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                  border: '3px solid',
                  borderColor: 'background.paper',
                }}
              >
                <Camera size={18} weight="bold" color="white" />
              </IconButton>
            }
          >
            <Avatar 
              src={user?.profileImage} 
              sx={{ 
                width: 120,
                height: 120,
                border: '4px solid',
                borderColor: 'background.paper',
                boxShadow: 3,
                bgcolor: isPremium ? 'primary.main' : 'grey.500',
                fontSize: '2.5rem',
                fontWeight: 700,
              }}
            >
              {user?.firstName?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          </Badge>

          {/* User Info */}
          <Stack spacing={1} sx={{ textAlign: 'center', width: '100%' }}>
            <Typography variant="h5" fontWeight={700}>
              {`${user?.firstName || 'Usuario'} ${user?.lastName || ''}`}
            </Typography>
            
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
              <EnvelopeSimple size={16} weight="duotone" />
              <Typography variant="body2" color="text.secondary">
                {user?.email || 'email@example.com'}
              </Typography>
            </Stack>

            {/* User Stats */}
            <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  {user?.activeSubscriptions?.length || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Planes Activos
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={700}>
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString('es')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Miembro desde
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>

        {/* Subscriptions Section */}
        <Box sx={{ mt: 4, width: '100%' }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Crown size={20} weight="duotone" color={theme.palette.warning.main} />
            <Typography variant="subtitle1" fontWeight={600}>
              Suscripciones
            </Typography>
          </Stack>

          {user?.activeSubscriptions && user?.activeSubscriptions?.length > 0 ? (
            <Stack spacing={1.5}>
              {user.activeSubscriptions
                .filter((plan: any) => plan !== SubscriptionPlan.FREE)
                .map((plan) => (
                  <Paper
                    key={plan}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      background: isDarkMode 
                        ? alpha(theme.palette.success.main, 0.05)
                        : alpha(theme.palette.success.main, 0.02),
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <CheckCircle size={24} weight="duotone" color={theme.palette.success.main} />
                        <Box>
                          <Typography fontWeight={600}>
                            {mapMembershipName(plan as SubscriptionPlan)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Activo
                          </Typography>
                        </Box>
                      </Stack>
                      <Button
                        size="small"
                        color="error"
                        variant="text"
                        onClick={() => {
                          setSelectedPlan(plan);
                          setIsDialogOpen(true);
                        }}
                        sx={{ 
                          fontWeight: 500,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.error.main, 0.08),
                          },
                        }}
                      >
                        Cancelar
                      </Button>
                    </Stack>
                  </Paper>
                ))}
            </Stack>
          ) : (
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                border: '1px dashed',
                borderColor: 'divider',
                bgcolor: 'transparent',
              }}
            >
              <Shield size={48} weight="duotone" color={theme.palette.grey[400]} />
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                No tienes suscripciones activas
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ mt: 2 }}
                component="a"
                href="/academy/subscription/plans"
              >
                Ver Planes
              </Button>
            </Paper>
          )}
        </Box>

        {/* Expired Subscriptions */}
        {user?.expiredSubscriptions && user?.expiredSubscriptions?.length > 0 && (
          <Box sx={{ mt: 3, width: '100%' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
              Suscripciones Anteriores
            </Typography>
            <Stack spacing={1}>
              {user.expiredSubscriptions.map((plan) => (
                <Paper
                  key={plan}
                  sx={{
                    p: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    opacity: 0.7,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <X size={20} weight="duotone" color={theme.palette.grey[500]} />
                      <Typography variant="body2" color="text.secondary">
                        {mapMembershipName(plan as SubscriptionPlan)}
                      </Typography>
                    </Stack>
                    <Chip 
                      label="Cancelado" 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        borderColor: 'text.disabled',
                        color: 'text.disabled',
                        fontSize: '0.75rem',
                      }}
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

      </CardContent>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        id="upload-avatar"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {/* Confirmation Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Warning size={24} weight="duotone" color={theme.palette.error.main} />
            <Typography variant="h6">Cancelar suscripción</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            ¿Estás seguro de que quieres cancelar tu suscripción{' '}
            <strong>{mapMembershipName(selectedPlan as SubscriptionPlan)}</strong>?
            Mantendrás el acceso hasta el final de tu ciclo de facturación.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setIsDialogOpen(false)}
            variant="outlined"
          >
            Mantener suscripción
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => cancelSubscription.mutate(selectedPlan!)}
            disabled={cancelSubscription.isPending}
          >
            {cancelSubscription.isPending ? 'Procesando...' : 'Sí, cancelar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
