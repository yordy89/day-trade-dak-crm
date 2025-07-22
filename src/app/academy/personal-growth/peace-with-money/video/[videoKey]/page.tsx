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
  useTheme,
  alpha,
} from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { HandsPraying } from '@phosphor-icons/react/dist/ssr/HandsPraying';
import { Calendar } from '@phosphor-icons/react/dist/ssr/Calendar';
import { Sparkle } from '@phosphor-icons/react/dist/ssr/Sparkle';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ProfessionalVideoPlayer } from '@/components/academy/video/professional-video-player';
import { ProtectedVideoPlayer } from '@/components/academy/shared/protected-video-player';
import { ModuleType } from '@/types/module-permission';
import { useModuleAccess } from '@/hooks/use-module-access';
import API from '@/lib/axios';
import { getVideosDescriptions } from '@/data/curso1';
import { useTranslation } from 'react-i18next';

export default function PeaceWithMoneyVideoPlayerPage() {
  const theme = useTheme();
  const router = useRouter();
  const { t, i18n } = useTranslation('academy');
  const params = useParams<{ videoKey: string }>();
  const searchParams = useSearchParams();
  const { hasAccess } = useModuleAccess(ModuleType.PeaceWithMoney);
  
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
  
  // Extract video info from key
  const extractVideoInfo = (key: string): { title: string; lessonNumber: number | null; description: string } => {
    const parts = key.split('/');
    const filename = parts[parts.length - 1];
    const match = /^(?<id>\d+)_(?<title>[\w_]+)\.mp4$/iu.exec(filename);
    const id = match?.groups?.id ? parseInt(match.groups.id, 10) : null;
    const title = match?.groups?.title?.replace(/_/g, ' ') ?? filename.replace(/\.[^/.]+$/, '');
    
    const videosDescriptions = getVideosDescriptions(i18n.language);
    const rawDescription = videosDescriptions.find((d) => d.id === id)?.description ?? '';
    
    return {
      title: title.replace('.mp4', ''),
      lessonNumber: id,
      description: rawDescription,
    };
  };
  
  const videoInfo = extractVideoInfo(videoKey);
  
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
            {t('peaceWithMoney.video.errorLoading')}
          </Typography>
          <Typography variant="body2">
            {videoError ? t('peaceWithMoney.video.failedToLoad') : t('peaceWithMoney.video.notFound')}
          </Typography>
        </Alert>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.push('/academy/personal-growth/peace-with-money#videos')}
        >
          {t('peaceWithMoney.video.backToPeaceWithMoney')}
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.push('/academy/personal-growth/peace-with-money#videos')}
          sx={{ mb: 2 }}
        >
          {t('peaceWithMoney.video.backToPeaceWithMoney')}
        </Button>
        
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <HandsPraying size={32} weight="duotone" color={theme.palette.secondary.main} />
          <Box flex={1}>
            <Typography variant="h4" gutterBottom>
              {videoInfo.title}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={<HandsPraying size={16} />}
                label={t('peaceWithMoney.title')}
                size="small"
                color="secondary"
                variant="outlined"
              />
              {videoInfo.lessonNumber ? (
                <Chip
                  icon={<Calendar size={16} />}
                  label={t('peaceWithMoney.video.day', { day: videoInfo.lessonNumber })}
                  size="small"
                  variant="outlined"
                />
              ) : null}
              {/* Special badge for specific lessons */}
              {videoInfo.lessonNumber && [7, 14, 21].includes(videoInfo.lessonNumber) ? (
                <Chip
                  icon={<Sparkle size={16} />}
                  label={t('peaceWithMoney.video.specialSession')}
                  size="small"
                  color="warning"
                />
              ) : null}
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
                      title: videoInfo.title,
                      description: t('peaceWithMoney.video.videoDescription', { day: videoInfo.lessonNumber, title: videoInfo.title }),
                      duration: 0, // Will be set by video player
                      instructor: t('peaceWithMoney.video.instructor'),
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
                    moduleType={ModuleType.PeaceWithMoney}
                    videoUrl={finalVideoUrl}
                    title={videoInfo.title}
                    description={t('peaceWithMoney.video.videoDescription', { day: videoInfo.lessonNumber, title: videoInfo.title })}
                  />
                )}
              </Box>
            </Box>
          </Card>
          
          {/* Video Description */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('peaceWithMoney.video.aboutThisLesson')}
              </Typography>
              {videoInfo.description ? (
                <Stack spacing={2}>
                  {videoInfo.description.split(';').map((phrase, _index) => {
                    const trimmedPhrase = phrase.trim();
                    if (!trimmedPhrase) return null;
                    
                    return (
                      <Box 
                        key={`phrase-${trimmedPhrase.substring(0, 20)}`}
                        sx={{ 
                          p: 2, 
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          borderLeft: `4px solid ${theme.palette.primary.main}`,
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body1" color="text.primary">
                          {trimmedPhrase}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  {t('peaceWithMoney.video.defaultDescription')}
                </Typography>
              )}
              
              {videoInfo.lessonNumber && [7, 14, 21].includes(videoInfo.lessonNumber) ? <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    <strong>{t('peaceWithMoney.video.specialSessionTitle')}</strong> {t('peaceWithMoney.video.specialSessionDescription')}
                  </Typography>
                </Alert> : null}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Peace with Money Tips Card */}
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <HandsPraying size={28} weight="duotone" color={theme.palette.secondary.main} />
                <Typography variant="h6">
                  {t('peaceWithMoney.video.dailyPractice')}
                </Typography>
              </Stack>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    🧘 {t('peaceWithMoney.video.practices.morningReflection.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('peaceWithMoney.video.practices.morningReflection.description')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    📝 {t('peaceWithMoney.video.practices.journalInsights.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('peaceWithMoney.video.practices.journalInsights.description')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    💚 {t('peaceWithMoney.video.practices.practiceAcceptance.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('peaceWithMoney.video.practices.practiceAcceptance.description')}
                  </Typography>
                </Box>
              </Stack>
              
              {/* Download reminders for special days */}
              {videoInfo.lessonNumber && [7, 14, 21].includes(videoInfo.lessonNumber) ? (
                <Box sx={{ mt: 3 }}>
                  <Alert severity="success">
                    <Typography variant="body2">
                      {t('peaceWithMoney.video.downloadReminder', { day: videoInfo.lessonNumber })}
                    </Typography>
                  </Alert>
                </Box>
              ) : null}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}