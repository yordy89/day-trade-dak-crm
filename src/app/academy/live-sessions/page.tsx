'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { useModuleAccess } from '@/hooks/use-module-access';
import { ModuleAccessGuard } from '@/components/guards/ModuleAccessGuard';
import { ModuleType } from '@/types/module-permission';
import ClassIntro from '@/components/academy/class/class-intro';
import ClassVideoList from '@/components/academy/class/class-video-list';

export default function ClassesPage(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation('academy');
  const [viewVideos, setViewVideos] = useState(false);
  const { hasAccess, loading } = useModuleAccess(ModuleType.LiveRecorded);
  
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
      router.push('/academy/subscription/plans?highlight=LiveRecorded');
    }
  };

  // Don't render until auth is loaded to prevent redirect issues
  if (loading) {
    return <Box />;
  }

  // Show intro page first, then videos for subscribers
  if (!viewVideos) {
    return (
      <Box sx={{ minHeight: '100vh', width: '100%' }}>
        <ClassIntro 
          onStart={handleCTA}
          ctaText={hasAccess ? t('liveRecorded.viewVideos') : t('liveRecorded.getAccess')}
        />
      </Box>
    );
  }

  // Show videos for subscribers with module access guard
  return (
    <ModuleAccessGuard
      moduleType={ModuleType.LiveRecorded}
      fallback={
        <Box sx={{ minHeight: '100vh', width: '100%', p: 3 }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => setViewVideos(false)}
            sx={{ mb: 2 }}
          >
            {t('liveRecorded.backToIntro')}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              {t('liveRecorded.accessRequired')}
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              {t('liveRecorded.needSubscriptionOrPermission')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/academy/subscription/plans?highlight=LiveRecorded')}
            >
              {t('liveRecorded.viewPlans')}
            </Button>
          </Box>
        </Box>
      }
    >
      <Box sx={{ minHeight: '100vh', width: '100%', p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => setViewVideos(false)}
            sx={{ mb: 2 }}
          >
            {t('liveRecorded.backToIntro')}
          </Button>
          
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {t('liveRecorded.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('liveRecorded.description')}
          </Typography>
        </Box>
        <ClassVideoList />
      </Box>
    </ModuleAccessGuard>
  );
}