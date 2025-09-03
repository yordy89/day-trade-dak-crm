'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { useModuleAccess } from '@/hooks/use-module-access';
import { ModuleAccessGuard } from '@/components/guards/ModuleAccessGuard';
import { ModuleType } from '@/types/module-permission';
import ClasesIntro from '@/components/academy/clases/clases-intro';
import ClasesVideoList from '@/components/academy/clases/clases-video-list';

export default function ClasesPage(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation('academy');
  const [viewVideos, setViewVideos] = useState(false);
  const { hasAccess, loading: _loading } = useModuleAccess(ModuleType.CLASSES);
  
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
      // Open email to contact support for access
      window.location.href = 'mailto:support@daytradedak.com?subject=Solicitud de Acceso a Clases&body=Hola, me gustaría obtener acceso a las Clases de Trading. Por favor, contáctenme con más información sobre el Master Course.';
    }
  };

  // Show intro page first, then videos for subscribers
  if (!viewVideos) {
    return (
      <Box sx={{ minHeight: '100vh', width: '100%' }}>
        <ClasesIntro 
          onStart={handleCTA}
          ctaText={hasAccess ? t('classes.viewClasses') : t('classes.getAccess')}
          hasAccess={hasAccess}
          daysRemaining={null} // Module permissions handle expiration separately
        />
      </Box>
    );
  }

  // Show videos for subscribers with module access guard
  return (
    <ModuleAccessGuard 
      moduleType={ModuleType.CLASSES}
      fallback={
        <Box sx={{ minHeight: '100vh', width: '100%', p: 3 }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => setViewVideos(false)}
            sx={{ mb: 2 }}
          >
            {t('classes.backToIntro')}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              {t('classes.accessRequired')}
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              {t('classes.needSubscriptionOrPermission')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/academy/subscription/plans?highlight=Classes')}
            >
              {t('classes.viewPlans')}
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
            {t('classes.backToIntro')}
          </Button>
          
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {t('classes.title')} - {t('classes.intensiveCourse')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('classes.courseDescription')}
          </Typography>
        </Box>
        <ClasesVideoList />
      </Box>
    </ModuleAccessGuard>
  );
}