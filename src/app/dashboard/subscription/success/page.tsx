'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

import { PaymentSuccess } from '@/components/dashboard/subscriptions/payment-success';

export default function SubscriptionSuccessPage() {
  return (
      <Box sx={{ height: '100vh', width: '100%', p: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
            Subscription Success
        </Typography>
        <PaymentSuccess/>
      </Box>
  );
}
