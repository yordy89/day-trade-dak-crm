'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/auth-store';
import type { AlertColor } from '@mui/material';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  Typography,
  Box,
  Stack,
  InputBase,
  IconButton,
  FormHelperText,
  Snackbar,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  User,
  EnvelopeSimple,
  Phone,
  Lock,
  Eye,
  EyeSlash,
  Check,
  Warning,
  FloppyDisk,
  Key,
} from '@phosphor-icons/react';
import { useTheme } from '@/components/theme/theme-provider';
import { userService } from '@/services/api/user.service';
import { authService } from '@/services/api/auth.service';

// Create stable selector outside the component
const selectUser = (state: any) => state.user;

interface CustomInputProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  isDarkMode: boolean;
  muiTheme: any;
  name: string;
  disabled?: boolean;
  endAdornment?: React.ReactNode;
}

const CustomInput = React.memo<CustomInputProps>((props) => {
  const { 
    icon, 
    label, 
    isDarkMode, 
    muiTheme,
    error,
    helperText,
    endAdornment,
    disabled,
    ...rest 
  } = props;
  const [isFocused, setIsFocused] = React.useState(false);
  
  return (
    <FormControl fullWidth error={error}>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 1, 
          fontWeight: 500,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        }}
      >
        {label} {rest.required ? <span style={{ color: muiTheme.palette.error.main }}>*</span> : null}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'transparent',
          borderRadius: 2,
          border: '1px solid',
          borderColor: error 
            ? muiTheme.palette.error.main 
            : isFocused 
              ? muiTheme.palette.primary.main 
              : isDarkMode 
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s',
          opacity: disabled ? 0.6 : 1,
          '&:hover': {
            borderColor: disabled 
              ? undefined
              : error 
                ? muiTheme.palette.error.main 
                : isDarkMode 
                  ? 'rgba(255, 255, 255, 0.3)'
                  : 'rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 1.5,
            color: isFocused 
              ? muiTheme.palette.primary.main 
              : isDarkMode
                ? 'rgba(255, 255, 255, 0.7)'
                : 'rgba(0, 0, 0, 0.6)',
            transition: 'color 0.3s',
          }}
        >
          {icon}
        </Box>
        <InputBase
          {...rest}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          sx={{
            flex: 1,
            py: 1.75,
            pr: 2,
            fontSize: '16px',
            fontWeight: 400,
            color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
            '& input': {
              padding: '0 0 0 8px',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
              backgroundColor: 'transparent',
              '&::placeholder': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                opacity: 1,
              },
              '&:disabled': {
                cursor: 'not-allowed',
                WebkitTextFillColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              },
            },
          }}
        />
        {endAdornment ? (
          <Box sx={{ pr: 1 }}>
            {endAdornment}
          </Box>
        ) : null}
      </Box>
      {helperText ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : null}
    </FormControl>
  );
});

CustomInput.displayName = 'CustomInput';

export function AccountDetailsForm(): React.JSX.Element {
  const user = useAuthStore(selectUser);
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  
  const [formData, setFormData] = React.useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const [passwordData, setPasswordData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [showPasswords, setShowPasswords] = React.useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = React.useState({
    profile: false,
    password: false,
  });

  const [alert, setAlert] = React.useState<{ type: AlertColor; message: string } | null>(null);

  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(prev => ({ ...prev, profile: true }));
    
    try {
      await userService.updateUser(formData);
      setAlert({ type: 'success', message: 'Perfil actualizado correctamente' });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setAlert({ type: 'error', message: error.message || 'Error al actualizar el perfil' });
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setAlert({ type: 'error', message: 'Las contraseñas no coinciden' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setAlert({ type: 'error', message: 'La contraseña debe tener al menos 8 caracteres' });
      return;
    }

    setLoading(prev => ({ ...prev, password: true }));

    try {
      await authService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setAlert({ type: 'success', message: 'Contraseña actualizada correctamente' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error: any) {
      console.error('Error updating password:', error);
      setAlert({ type: 'error', message: error.message || 'Error al actualizar la contraseña' });
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  return (
    <>
      <Grid container spacing={3} direction="column">
        {/* Profile Update Card */}
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: isDarkMode ? 4 : 1 }}>
              <CardHeader 
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <User size={24} weight="duotone" />
                    <Typography variant="h6">Información Personal</Typography>
                  </Stack>
                }
                subheader="Actualiza tu información personal" 
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <CustomInput
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      icon={<User size={20} weight="duotone" />}
                      label="Nombre"
                      placeholder="Tu nombre"
                      required
                      isDarkMode={isDarkMode}
                      muiTheme={muiTheme}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomInput
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      icon={<User size={20} weight="duotone" />}
                      label="Apellido"
                      placeholder="Tu apellido"
                      required
                      isDarkMode={isDarkMode}
                      muiTheme={muiTheme}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomInput
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      icon={<EnvelopeSimple size={20} weight="duotone" />}
                      label="Correo electrónico"
                      placeholder="tu@email.com"
                      type="email"
                      disabled
                      isDarkMode={isDarkMode}
                      muiTheme={muiTheme}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomInput
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      icon={<Phone size={20} weight="duotone" />}
                      label="Teléfono"
                      placeholder="+1 234 567 8900"
                      type="tel"
                      isDarkMode={isDarkMode}
                      muiTheme={muiTheme}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  type="submit" 
                  variant="contained"
                  disabled={loading.profile}
                  startIcon={<FloppyDisk size={18} weight="bold" />}
                  sx={{
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                    },
                  }}
                >
                  {loading.profile ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </Box>
            </Card>
          </form>
        </Grid>

        {/* Password Update Card */}
        <Grid item xs={12}>
          <form onSubmit={handlePasswordSubmit}>
            <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: isDarkMode ? 4 : 1 }}>
              <CardHeader 
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Key size={24} weight="duotone" />
                    <Typography variant="h6">Seguridad</Typography>
                  </Stack>
                }
                subheader="Actualiza tu contraseña" 
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <CustomInput
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      icon={<Lock size={20} weight="duotone" />}
                      label="Contraseña actual"
                      placeholder="Ingresa tu contraseña actual"
                      type={showPasswords.current ? 'text' : 'password'}
                      required
                      isDarkMode={isDarkMode}
                      muiTheme={muiTheme}
                      endAdornment={
                        <IconButton
                          onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          edge="end"
                          size="small"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showPasswords.current ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </IconButton>
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomInput
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      icon={<Lock size={20} weight="duotone" />}
                      label="Nueva contraseña"
                      placeholder="Mínimo 8 caracteres"
                      type={showPasswords.new ? 'text' : 'password'}
                      required
                      isDarkMode={isDarkMode}
                      muiTheme={muiTheme}
                      endAdornment={
                        <IconButton
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          edge="end"
                          size="small"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showPasswords.new ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </IconButton>
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomInput
                      name="confirmNewPassword"
                      value={passwordData.confirmNewPassword}
                      onChange={handlePasswordChange}
                      icon={<Lock size={20} weight="duotone" />}
                      label="Confirmar nueva contraseña"
                      placeholder="Repite la nueva contraseña"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      required
                      isDarkMode={isDarkMode}
                      muiTheme={muiTheme}
                      endAdornment={
                        <IconButton
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          edge="end"
                          size="small"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showPasswords.confirm ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </IconButton>
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  type="submit" 
                  variant="contained"
                  disabled={loading.password}
                  startIcon={<Key size={18} weight="bold" />}
                  sx={{
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                    },
                  }}
                >
                  {loading.password ? 'Actualizando...' : 'Cambiar contraseña'}
                </Button>
              </Box>
            </Card>
          </form>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      {alert ? (
        <Snackbar
          open
          autoHideDuration={6000}
          onClose={() => setAlert(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setAlert(null)} 
            severity={alert.type} 
            sx={{ width: '100%' }}
            icon={alert.type === 'success' ? <Check size={20} weight="bold" /> : <Warning size={20} weight="bold" />}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      ) : null}
    </>
  );
}