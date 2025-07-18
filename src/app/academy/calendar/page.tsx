'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

import { Calendar } from '@/components/academy/calendar/calendar';
import { SubscriptionGuard } from '@/components/academy/subscriptions/subscription-guard';

export default function CalendarPage() {
  return (
    <SubscriptionGuard requiredSubscription="Pro">
      <Box sx={{ height: '100vh', width: '100%', p: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Events Calendar
        </Typography>
        <Calendar />
      </Box>
    </SubscriptionGuard>
  );
}
