'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Box, Button, Typography } from '@mui/material';
import { DownloadSimple } from '@phosphor-icons/react';

import { Role, SubscriptionPlan } from '@/types/user';
import { SubscriptionGuard } from '@/components/dashboard/subscriptions/subscription-guard';
import SuperacionVideoList from '@/components/dashboard/superation/superacion-video-list';
import SuperacionIntro from '@/components/dashboard/superation/superation-intro';

export default function PropositoPage() {
  const [viewVideos, setViewVideos] = useState(false);
  const router = useRouter();

  const userSubscriptions = useAuthStore((state) => state.user?.subscriptions ?? []);
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || 'user';
  const hasAccess = userSubscriptions.includes(SubscriptionPlan.MONEYPEACE) || userRole === Role.ADMIN;

  const handleCTA = () => {
    if (hasAccess) {
      setViewVideos(true);
    } else {
      router.push('/dashboard/subscription/plans');
    }
  };

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
          Paz con el Dinero
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
            AUTOINDAGACIÓN 1 (en lección 7)
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
            AUTOINDAGACIÓN 2 (en lección 14)
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
            AUTOINDAGACIÓN 3 (en lección 21)
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
            Descargar Ebook
          </Button>
        </Box>
      </Box>

      {/* Content */}
      {viewVideos ? (
        <SubscriptionGuard requiredSubscription={SubscriptionPlan.MONEYPEACE}>
          <>
            <Box sx={{ textAlign: 'left', mb: 2 }}>
              <Button variant="outlined" onClick={() => setViewVideos(false)}>
                ← Volver a la introducción
              </Button>
            </Box>
            <SuperacionVideoList courseKey="curso1" />
          </>
        </SubscriptionGuard>
      ) : (
        <SuperacionIntro onStart={handleCTA} ctaText={hasAccess ? 'Ver Videos' : 'Quiero empezar el cambio interior'} />
      )}
    </Box>
  );
}
