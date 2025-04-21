'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Stack,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Eye, EyeSlash } from '@phosphor-icons/react';

interface PasswordChangeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newPassword: string) => void;
  isLoading?: boolean;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!newPassword || !confirmPassword) {
      setError('Todos los campos son requeridos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setError(null);
    onSubmit(newPassword);
  };

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    onClose();
  };

  const renderToggleIcon = () => (
    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
      {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
    </IconButton>
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Cambiar Contraseña</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            label="Nueva contraseña"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {renderToggleIcon()}
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirmar contraseña"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {renderToggleIcon()}
                </InputAdornment>
              ),
            }}
          />
          {error ? <Typography color="error">{error}</Typography> : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : 'Actualizar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordChangeModal;
