'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

import { PaymentSuccess } from '@/components/academy/subscriptions/payment-success';

export default function SubscriptionSuccessPage() {
  return (
    <Box sx={{ height: '100vh', width: '100%', p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Suscripción Exitosa
      </Typography>
      <PaymentSuccess />
    </Box>
  );
}
