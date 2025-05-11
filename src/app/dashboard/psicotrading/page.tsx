'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

import { SubscriptionGuard } from '@/components/dashboard/subscriptions/subscription-guard';
import { SubscriptionPlan } from '@/types/user';
import PsicoTradingVideoList from '@/components/dashboard/psicotrading/psicotrading-video-list';


export default function PsicotradingPage(): React.JSX.Element {
  return (
    <SubscriptionGuard requiredSubscription={SubscriptionPlan.PSICOTRADING}>
      <Box sx={{ height: '100vh', width: '100%', p: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          PsicoTrading
        </Typography>
        <PsicoTradingVideoList />
      </Box>
    </SubscriptionGuard>
  );
}
