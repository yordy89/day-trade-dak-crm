'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { useClientAuth } from '@/hooks/use-client-auth';
import { SubscriptionPlan, Role } from '@/types/user';
import ClassIntro from '@/components/academy/class/class-intro';
import ClassVideoList from '@/components/academy/class/class-video-list';

export default function ClassesPage(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation('academy');
  const [viewVideos, setViewVideos] = useState(false);
  const { user } = useClientAuth();
  const userSubscriptions = user?.subscriptions || [];
  const userRole = user?.role;
  
  // Check URL hash on mount and handle navigation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#videos') {
      setViewVideos(true);
    }
  }, []);
  
  // Check for LIVE_RECORDED subscription with expiration
  const hasSubscriptionAccess = userSubscriptions.some(sub => {
    if (typeof sub === 'string') {
      return sub === (SubscriptionPlan.LiveRecorded as string);
    } else if (sub && typeof sub === 'object' && 'plan' in sub) {
      // Check if it's LiveRecorded plan
      if (sub.plan === (SubscriptionPlan.LiveRecorded as string)) {
        // If no expiresAt field, it's a permanent subscription
        if (!('expiresAt' in sub) || !sub.expiresAt) {
          return true;
        }
        // If has expiresAt, check if not expired
        return new Date(sub.expiresAt) > new Date();
      }
    }
    return false;
  });

  // Admin always has access
  const isAdmin = userRole === Role.ADMIN;
  
  const hasAccess = hasSubscriptionAccess || isAdmin;

  const handleCTA = () => {
    if (hasAccess) {
      setViewVideos(true);
    } else {
      router.push('/academy/subscription/plans?highlight=LiveRecorded');
    }
  };

  // Show intro page first, then videos for subscribers
  if (!viewVideos) {
    return (
      <Box sx={{ minHeight: '100vh', width: '100%' }}>
        <ClassIntro 
          onStart={handleCTA}
          ctaText={hasAccess ? t('liveRecorded.viewLiveClasses') : t('liveRecorded.getAccess')}
        />
      </Box>
    );
  }

  // Show videos for subscribers
  return (
    <Box sx={{ minHeight: '100vh', width: '100%', p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => setViewVideos(false)}
          sx={{ mb: 2 }}
        >
          {t('liveRecorded.back')}
        </Button>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {t('liveRecorded.libraryTitle')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('liveRecorded.libraryDescription')}
        </Typography>
      </Box>
      <ClassVideoList />
    </Box>
  );
}
