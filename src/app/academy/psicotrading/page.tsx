'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Box, Button, Typography } from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react';

import { useModuleAccess } from '@/hooks/use-module-access';
import { ModuleAccessGuard } from '@/components/guards/ModuleAccessGuard';
import { ModuleType } from '@/types/module-permission';
import PsicoTradingVideoList from '@/components/academy/psicotrading/psicotrading-video-list';
import PsicoTradingIntro from '@/components/academy/psicotrading/psicotrading-intro';

export default function Page() {
  const [viewVideos, setViewVideos] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('academy');
  const { hasAccess, loading } = useModuleAccess(ModuleType.PSICOTRADING);
  
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
  
  // Don't render until auth is loaded to prevent redirect issues
  if (loading) {
    return <Box />;
  }

  return (
    <Box>
      {/* Show videos section when user has access and clicked to view */}
      {viewVideos && hasAccess ? (
        <ModuleAccessGuard 
          moduleType={ModuleType.PSICOTRADING}
          fallback={
            <Box sx={{ p: 3 }}>
              <Button 
                variant="outlined" 
                onClick={() => setViewVideos(false)}
                startIcon={<ArrowLeft size={20} />}
                sx={{ mb: 2 }}
              >
                {t('psicotrading.backToStart')}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  {t('psicotrading.accessRequired')}
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                  {t('psicotrading.needSubscriptionOrPermission')}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => router.push('/academy/subscription/plans?highlight=Psicotrading')}
                >
                  {t('psicotrading.viewPlans')}
                </Button>
              </Box>
            </Box>
          }
        >
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
        </ModuleAccessGuard>
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