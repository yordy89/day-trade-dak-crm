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
import { pazConElDineroMappings, getVideoTitle } from '@/data/video-mappings';

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
    // Extract folder name from HLS path
    // Example: hsl-daytradedak-videos/curso1/1_Leccion_1_teoria/master.m3u8
    const pathParts = key.split('/');
    let folderName = '';
    
    // Try to find the lesson folder (should be at index 2)
    if (pathParts.length >= 3) {
      folderName = pathParts[2];
    } else {
      // Fallback: try to extract from the full path
      const folderMatch = key.match(/\/([^\/]+)\/(?:master|playlist)\.m3u8/);
      if (folderMatch) {
        folderName = folderMatch[1];
      }
    }
    
    // Get title and lesson number from mapping
    const { title, lessonNumber } = getVideoTitle(folderName, pazConElDineroMappings);
    
    // Get description from curso1 data
    const videosDescriptions = getVideosDescriptions(i18n.language);
    const rawDescription = lessonNumber ? 
      videosDescriptions.find((d) => d.id === lessonNumber)?.description ?? '' : '';
    
    return {
      title: title || folderName.replace(/_/g, ' '),
      lessonNumber: lessonNumber || null,
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
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      position: 'relative',
    }}>
      {/* Gradient background overlay */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(135deg, 
          ${alpha('#0a0a0a', 0.92)} 0%, 
          ${alpha('#8b5cf6', 0.85)} 30%, 
          ${alpha('#f59e0b', 0.85)} 70%, 
          ${alpha('#0a0a0a', 0.92)} 100%)`,
        opacity: 0.3,
        pointerEvents: 'none',
      }} />
      
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => router.push('/academy/personal-growth/peace-with-money#videos')}
            sx={{ 
              mb: 2,
              color: 'white',
              '&:hover': {
                backgroundColor: alpha('#ffffff', 0.1),
              },
            }}
          >
            {t('peaceWithMoney.video.backToPeaceWithMoney')}
          </Button>
        
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <HandsPraying size={32} weight="duotone" color={theme.palette.secondary.main} />
          <Box flex={1}>
            <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
              {videoInfo.lessonNumber ? 
                `Día ${videoInfo.lessonNumber}: ${videoInfo.title}` : 
                videoInfo.title
              }
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
                bgcolor: alpha('#1a1a1a', 0.8),
                backdropFilter: 'blur(10px)',
                boxShadow: theme.shadows[8],
                border: `1px solid ${alpha('#ffffff', 0.1)}`,
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
            <Card sx={{ 
              mt: 3,
              bgcolor: alpha('#1a1a1a', 0.8),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha('#ffffff', 0.1)}`,
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
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
                        <Typography variant="body1" sx={{ color: 'white' }}>
                          {trimmedPhrase}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              ) : (
                <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.7) }}>
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
            <Card sx={{
              bgcolor: alpha('#1a1a1a', 0.8),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha('#ffffff', 0.1)}`,
            }}>
              <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <HandsPraying size={28} weight="duotone" color={theme.palette.secondary.main} />
                <Typography variant="h6" sx={{ color: 'white' }}>
                  {t('peaceWithMoney.video.dailyPractice')}
                </Typography>
              </Stack>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'white' }}>
                    🧘 {t('peaceWithMoney.video.practices.morningReflection.title')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                    {t('peaceWithMoney.video.practices.morningReflection.description')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'white' }}>
                    📝 {t('peaceWithMoney.video.practices.journalInsights.title')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                    {t('peaceWithMoney.video.practices.journalInsights.description')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'white' }}>
                    💚 {t('peaceWithMoney.video.practices.practiceAcceptance.title')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                    {t('peaceWithMoney.video.practices.practiceAcceptance.description')}
                  </Typography>
                </Box>
              </Stack>
              
              {/* Download reminders for special days */}
              {videoInfo.lessonNumber && [7, 14, 21].includes(videoInfo.lessonNumber) ? (
                <Box sx={{ mt: 3 }}>
                  <Alert 
                    severity="success"
                    sx={{ 
                      backgroundColor: alpha('#22c55e', 0.1),
                      color: '#22c55e',
                      '& .MuiAlert-icon': {
                        color: '#22c55e',
                      },
                    }}
                  >
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
    </Box>
  );
}