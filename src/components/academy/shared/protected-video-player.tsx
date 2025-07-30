import React from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { Lock } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useModuleAccess } from '@/hooks/use-module-access';
import type { ModuleType } from '@/types/module-permission';
import { HLSVideoPlayer } from './hls-video-player';

interface ProtectedVideoPlayerProps {
  videoId: string;
  moduleType: ModuleType;
  videoUrl?: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
}

export function ProtectedVideoPlayer({
  videoId,
  moduleType,
  videoUrl,
  thumbnailUrl,
  title: _title,
  description: _description
}: ProtectedVideoPlayerProps) {
  const { hasAccess, loading } = useModuleAccess(moduleType);
  const router = useRouter();
  const { t } = useTranslation('academy');

  if (loading) {
    return (
      <Box
        sx={{
          position: 'relative',
          paddingTop: '56.25%', // 16:9 aspect ratio
          bgcolor: 'grey.900',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (!hasAccess) {
    return (
      <Box
        sx={{
          position: 'relative',
          paddingTop: '56.25%', // 16:9 aspect ratio
          bgcolor: 'grey.900',
          borderRadius: 2,
          overflow: 'hidden',
          backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            p: 3,
          }}
        >
          <Lock sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
            {t('video.accessRequired')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.300', mb: 3, textAlign: 'center' }}>
            {t('video.needSubscriptionOrPermission')}
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/academy/subscription/plans')}
          >
            {t('video.viewPlans')}
          </Button>
        </Box>
      </Box>
    );
  }

  // User has access - render the video player
  const videoSrc = videoUrl || `/api/videos/${videoId}`;
  
  return (
    <HLSVideoPlayer
      src={videoSrc}
      poster={thumbnailUrl}
      autoplay={false}
      controls
      fluid
      responsive
      qualityLevels
      onProgress={(percent) => {
        // You can track video progress here
        console.log(`Video progress: ${percent.toFixed(2)}%`);
      }}
      onError={(error) => {
        console.error('Video playback error:', error);
      }}
    />
  );
}