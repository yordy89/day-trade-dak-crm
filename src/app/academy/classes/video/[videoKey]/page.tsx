'use client';

import React from 'react';
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
} from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { BookOpen } from '@phosphor-icons/react/dist/ssr/BookOpen';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ProfessionalVideoPlayer } from '@/components/academy/video/professional-video-player';
import { ProtectedVideoPlayer } from '@/components/academy/shared/protected-video-player';
import { ModuleType } from '@/types/module-permission';
import { useModuleAccess } from '@/hooks/use-module-access';
import API from '@/lib/axios';

export default function ClassesVideoPlayerPage() {
  const router = useRouter();
  const { t } = useTranslation('academy');
  const params = useParams<{ videoKey: string }>();
  const searchParams = useSearchParams();
  const { hasAccess } = useModuleAccess(ModuleType.Classes);
  
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
      const response = await API.get(`/videos/classes/video/${encodeURIComponent(videoKey)}`);
      return response.data;
    },
    retry: 1,
    enabled: true, // Always enabled to handle both cases
  });
  
  // Fetch user's progress for this video
  // TODO: Enable when backend endpoints are implemented
  /*
  const { data: userProgress } = useQuery({
    queryKey: ['user-video-class', videoKey],
    queryFn: async () => {
      const classes = await videoService.getUserVideoClasses();
      return classes.find(vc => vc.s3Key === videoKey) || null;
    },
  });
  */
  
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
    // Only update every 5% to avoid too many API calls
    // if (Math.floor(_progress) % 5 === 0) {
    //   updateProgress.mutate(_progress);
    // }
    
    // Mark as complete when reaching 90%
    // if (_progress >= 90 && !hasWatched && !userProgress?.completedAt) {
    //   completeVideo.mutate();
    // }
  };
  
  // Initialize video class on mount
  // TODO: Enable when backend endpoints are implemented
  // useEffect(() => {
  //   if (videoData && !userProgress) {
  //     createVideoClass.mutate();
  //   }
  // }, [videoData, userProgress]);
  
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
            {t('classes.video.errorLoading')}
          </Typography>
          <Typography variant="body2">
            {videoError ? t('classes.video.failedToLoad') : t('classes.video.notFound')}
          </Typography>
        </Alert>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.push('/academy/classes#videos')}
        >
          {t('classes.video.backToClasses')}
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.push('/academy/classes#videos')}
          sx={{ mb: 2 }}
        >
          {t('classes.video.backToClasses')}
        </Button>
        
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {extractVideoName(videoKey)}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={<BookOpen size={16} />}
                label={t('classes.video.tradingClass')}
                size="small"
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
              backgroundColor: 'black',
              position: 'relative',
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
                      description: `Lesson video for ${extractVideoName(videoKey)}`,
                      duration: 0, // Will be set by video player
                      instructor: 'Trading Academy',
                      thumbnail: '',
                    }}
                    src={finalVideoUrl}
                    onProgress={handleProgress}
                    onComplete={() => {
                      // TODO: Enable when backend endpoints are implemented
                      // completeVideo.mutate()
                    }}
                  />
                ) : (
                  <ProtectedVideoPlayer
                    videoId={videoKey}
                    moduleType={ModuleType.Classes}
                    videoUrl={finalVideoUrl}
                    title={extractVideoName(videoKey)}
                    description={`Lesson video for ${extractVideoName(videoKey)}`}
                  />
                )}
              </Box>
            </Box>
          </Card>
          
          {/* Video Description */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('classes.video.aboutTitle')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('classes.video.aboutDescription')}
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('classes.video.keyTopics')}
                </Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    • {t('classes.video.topics.analysis')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {t('classes.video.topics.risk')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {t('classes.video.topics.entry')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {t('classes.video.topics.examples')}
                  </Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Progress Card - Hidden until backend implementation */}
          {/* TODO: Enable when video progress tracking is implemented
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Progress
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Video Progress
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {userProgress?.progress || 0}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={userProgress?.progress || 0}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  }}
                />
              </Box>
              
              {(userProgress?.completedAt || hasWatched) && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Great job! You&apos;ve completed this lesson.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
          */}
          
          {/* Tips Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('classes.video.learningTips')}
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    📝 {t('classes.video.tips.takeNotes.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('classes.video.tips.takeNotes.description')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    🔄 {t('classes.video.tips.practice.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('classes.video.tips.practice.description')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    ❓ {t('classes.video.tips.askQuestions.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('classes.video.tips.askQuestions.description')}
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