'use client';

import React, { useState } from 'react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import API from '@/lib/axios';

interface RegistrationFormProps {
  eventId: string;
  onRegistered: () => void;
}

const EventRegistrationForm: React.FC<RegistrationFormProps> = ({ eventId, onRegistered }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const register = useMutation({
    mutationFn: async () => {
      await API.post('/event-registrations', {
        ...formData,
        eventId,
        isVip: false,
        paymentStatus: 'free',
      });
    },
    onSuccess: () => {
      setErrorMessage(null); // Clear any old error
      onRegistered();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Ocurrió un error al registrarse. Intenta nuevamente.';
      setErrorMessage(msg);
    },
  });

  const handleSubmit = async () => {
    await register.mutateAsync();
  };

  return (
    <Box
      component="form"
      sx={{ mt: 2 }}
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6" textAlign="center">
          Registro Gratuito
        </Typography>

        {/* Show Error Alert */}
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <TextField
          label="Nombre"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
        <TextField
          label="Apellido"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
        <TextField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <TextField
          label="Teléfono"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          required
        />

        <Button type="submit" variant="contained" disabled={register.isPending}>
          {register.isPending ? 'Registrando...' : 'Registrarme'}
        </Button>
      </Stack>
    </Box>
  );
};

export default EventRegistrationForm;
