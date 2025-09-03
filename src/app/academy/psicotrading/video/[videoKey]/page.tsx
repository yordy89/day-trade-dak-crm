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
  alpha,
  Grid,
} from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ProfessionalVideoPlayer } from '@/components/academy/video/professional-video-player';
import { ProtectedVideoPlayer } from '@/components/academy/shared/protected-video-player';
import { ModuleType } from '@/types/module-permission';
import { useModuleAccess } from '@/hooks/use-module-access';
import PsicoTradingVideoList from '@/components/academy/psicotrading/psicotrading-video-list';
import { psicotradingMappings, getVideoTitle } from '@/data/video-mappings';
import API from '@/lib/axios';

export default function PsicoTradingVideoPlayerPage() {
  const router = useRouter();
  const { t } = useTranslation('academy');
  const params = useParams<{ videoKey: string }>();
  const searchParams = useSearchParams();
  const { hasAccess } = useModuleAccess(ModuleType.PSICOTRADING);
  
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
  
  // Extract video name from key using the mapping
  const extractVideoName = (key: string): string => {
    // Extract the folder name from the path structure
    // Example: hsl-daytradedak-videos/psicotrading-curso1/1_Introduccion/360p/playlist.m3u8
    const pathParts = key.split('/');
    const folderName = pathParts[2] || ''; // This gets the folder name
    
    // Get title from mapping
    const { title } = getVideoTitle(folderName, psicotradingMappings);
    
    // If we have a mapped title, use it
    if (title && title !== folderName) {
      return title;
    }
    
    // Fallback formatting for unmapped videos
    const cleanName = folderName
      .replace(/^\d+_/, '') // Remove leading numbers
      .replace(/_/g, ' ')
      .replace(/Leccion/gi, 'Lección')
      .replace(/teoria/gi, 'Teoría')
      .replace(/practica/gi, 'Práctica')
      .replace(/\b\w/g, (l) => l.toUpperCase());
    
    return cleanName || 'PsicoTrading';
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
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        position: 'relative',
      }}
    >
      {/* Background gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${alpha('#0a0a0a', 0.92)} 0%, ${alpha('#16a34a', 0.85)} 30%, ${alpha('#991b1b', 0.85)} 70%, ${alpha('#0a0a0a', 0.92)} 100%)`,
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Header */}
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.push('/academy/psicotrading#videos')}
          sx={{ 
            mb: 4,
            color: 'white',
            '&:hover': {
              backgroundColor: alpha('#ffffff', 0.1),
            },
          }}
        >
          {t('psicotrading.video.backToPsicoTrading')}
        </Button>

        <Grid container spacing={4}>
          {/* Main Video Column */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" fontWeight={700} sx={{ color: 'white', mb: 2 }}>
                {extractVideoName(videoKey)}
              </Typography>
              <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.7) }}>
                PsicoTrading - {t('psicotrading.video.mindsetDevelopment')}
              </Typography>
            </Box>
          
            {/* Video Player */}
            <Box
              sx={{
                backgroundColor: '#000',
                borderRadius: 2,
                overflow: 'hidden',
                aspectRatio: '16/9',
                mb: 4,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              }}
            >
              {hasAccess ? (
                <ProfessionalVideoPlayer
                  video={{
                    id: videoKey,
                    title: extractVideoName(videoKey),
                    description: t('psicotrading.video.description'),
                    duration: 0, // Will be set by video player
                    instructor: 'Jorge Armando',
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
                  moduleType={ModuleType.PSICOTRADING}
                  videoUrl={finalVideoUrl}
                  title={extractVideoName(videoKey)}
                  description={t('psicotrading.video.description')}
                />
              )}
            </Box>
            
            {/* Video Info Card */}
            <Card 
              sx={{ 
                backgroundColor: alpha('#ffffff', 0.05),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha('#22c55e', 0.2)}`,
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  {t('psicotrading.video.aboutTitle')}
                </Typography>
                <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.8), mb: 3 }}>
                  {t('psicotrading.video.aboutDescription')}
                </Typography>
                
                <Box>
                  <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
                    {t('psicotrading.video.keyTopics')}
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                      • {t('psicotrading.video.topics.psychology')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                      • {t('psicotrading.video.topics.emotions')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                      • {t('psicotrading.video.topics.discipline')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                      • {t('psicotrading.video.topics.confidence')}
                    </Typography>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Sidebar with Video List */}
          <Grid item xs={12} lg={4}>
            <Box
              sx={{
                position: 'sticky',
                top: 24,
                maxHeight: 'calc(100vh - 48px)',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: alpha('#ffffff', 0.05),
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: alpha('#ffffff', 0.2),
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.3),
                  },
                },
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                {t('psicotrading.video.allLessons')}
              </Typography>
              <PsicoTradingVideoList />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}