'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/auth-store';
import type { AlertColor } from '@mui/material';
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

import API from '@/lib/axios';

export function AccountDetailsForm(): React.JSX.Element {
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = React.useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [alert, setAlert] = React.useState<{ type: AlertColor; message: string } | null>(null);

  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // 🔹 Handle Input Changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Submit Profile Update
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await API.put('/user/profile', formData);
      setAlert({ type: 'success', message: 'Perfil actualizado correctamente.' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setAlert({ type: 'error', message: 'Hubo un error al actualizar el perfil.' });
    }
  };

  // 🔹 Submit Password Update
  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setAlert({ type: 'error', message: 'Las contraseñas no coinciden.' });
      return;
    }

    try {
      await API.put('/auth/update-password', passwordData);
      setAlert({ type: 'success', message: 'Contraseña actualizada correctamente.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error: any) {
      console.error('Error updating password:', error);
      setAlert({ type: 'error', message: error.response.data.message });
    }
  };

  return (
    <Grid container spacing={3} direction="column">
      {/* ✅ Profile Update Card */}
      <Grid item xs={12}>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader subheader="La información se puede editar." title="Perfil" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth required variant="outlined">
                    <InputLabel shrink htmlFor="first-name">
                      Nombre
                    </InputLabel>
                    <OutlinedInput
                      id="first-name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      name="firstName"
                      label="Nombre"
                      notched
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required variant="outlined">
                    <InputLabel shrink htmlFor="last-name">
                      Apellido
                    </InputLabel>
                    <OutlinedInput
                      id="last-name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      name="lastName"
                      label="Apellido"
                      notched
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink htmlFor="email">
                      Email address
                    </InputLabel>
                    <OutlinedInput
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      name="email"
                      label="Email address"
                      notched
                      readOnly
                      disabled
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink htmlFor="phone">
                      Número de teléfono
                    </InputLabel>
                    <OutlinedInput
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      name="phone"
                      label="Número de teléfono"
                      type="tel"
                      notched
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained">
                Guardar
              </Button>
            </CardActions>
          </Card>
        </form>
      </Grid>
      {alert && (
        <Grid item xs={12}>
          <Alert severity={alert.type} onClose={() => setAlert(null)}>
            {alert.message}
          </Alert>
        </Grid>
      )}
      {/* ✅ Password Update Card */}
      <Grid item xs={12}>
        <form onSubmit={handlePasswordSubmit}>
          <Card>
            <CardHeader title="Actualizar Contraseña" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth required variant="outlined">
                    <InputLabel shrink htmlFor="current-password">
                      Contraseña Actual
                    </InputLabel>
                    <OutlinedInput
                      id="current-password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      name="currentPassword"
                      label="Contraseña Actual"
                      notched
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required variant="outlined">
                    <InputLabel shrink htmlFor="new-password">
                      Nueva Contraseña
                    </InputLabel>
                    <OutlinedInput
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      name="newPassword"
                      label="Nueva Contraseña"
                      notched
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required variant="outlined">
                    <InputLabel shrink htmlFor="confirm-new-password">
                      Confirmar Nueva Contraseña
                    </InputLabel>
                    <OutlinedInput
                      id="confirm-new-password"
                      type="password"
                      value={passwordData.confirmNewPassword}
                      onChange={handlePasswordChange}
                      name="confirmNewPassword"
                      label="Confirmar Nueva Contraseña"
                      notched
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained">
                Actualizar Contraseña
              </Button>
            </CardActions>
          </Card>
        </form>
      </Grid>
    </Grid>
  );
}
