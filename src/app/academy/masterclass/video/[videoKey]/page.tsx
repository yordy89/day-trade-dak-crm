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
import { Crown } from '@phosphor-icons/react/dist/ssr/Crown';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ProfessionalVideoPlayer } from '@/components/academy/video/professional-video-player';
import { videoService } from '@/services/api/video.service';
import API from '@/lib/axios';

export default function MentorshipVideoPlayerPage() {
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
            {t('masterclass.video.errorLoading')}
          </Typography>
          <Typography variant="body2">
            {videoError ? t('masterclass.video.failedToLoad') : t('masterclass.video.notFound')}
          </Typography>
        </Alert>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.push('/academy/masterclass#videos')}
        >
          {t('masterclass.video.backToMasterClasses')}
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.push('/academy/masterclass#videos')}
          sx={{ mb: 2 }}
        >
          {t('masterclass.video.backToMasterClasses')}
        </Button>
        
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Crown size={32} weight="duotone" color={theme.palette.secondary.main} />
          <Box flex={1}>
            <Typography variant="h4" gutterBottom>
              {extractVideoName(videoKey)}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={<Crown size={16} />}
                label={t('masterclass.video.eliteContent')}
                size="small"
                color="secondary"
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
                    description: `Master class elite: ${extractVideoName(videoKey)}`,
                    duration: 0, // Will be set by video player
                    instructor: 'Trading Academy Elite',
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
                {t('masterclass.video.aboutTitle')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('masterclass.video.aboutDescription')}
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('masterclass.video.keyTopics')}
                </Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    • {t('masterclass.video.topics.analysis')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {t('masterclass.video.topics.risk')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {t('masterclass.video.topics.psychology')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {t('masterclass.video.topics.caseStudies')}
                  </Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Elite Content Card */}
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Crown size={28} weight="duotone" color={theme.palette.secondary.main} />
                <Typography variant="h6">
                  {t('masterclass.video.eliteContent')}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {t('masterclass.video.eliteDescription')}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Alert severity="info" sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                  <Typography variant="body2">
                    💡 {t('masterclass.video.proTip')}
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