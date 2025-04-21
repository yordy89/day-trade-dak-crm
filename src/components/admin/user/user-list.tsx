'use client';

import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '@/lib/axios';
import { SubscriptionPlan, Role } from '@/types/user';
import { mapMembershipName } from '@/lib/memberships';
import PasswordChangeModal from '../common/PasswordChangeModal'

interface Subscription {
  _id: string;
  plan: SubscriptionPlan;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  profileImage?: string;
  subscriptions: Subscription[];
  activeSubscriptions: SubscriptionPlan[];
  expiredSubscriptions?: SubscriptionPlan[];
}

const UserList = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await API.get('/user');
      return res.data;
    },
  });

  const cancelSubscription = useMutation({
    mutationFn: async ({ userId, plan }: { userId: string; plan: SubscriptionPlan }) => {
      await API.delete(`/payments/admin/users/${userId}/cancel/${plan}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsCancelDialogOpen(false);
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      await API.delete(`/user/admin/${userId}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsDeleteDialogOpen(false);
    },
  });

  const resetPassword = useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
      await API.put(`/auth/admin/users/${userId}/reset-password`, { newPassword });
    },
    onSuccess: () => {
      setIsPasswordModalOpen(false);
    },
  });

  const filteredUsers = users?.filter((user: User) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const openCancelDialog = (user: User, plan: SubscriptionPlan) => {
    setSelectedUser(user);
    setSelectedPlan(plan);
    setIsCancelDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const openPasswordModal = (user: User) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  if (isLoading) return <CircularProgress sx={{ mx: 'auto', display: 'block' }} />;

  return (
    <Box>
      <TextField
        label="Buscar por nombre o email"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Stack spacing={3}>
        {filteredUsers.map((user: any) => {
          const activePlans = user.activeSubscriptions.filter((plan: SubscriptionPlan) => plan !== SubscriptionPlan.FREE);
          const canceledPlans = user.expiredSubscriptions ?? [];

          return (
            <Card key={user._id} variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar src={user.profileImage} sx={{ width: 56, height: 56 }} />
                  <Box flex={1}>
                    <Typography fontWeight="bold">{user.firstName} {user.lastName}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    <Chip
                      label={user.role === Role.ADMIN ? 'Administrador' : 'Usuario'}
                      color={user.role === Role.ADMIN ? 'success' : 'default'}
                      size="small"
                      sx={{ mt: 1 }}
                    />

                    {/* Active Subscriptions */}
                    {activePlans.length > 0 ? (
                      <Box sx={{ mt: 2 }}>
                        <Typography fontWeight="bold" variant="subtitle2" color="primary">
                          Tus Planes Activos:
                        </Typography>
                        {activePlans.map((plan: string) => (
                          <Stack
                            key={plan}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{
                              mt: 1,
                              p: 1,
                              borderRadius: '5px',
                              backgroundColor: 'rgba(0,0,0,0.05)',
                            }}
                          >
                            <Typography fontWeight="bold">
                              {mapMembershipName(plan as SubscriptionPlan)}
                            </Typography>
                            <Button
                              color="error"
                              variant="outlined"
                              size="small"
                              onClick={() => openCancelDialog(user, plan as SubscriptionPlan)}
                            >
                              Cancelar
                            </Button>
                          </Stack>
                        ))}
                      </Box>
                    ) : (
                      <Typography sx={{ mt: 2 }} color="text.secondary">
                        🚫 No tiene suscripciones activas
                      </Typography>
                    )}

                    {/* Canceled Subscriptions */}
                    {canceledPlans?.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography fontWeight="bold" variant="subtitle2" color="text.secondary">
                          Suscripciones Canceladas:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                          {canceledPlans.map((plan: string) => (
                            <Chip
                              key={plan}
                              label={mapMembershipName(plan as SubscriptionPlan)}
                              color="default"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                </Stack>
              </CardContent>
              <CardActions sx={{ flexWrap: 'wrap', gap: 1, px: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => openPasswordModal(user)}
                >
                  Cambiar Contraseña
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => openDeleteDialog(user)}
                >
                  Eliminar Usuario
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Stack>

      {/* Cancel Subscription Dialog */}
      <Dialog open={isCancelDialogOpen} onClose={() => setIsCancelDialogOpen(false)}>
        <DialogTitle>❌ Cancelar suscripción</DialogTitle>
        <DialogContent>
          <Typography>
            ⚠️ ¿Estás seguro de que quieres cancelar la suscripción <b>{mapMembershipName(selectedPlan!)}</b> de{' '}
            <b>{selectedUser?.firstName} {selectedUser?.lastName}</b>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCancelDialogOpen(false)}>🔄 No, mantenerla</Button>
          <Button
            color="error"
            onClick={() =>
              cancelSubscription.mutate({
                userId: selectedUser!._id,
                plan: selectedPlan!,
              })
            }
            disabled={cancelSubscription.isPending}
          >
            {cancelSubscription.isPending ? '⏳ Procesando...' : '✅ Sí, cancelar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Eliminar Usuario</DialogTitle>
        <DialogContent>
          <Typography>
            ⚠️ ¿Estás seguro de que quieres eliminar a <b>{selectedUser?.firstName} {selectedUser?.lastName}</b>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            color="error"
            onClick={() => deleteUser.mutate(selectedUser!._id)}
            disabled={deleteUser.isPending}
          >
            {deleteUser.isPending ? '⏳ Eliminando...' : 'Sí, eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Change Modal */}
      <PasswordChangeModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={(newPassword) => {
          if (selectedUser) {
            resetPassword.mutate({ userId: selectedUser._id, newPassword });
          }
        }}
        isLoading={resetPassword.isPending}
      />
    </Box>
  );
};

export default UserList;
