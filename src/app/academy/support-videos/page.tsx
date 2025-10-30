'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { useModuleAccess } from '@/hooks/use-module-access';
import { ModuleAccessGuard } from '@/components/guards/ModuleAccessGuard';
import { ModuleType } from '@/types/module-permission';
import SupportVideosIntro from '@/components/academy/support-videos/support-videos-intro';
import SupportVideosVideoList from '@/components/academy/support-videos/support-videos-video-list';
import { paths } from '@/paths';

export default function SupportVideosPage(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation('academy');
  const [viewVideos, setViewVideos] = useState(false);
  const { hasAccess, loading } = useModuleAccess(ModuleType.SUPPORT_VIDEOS);

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
      // Navigate to contact page for users without access
      router.push('/contact');
    }
  };

  // Don't render until auth is loaded to prevent redirect issues
  if (loading) {
    return <Box />;
  }

  // Show intro page first
  if (!viewVideos) {
    return (
      <Box sx={{ minHeight: '100vh', width: '100%' }}>
        <SupportVideosIntro
          onStart={handleCTA}
          ctaText={hasAccess ? t('supportVideos.viewVideos') : t('supportVideos.contactSupport')}
          hasAccess={hasAccess}
        />
      </Box>
    );
  }

  // Show videos for users with access using ModuleAccessGuard
  return (
    <ModuleAccessGuard
      moduleType={ModuleType.SUPPORT_VIDEOS}
      fallback={
        <Box sx={{ minHeight: '100vh', width: '100%', p: 3 }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => setViewVideos(false)}
            sx={{ mb: 2 }}
          >
            {t('supportVideos.backToIntro')}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              {t('supportVideos.accessRequired')}
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              {t('supportVideos.accessDescription')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/contact')}
            >
              {t('supportVideos.contactSupport')}
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
            {t('supportVideos.backToIntro')}
          </Button>

          <Typography variant="h4" fontWeight={700} gutterBottom>
            {t('supportVideos.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('supportVideos.description')}
          </Typography>
        </Box>
        <SupportVideosVideoList />
      </Box>
    </ModuleAccessGuard>
  );
}
