'use client';

import React, { useState, useEffect } from 'react';
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
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { Clock } from '@phosphor-icons/react/dist/ssr/Clock';
import { CheckCircle } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Monitor } from '@phosphor-icons/react/dist/ssr/Monitor';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ProfessionalVideoPlayer } from '@/components/academy/video/professional-video-player';
import { videoService } from '@/services/api/video.service';
import API from '@/lib/axios';

export default function ClassVideoPlayerPage() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation('academy');
  const params = useParams<{ videoKey: string }>();
  const searchParams = useSearchParams();
  const [hasWatched, setHasWatched] = useState(false);
  
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
  const userProgress = null;
  
  // Extract video name from key
  const extractVideoName = (key: string): string => {
    const parts = key.split('/');
    const filename = parts[parts.length - 1];
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    
    // Check if it's a date format (YYYY-MM-DD HH:MM:SS)
    const dateMatch = nameWithoutExt.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
    if (dateMatch) {
      const [, date, hour, minute, second] = dateMatch;
      return t('liveRecorded.video.sessionTitle', { date, time: `${hour}:${minute}` });
    }
    
    return nameWithoutExt
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };
  
  // Handle video progress
  const handleProgress = (progress: number) => {
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
            {t('liveRecorded.video.errorLoading')}
          </Typography>
          <Typography variant="body2">
            {videoError ? t('liveRecorded.video.failedToLoad') : t('liveRecorded.video.notFound')}
          </Typography>
        </Alert>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.push('/academy/live-sessions#videos')}
        >
          {t('liveRecorded.video.backToSessions')}
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.push('/academy/live-sessions#videos')}
          sx={{ mb: 2 }}
        >
          {t('liveRecorded.video.backToSessions')}
        </Button>
        
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Monitor size={32} weight="duotone" color={theme.palette.primary.main} />
          <Box flex={1}>
            <Typography variant="h4" gutterBottom>
              {extractVideoName(videoKey)}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={<Monitor size={16} />}
                label={t('liveRecorded.video.liveRecording')}
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
                <ProfessionalVideoPlayer
                  video={{
                    id: videoKey,
                    title: extractVideoName(videoKey),
                    description: `Recorded live session: ${extractVideoName(videoKey)}`,
                    duration: 0, // Will be set by video player
                    instructor: 'Trading Academy',
                    thumbnail: '',
                  }}
                  src={finalVideoUrl}
                  onProgress={handleProgress}
                  onComplete={() => {
                    // TODO: Enable when backend endpoints are implemented
                  }}
                />
              </Box>
            </Box>
          </Card>
          
          {/* Video Description */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('liveRecorded.video.aboutTitle')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('liveRecorded.video.aboutDescription')}
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('liveRecorded.video.whatToExpect')}
                </Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    • {t('liveRecorded.video.expectations.analysis')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {t('liveRecorded.video.expectations.examples')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {t('liveRecorded.video.expectations.qa')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {t('liveRecorded.video.expectations.technical')}
                  </Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Live Session Info Card */}
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Monitor size={28} weight="duotone" color={theme.palette.primary.main} />
                <Typography variant="h6">
                  {t('liveRecorded.video.liveSessionRecording')}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {t('liveRecorded.video.recordingDescription')}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Alert severity="info">
                  <Typography variant="body2">
                    💡 {t('liveRecorded.video.tip')}
                  </Typography>
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}