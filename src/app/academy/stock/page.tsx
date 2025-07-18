'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

import { SubscriptionGuard } from '@/components/academy/subscriptions/subscription-guard';
import { SubscriptionPlan } from '@/types/user';
import StockVideoList from '@/components/academy/stock/stock-video-list';

export default function StockPage(): React.JSX.Element {
  return (
    <SubscriptionGuard requiredSubscription={SubscriptionPlan.MasterClases}>
      <Box sx={{ height: '100vh', width: '100%', p: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Inversiones en Acciones
        </Typography>
        <StockVideoList />
      </Box>
    </SubscriptionGuard>
  );
}
