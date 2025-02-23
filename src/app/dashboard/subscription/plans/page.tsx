'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

import { SubscriptionManager } from '@/components/dashboard/subscriptions/subscription';

export default function PlansPage() {
  return (
      <Box sx={{ height: '100vh', width: '100%', p: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Plans
        </Typography>
        <SubscriptionManager/>
      </Box>
  );
}
