'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { useClientAuth } from '@/hooks/use-client-auth';
import { SubscriptionPlan, Role } from '@/types/user';
import MasterClasesIntro from '@/components/academy/mentorship/masterclases-intro';
import MentorshipVideoList from '@/components/academy/mentorship/video-list';

export default function MentorshipPage() {
  const router = useRouter();
  const { t } = useTranslation('academy');
  const [viewVideos, setViewVideos] = useState(false);
  const { user, isLoading } = useClientAuth();
  const userSubscriptions = user?.subscriptions || [];
  const userRole = user?.role;

  // Debug logging
  useEffect(() => {
    if (!isLoading && user) {
      console.log('MasterClass Access Check:', {
        user: user.email,
        subscriptions: userSubscriptions,
        userRole,
        isAdmin: userRole === Role.ADMIN,
      });
    }
  }, [user, userSubscriptions, userRole, isLoading]);
  
  // Check URL hash on mount and handle navigation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#videos') {
      setViewVideos(true);
    }
  }, []);
  
  // Check for MASTER_CLASES subscription with expiration
  const hasSubscriptionAccess = userSubscriptions.some(sub => {
    if (typeof sub === 'string') {
      return sub === SubscriptionPlan.MASTER_CLASES;
    } else if (sub && typeof sub === 'object' && 'plan' in sub) {
      // Check if it's MasterClases plan
      if (sub.plan === SubscriptionPlan.MASTER_CLASES) {
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
      router.push('/academy/subscription/plans?highlight=MasterClases');
    }
  };

  // Don't render until auth is loaded to prevent showing restricted state prematurely
  if (isLoading) {
    return null;
  }

  // Show intro page first, then videos for subscribers
  if (!viewVideos) {
    return (
      <Box sx={{ minHeight: '100vh', width: '100%' }}>
        <MasterClasesIntro 
          onStart={handleCTA}
          ctaText={hasAccess ? t('masterclass.viewMasterClasses') : t('masterclass.getEliteAccess')}
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
          {t('masterclass.back')}
        </Button>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {t('masterclass.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('masterclass.accessDescription')}
        </Typography>
      </Box>
      <MentorshipVideoList />
    </Box>
  );
}
