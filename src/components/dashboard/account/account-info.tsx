'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/auth-store';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { SubscriptionPlan } from '@/types/user';
import API from '@/lib/axios';
import { mapMembershipName } from '@/lib/memberships';

export function AccountInfo(): React.JSX.Element {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  const queryClient = useQueryClient();

  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // ✅ Fetch user profile
  const { data: userData, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await API.get('/user/profile');
      return response.data;
    },
  });

  React.useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

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

  if (isLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />;

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          {/* ✅ Profile Image */}
          <Avatar src={user?.profileImage || '/assets/profile_fallback.jpg'} sx={{ height: '80px', width: '80px' }} />

          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{`${user?.firstName || 'User'} ${user?.lastName || ''}`}</Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />

      {/* ✅ Active Subscriptions List */}
      {user?.activeSubscriptions && user?.activeSubscriptions?.length > 0 ? (
        <CardContent>
          <Typography variant="h6">Tus Planes Activos:</Typography>
          {user.activeSubscriptions
            .filter((plan: any) => plan !== SubscriptionPlan.FREE) // ✅ Hide FREE plan from cancellation
            .map((plan) => (
              <Stack
                key={plan}
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 1, p: 1, borderRadius: '5px', backgroundColor: 'rgba(0,0,0,0.1)' }}
              >
                <Typography style={{ alignSelf: 'center', fontWeight: 'bold' }}>
                  {mapMembershipName(plan as SubscriptionPlan)}
                </Typography>
                <Button
                  color="error"
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSelectedPlan(plan);
                    setIsDialogOpen(true);
                  }}
                >
                  Cancelar
                </Button>
              </Stack>
            ))}
        </CardContent>
      ) : (
        <CardContent>
          <Typography color="text.secondary">🚫 No tienes suscripciones activas</Typography>
        </CardContent>
      )}

      {/* ✅ Expired Subscriptions List */}
      {user?.expiredSubscriptions && user?.expiredSubscriptions?.length > 0 ? (
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            Suscripciones Canceladas:
          </Typography>
          {user.expiredSubscriptions.map((plan) => (
            <Stack
              key={plan}
              direction="row"
              justifyContent="space-between"
              sx={{ mt: 1, p: 1, borderRadius: '5px', backgroundColor: 'rgba(255,0,0,0.1)' }}
            >
              <Typography style={{ alignSelf: 'center', fontWeight: 'bold' }}>
                {mapMembershipName(plan as SubscriptionPlan)}
              </Typography>
              <Button color="secondary" variant="outlined" size="small" disabled>
                Cancelado
              </Button>
            </Stack>
          ))}
        </CardContent>
      ) : null}

      <Divider />

      {/* ✅ Upload Profile Picture */}
      <CardActions>
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-avatar"
          onChange={handleFileChange}
        />
        <label htmlFor="upload-avatar" style={{ width: '100%' }}>
          <Button component="span" fullWidth variant="text" disabled={isUploading}>
            {isUploading ? '⏳ Subiendo...' : '📤 Subir imagen'}
          </Button>
        </label>
      </CardActions>

      {/* ✅ Confirmation Dialog for Subscription Cancellation */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>❌ Cancelar suscripción</DialogTitle>
        <DialogContent>
          <Typography>
            ⚠️ ¿Estás seguro de que quieres cancelar tu <b>{mapMembershipName(selectedPlan as SubscriptionPlan)}</b>{' '}
            suscripción? Mantendrás el acceso hasta el final de tu ciclo de facturación.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>🔄 No, mantenerla</Button>
          <Button
            color="error"
            onClick={() => cancelSubscription.mutate(selectedPlan!)}
            disabled={cancelSubscription.isPending}
          >
            {cancelSubscription.isPending ? '⏳ Procesando...' : '✅ Sí, cancelar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
