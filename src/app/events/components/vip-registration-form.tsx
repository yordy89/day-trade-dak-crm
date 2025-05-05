'use client';

import React, { useState } from 'react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import API from '@/lib/axios';

interface VipFormProps {
  eventId: string;
  priceId: string;
  promoCode?: string;
}

const VipRegistrationForm: React.FC<VipFormProps> = ({ eventId, priceId, promoCode }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkout = useMutation({
    mutationFn: async () => {
      const res = await API.post('/payments/vip-event-checkout', {
        ...formData,
        eventId,
        priceId,
        promoCode, // ✅ optional
      });
      window.location.href = res.data.url;
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Ocurrió un error al procesar tu registro VIP. Intenta nuevamente.';
      setErrorMessage(msg);
    },
  });

  const handleSubmit = async () => {
    try {
      await checkout.mutateAsync();
    } catch {
      // Error handled above
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
      sx={{ mt: 4 }}
    >
      <Stack spacing={2}>
        <Typography variant="h5" textAlign="center">
          Registro VIP
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
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
        <Button type="submit" variant="contained" disabled={checkout.isPending}>
          {checkout.isPending ? 'Redirigiendo...' : 'Pagar y Registrarse'}
        </Button>
      </Stack>
    </Box>
  );
};

export default VipRegistrationForm;
