'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useClientAuth } from '@/hooks/use-client-auth';
import { Box, Button, Typography } from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react';

import { Role, SubscriptionPlan } from '@/types/user';
import PsicoTradingVideoList from '@/components/academy/psicotrading/psicotrading-video-list';
import PsicoTradingIntro from '@/components/academy/psicotrading/psicotrading-intro';

export default function Page() {
  const [viewVideos, setViewVideos] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('academy');

  // Use the client auth hook
  const { user, isLoading } = useClientAuth();
  const userSubscriptions = user?.subscriptions ?? [];
  const userRole = user?.role || Role.USER;
  // Check for PSICOTRADING subscription with expiration
  const hasSubscriptionAccess = userSubscriptions.some(sub => {
    if (typeof sub === 'string') {
      return sub === (SubscriptionPlan.PSICOTRADING as string);
    } else if (sub && typeof sub === 'object' && 'plan' in sub) {
      // Check if it's Psicotrading plan
      if (sub.plan === (SubscriptionPlan.PSICOTRADING as string)) {
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
  
  // Debug logging
  console.log('PsicoTrading Access Check:', {
    user,
    userRole,
    hasAccess,
    hasSubscriptionAccess,
    isAdmin,
    Role_ADMIN: Role.ADMIN,
    Role_USER: Role.USER
  });
  
  // Check URL hash on mount and handle navigation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#videos') {
      setViewVideos(true);
    }
  }, []);

  const handleCTA = () => {
    if (hasAccess) {
      setViewVideos(true);
    } else {
      router.push('/academy/subscription/plans?highlight=Psicotrading');
    }
  };
  
  // Don&apos;t render until auth is loaded to prevent redirect issues
  if (isLoading) {
    return null;
  }

  return (
    <Box>
      {/* Show videos section when user has access and clicked to view */}
      {viewVideos && hasAccess ? (
        <Box sx={{ p: 3 }}>
          {/* Header with back button */}
          <Box sx={{ mb: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => setViewVideos(false)}
              startIcon={<ArrowLeft size={20} />}
              sx={{ mb: 2 }}
            >
              {t('psicotrading.backToStart')}
            </Button>
            
            <Typography variant="h4" fontWeight={700}>
              {t('psicotrading.videosTitle')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {t('psicotrading.videosDescription')}
            </Typography>
          </Box>

          {/* Video list component */}
          <PsicoTradingVideoList />
        </Box>
      ) : (
        /* Show intro page - accessible to all users */
        <PsicoTradingIntro 
          onStart={handleCTA} 
          ctaText={hasAccess ? t('psicotrading.accessVideos') : t('psicotrading.startPsicoTrading')} 
        />
      )}
    </Box>
  );
}