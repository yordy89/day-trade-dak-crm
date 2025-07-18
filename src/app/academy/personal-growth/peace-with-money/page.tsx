'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useClientAuth } from '@/hooks/use-client-auth';
import { Box, Button, Typography } from '@mui/material';
import { DownloadSimple } from '@phosphor-icons/react';

import { Role, SubscriptionPlan } from '@/types/user';
import SuperacionVideoList from '@/components/academy/superation/superacion-video-list';
import SuperacionIntro from '@/components/academy/superation/superation-intro';

export default function PropositoPage() {
  const [viewVideos, setViewVideos] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('academy');

  const { user, isLoading } = useClientAuth();
  const userSubscriptions = user?.subscriptions ?? [];
  const userRole = user?.role || Role.USER;
  // Check for PEACE_WITH_MONEY subscription with expiration
  const hasSubscriptionAccess = userSubscriptions.some(sub => {
    if (typeof sub === 'string') {
      return sub === (SubscriptionPlan.PeaceWithMoney as string);
    } else if (sub && typeof sub === 'object' && 'plan' in sub) {
      // Check if it's Peace with Money plan
      if (sub.plan === (SubscriptionPlan.PeaceWithMoney as string)) {
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
      router.push('/academy/subscription/plans?highlight=PeaceWithMoney');
    }
  };
  
  // Don&apos;t render until auth is loaded to prevent redirect issues
  if (isLoading) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header: Title + Download */}
      <Box
        sx={{
          display: !hasAccess || !viewVideos ? 'none' : 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          {t('navigation.peaceWithMoney')}
        </Typography>
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <Button
            variant="contained"
            startIcon={<DownloadSimple size={20} />}
            style={{fontSize: '0.7rem'}}
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/pdfs/autoindagacion-1.pdf';
              link.download = 'AUTOINDAGACIÓN 1 (en lección 7).pdf';
              link.click();
            }}
          >
            {t('peaceWithMoney.autoInquiry1')}
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadSimple size={20} />}
            style={{fontSize: '0.7rem'}}
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/pdfs/autoindagacion-2.pdf';
              link.download = 'AUTOINDAGACIÓN 2 (en lección 14).pdf';
              link.click();
            }}
          >
            {t('peaceWithMoney.autoInquiry2')}
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadSimple size={20} />}
            style={{fontSize: '0.7rem'}}
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/pdfs/autoindagacion-3.pdf';
              link.download = 'AUTOINDAGACIÓN 3 (en lección 21).pdf';
              link.click();
            }}
          >
            {t('peaceWithMoney.autoInquiry3')}
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadSimple size={20} />}
            style={{fontSize: '0.7rem'}}
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/pdfs/ebook-paz-dinero.pdf';
              link.download = 'EBOOK La Guía definitiva para vivir La Paz con el Dinero.pdf';
              link.click();
            }}
          >
            {t('peaceWithMoney.downloadEbook')}
          </Button>
        </Box>
      </Box>

      {/* Content */}
      {viewVideos && hasAccess ? (
        <>
          <Box sx={{ textAlign: 'left', mb: 2 }}>
            <Button variant="outlined" onClick={() => setViewVideos(false)}>
              {t('peaceWithMoney.backToIntro')}
            </Button>
          </Box>
          <SuperacionVideoList courseKey="curso1" />
        </>
      ) : (
        <SuperacionIntro onStart={handleCTA} ctaText={hasAccess ? t('peaceWithMoney.viewVideos') : t('peaceWithMoney.startTransformation')} />
      )}
    </Box>
  );
}
