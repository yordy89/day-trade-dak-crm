'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { useModuleAccess } from '@/hooks/use-module-access';
import { ModuleAccessGuard } from '@/components/guards/ModuleAccessGuard';
import { ModuleType } from '@/types/module-permission';
import { SubscriptionPlan } from '@/types/user';
import StocksIntro from '@/components/academy/stocks/stocks-intro';
import StockVideoList from '@/components/academy/stocks/stock-video-list';

export default function StockPage(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation('academy');
  const [viewVideos, setViewVideos] = useState(false);
  const { hasAccess, loading } = useModuleAccess(ModuleType.STOCKS);
  
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
      router.push('/academy/subscription/plans?highlight=Stocks');
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
        <StocksIntro 
          onStart={handleCTA}
          ctaText={hasAccess ? t('stocks.viewVideos') : t('stocks.getAccess')}
        />
      </Box>
    );
  }

  // Show videos for subscribers with module access guard
  return (
    <ModuleAccessGuard
      moduleType={ModuleType.STOCKS}
      fallback={
        <Box sx={{ minHeight: '100vh', width: '100%', p: 3 }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => setViewVideos(false)}
            sx={{ mb: 2 }}
          >
            {t('stocks.backToIntro')}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              {t('stocks.accessRequired')}
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              {t('stocks.needSubscriptionOrPermission')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/academy/subscription/plans?highlight=Stocks')}
            >
              {t('stocks.viewPlans')}
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
            {t('stocks.backToIntro')}
          </Button>
          
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {t('stocks.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('stocks.description')}
          </Typography>
        </Box>
        <StockVideoList />
      </Box>
    </ModuleAccessGuard>
  );
}
