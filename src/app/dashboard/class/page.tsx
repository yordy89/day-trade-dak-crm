'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

import { SubscriptionGuard } from '@/components/dashboard/subscriptions/subscription-guard';
import { SubscriptionPlan } from '@/types/user';
import ClassVideoList from '@/components/dashboard/class/class-video-list';

export default function ClassesPage(): React.JSX.Element {
  return (
    <SubscriptionGuard requiredSubscription={SubscriptionPlan.CLASS}>
      <Box sx={{ height: '100vh', width: '100%', p: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Clases de Trading
        </Typography>
        <ClassVideoList />
      </Box>
    </SubscriptionGuard>
  );
}
