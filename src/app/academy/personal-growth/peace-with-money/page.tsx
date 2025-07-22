'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Box, Button, Typography } from '@mui/material';
import { DownloadSimple, ArrowLeft } from '@phosphor-icons/react';
import { useModuleAccess } from '@/hooks/use-module-access';
import { ModuleAccessGuard } from '@/components/guards/ModuleAccessGuard';
import { ModuleType } from '@/types/module-permission';
import SuperacionVideoList from '@/components/academy/superation/superacion-video-list';
import SuperacionIntro from '@/components/academy/superation/superation-intro';

export default function PropositoPage() {
  const [viewVideos, setViewVideos] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('academy');
  const { hasAccess, loading } = useModuleAccess(ModuleType.PeaceWithMoney);
  
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
  
  // Don't render until auth is loaded to prevent redirect issues
  if (loading) {
    return <Box />;
  }

  // Show intro page first, then videos for subscribers
  if (!viewVideos) {
    return (
      <Box sx={{ minHeight: '100vh', width: '100%' }}>
        <SuperacionIntro 
          onStart={handleCTA} 
          ctaText={hasAccess ? t('peaceWithMoney.viewVideos') : t('peaceWithMoney.startTransformation')} 
        />
      </Box>
    );
  }

  // Show videos for subscribers with module access guard
  return (
    <ModuleAccessGuard
      moduleType={ModuleType.PeaceWithMoney}
      fallback={
        <Box sx={{ minHeight: '100vh', width: '100%', p: 3 }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => setViewVideos(false)}
            sx={{ mb: 2 }}
          >
            {t('peaceWithMoney.backToIntro')}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              {t('peaceWithMoney.accessRequired')}
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              {t('peaceWithMoney.needSubscriptionOrPermission')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/academy/subscription/plans?highlight=PeaceWithMoney')}
            >
              {t('peaceWithMoney.viewPlans')}
            </Button>
          </Box>
        </Box>
      }
    >
      <Box sx={{ minHeight: '100vh', width: '100%', p: 3 }}>
        {/* Header: Title + Download */}
        <Box
          sx={{
            display: 'flex',
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
        <Box sx={{ textAlign: 'left', mb: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowLeft size={20} />}
            onClick={() => setViewVideos(false)}
          >
            {t('peaceWithMoney.backToIntro')}
          </Button>
        </Box>
        <SuperacionVideoList courseKey="curso1" />
      </Box>
    </ModuleAccessGuard>
  );
}
