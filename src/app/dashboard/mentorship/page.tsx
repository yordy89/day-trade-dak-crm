'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

import VideoList from '@/components/dashboard/mentorship/video-list';
import { SubscriptionGuard } from '@/components/dashboard/subscriptions/subscription-guard';
import { SubscriptionPlan } from '@/types/user';

export default function MentorshipPage() {
  return (
    <SubscriptionGuard requiredSubscription={SubscriptionPlan.MENTORSHIP}>
      <Box sx={{ height: '100vh', width: '100%', p: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Mentorías
        </Typography>
        <VideoList />
      </Box>
    </SubscriptionGuard>
  );
}
