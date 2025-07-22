'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  useTheme,
} from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { Brain } from '@phosphor-icons/react/dist/ssr/Brain';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ProfessionalVideoPlayer } from '@/components/academy/video/professional-video-player';
import { ProtectedVideoPlayer } from '@/components/academy/shared/protected-video-player';
import { ModuleType } from '@/types/module-permission';
import { useModuleAccess } from '@/hooks/use-module-access';
import API from '@/lib/axios';

export default function PsicoTradingVideoPlayerPage() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation('academy');
  const params = useParams<{ videoKey: string }>();
  const searchParams = useSearchParams();
  const [_hasWatched, _setHasWatched] = useState(false);
  const { hasAccess } = useModuleAccess(ModuleType.Psicotrading);
  
  // Decode the video key
  const videoKey = decodeURIComponent(params.videoKey);
  
  // Get the signed URL from query params
  const signedUrl = searchParams.get('url');
  const videoUrl = signedUrl ? decodeURIComponent(signedUrl) : null;
  
  // Only fetch if we don't have the URL from params
  const { data: videoData, isLoading: loadingVideo, error: videoError } = useQuery({
    queryKey: ['video-url', videoKey],
    queryFn: async () => {
      // If we have the URL from params, return it directly
      if (videoUrl) {
        return { videoUrl };
      }
      // Otherwise, fetch from API (fallback for direct navigation)
      const response = await API.get(`/videos/videos/${encodeURIComponent(videoKey)}`);
      return response.data;
    },
    retry: 1,
    enabled: true,
  });
  
  // Fetch user's progress for this video
  // TODO: Enable when backend endpoints are implemented
  const _userProgress = null;
  
  // Extract video name from key
  const extractVideoName = (key: string): string => {
    const parts = key.split('/');
    const filename = parts[parts.length - 1];
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    return nameWithoutExt
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };
  
  // Handle video progress
  const handleProgress = (_progress: number) => {
    // TODO: Enable when backend endpoints are implemented
  };
  
  if (loadingVideo && !videoUrl) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  const finalVideoUrl = videoData?.videoUrl || videoUrl;
  
  if (videoError || !finalVideoUrl) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t('psicotrading.video.errorLoading')}
          </Typography>
          <Typography variant="body2">
            {videoError ? t('psicotrading.video.failedToLoad') : t('psicotrading.video.notFound')}
          </Typography>
        </Alert>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.push('/academy/psicotrading#videos')}
        >
          {t('psicotrading.video.backToPsicoTrading')}
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.push('/academy/psicotrading#videos')}
          sx={{ mb: 2 }}
        >
          {t('psicotrading.video.backToPsicoTrading')}
        </Button>
        
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Brain size={32} weight="duotone" color={theme.palette.primary.main} />
          <Box flex={1}>
            <Typography variant="h4" gutterBottom>
              {extractVideoName(videoKey)}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={<Brain size={16} />}
                label={t('psicotrading.video.psicoTrading')}
                size="small"
                color="primary"
                variant="outlined"
              />
              {/* TODO: Show duration when metadata is available
              <Chip
                icon={<Clock size={16} />}
                label="Duration will update when video loads"
                size="small"
                variant="outlined"
              />
              */}
              {/* TODO: Show completed status when progress tracking is implemented
              {(userProgress?.completedAt || hasWatched) && (
                <Chip
                  icon={<CheckCircle size={16} />}
                  label="Completed"
                  size="small"
                  color="success"
                />
              )}
              */}
            </Stack>
          </Box>
        </Stack>
      </Box>
      
      {/* Video Player */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              overflow: 'hidden',
              bgcolor: 'background.paper',
              boxShadow: theme.shadows[8],
            }}
          >
            <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 */ }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              >
                {hasAccess ? (
                  <ProfessionalVideoPlayer
                    video={{
                      id: videoKey,
                      title: extractVideoName(videoKey),
                      description: `PsicoTrading lesson: ${extractVideoName(videoKey)}`,
                      duration: 0, // Will be set by video player
                      instructor: t('psicotrading.video.instructor'),
                      thumbnail: '',
                    }}
                    src={finalVideoUrl}
                    onProgress={handleProgress}
                    onComplete={() => {
                      // TODO: Enable when backend endpoints are implemented
                    }}
                  />
                ) : (
                  <ProtectedVideoPlayer
                    videoId={videoKey}
                    moduleType={ModuleType.Psicotrading}
                    videoUrl={finalVideoUrl}
                    title={extractVideoName(videoKey)}
                    description={`PsicoTrading lesson: ${extractVideoName(videoKey)}`}
                  />
                )}
              </Box>
            </Box>
          </Card>
          
          {/* Video Description */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('psicotrading.video.aboutTitle')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('psicotrading.video.aboutDescription')}
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('psicotrading.video.keyLearningPoints')}
                </Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    • {t('psicotrading.video.points.understanding')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {t('psicotrading.video.points.managing')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {t('psicotrading.video.points.developing')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {t('psicotrading.video.points.building')}
                  </Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Psychology Tips Card */}
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Brain size={28} weight="duotone" color={theme.palette.primary.main} />
                <Typography variant="h6">
                  {t('psicotrading.video.psychologyTips')}
                </Typography>
              </Stack>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    🧠 {t('psicotrading.video.tips.mentalPrep.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('psicotrading.video.tips.mentalPrep.description')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    📝 {t('psicotrading.video.tips.takeNotes.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('psicotrading.video.tips.takeNotes.description')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    🎯 {t('psicotrading.video.tips.practice.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('psicotrading.video.tips.practice.description')}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}