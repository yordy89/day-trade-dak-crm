'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { Calendar } from '@/components/academy/calendar/calendar';
import { ModuleAccessGuard } from '@/components/guards/ModuleAccessGuard';
import { ModuleType } from '@/types/module-permission';

export default function CalendarPage() {
  const router = useRouter();
  const { t } = useTranslation('academy');
  
  return (
    <ModuleAccessGuard
      moduleType={ModuleType.CommunityEvents}
      fallback={
        <Box sx={{ minHeight: '100vh', width: '100%', p: 3 }}>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              {t('calendar.accessRequired')}
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              {t('calendar.needSubscriptionOrPermission')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/academy/subscription/plans?highlight=Pro')}
            >
              {t('calendar.viewPlans')}
            </Button>
          </Box>
        </Box>
      }
    >
      <Box sx={{ height: '100vh', width: '100%', p: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          {t('calendar.title')}
        </Typography>
        <Calendar />
      </Box>
    </ModuleAccessGuard>
  );
}
