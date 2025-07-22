'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { useModuleAccess } from '@/hooks/use-module-access';
import { ModuleAccessGuard } from '@/components/guards/ModuleAccessGuard';
import { ModuleType } from '@/types/module-permission';
import MasterClasesIntro from '@/components/academy/mentorship/masterclases-intro';
import MentorshipVideoList from '@/components/academy/mentorship/video-list';

export default function MentorshipPage() {
  const router = useRouter();
  const { t } = useTranslation('academy');
  const [viewVideos, setViewVideos] = useState(false);
  const { hasAccess, loading } = useModuleAccess(ModuleType.MasterClasses);
  
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
      router.push('/academy/subscription/plans?highlight=MasterClases');
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
        <MasterClasesIntro 
          onStart={handleCTA}
          ctaText={hasAccess ? t('masterclass.viewVideos') : t('masterclass.getAccess')}
        />
      </Box>
    );
  }

  // Show videos for subscribers with module access guard
  return (
    <ModuleAccessGuard
      moduleType={ModuleType.MasterClasses}
      fallback={
        <Box sx={{ minHeight: '100vh', width: '100%', p: 3 }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => setViewVideos(false)}
            sx={{ mb: 2 }}
          >
            {t('masterclass.backToIntro')}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              {t('masterclass.accessRequired')}
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              {t('masterclass.needSubscriptionOrPermission')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/academy/subscription/plans?highlight=MasterClases')}
            >
              {t('masterclass.viewPlans')}
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
            {t('masterclass.backToIntro')}
          </Button>
          
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {t('masterclass.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('masterclass.description')}
          </Typography>
        </Box>
        <MentorshipVideoList />
      </Box>
    </ModuleAccessGuard>
  );
}