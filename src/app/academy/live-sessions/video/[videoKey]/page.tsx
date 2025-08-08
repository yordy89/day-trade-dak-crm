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
  alpha,
} from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { Monitor } from '@phosphor-icons/react/dist/ssr/Monitor';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ProfessionalVideoPlayer } from '@/components/academy/video/professional-video-player';
import { ProtectedVideoPlayer } from '@/components/academy/shared/protected-video-player';
import { ModuleType } from '@/types/module-permission';
import { useModuleAccess } from '@/hooks/use-module-access';
import API from '@/lib/axios';

export default function ClassVideoPlayerPage() {
  const router = useRouter();
  const { t } = useTranslation('academy');
  const params = useParams<{ videoKey: string }>();
  const searchParams = useSearchParams();
  const { hasAccess } = useModuleAccess(ModuleType.LiveRecorded);
  
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
    // Handle new format: class-daily/07:22:2025/master.m3u8
    const dateRegex = /(?<month>\d{2}):(?<day>\d{2}):(?<year>\d{4})/;
    const dateMatch = dateRegex.exec(key);
    
    if (dateMatch?.groups) {
      const { month, day, year } = dateMatch.groups;
      
      // Map months to Spanish names
      const months: Record<string, string> = {
        '01': 'Enero',
        '02': 'Febrero',
        '03': 'Marzo',
        '04': 'Abril',
        '05': 'Mayo',
        '06': 'Junio',
        '07': 'Julio',
        '08': 'Agosto',
        '09': 'Septiembre',
        '10': 'Octubre',
        '11': 'Noviembre',
        '12': 'Diciembre',
      };
      
      return months[month] && day && year 
        ? `Sesión del ${parseInt(day)} de ${months[month]} ${year}`
        : `Sesión ${month}/${day}/${year}`;
    }
    
    // Fallback for old format
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

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Header */}
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.push('/academy/live-sessions#videos')}
          sx={{ 
            mb: 4,
            color: 'white',
            '&:hover': {
              backgroundColor: alpha('#ffffff', 0.1),
            },
          }}
        >
          {t('liveRecorded.video.backToSessions')}
        </Button>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight={700} sx={{ color: 'white', mb: 2 }}>
            {extractVideoName(videoKey)}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              icon={<Monitor size={16} />}
              label={t('liveRecorded.video.liveRecording')}
              size="small"
              sx={{
                backgroundColor: alpha('#22c55e', 0.2),
                color: '#22c55e',
                borderColor: '#22c55e',
              }}
              variant="outlined"
            />
          </Stack>
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
                description: t('liveRecorded.video.aboutDescription'),
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
          ) : (
            <ProtectedVideoPlayer
              videoId={videoKey}
              moduleType={ModuleType.LiveRecorded}
              videoUrl={finalVideoUrl}
              title={extractVideoName(videoKey)}
              description={t('liveRecorded.video.aboutDescription')}
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
              {t('liveRecorded.video.aboutTitle')}
            </Typography>
            <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.8), mb: 3 }}>
              {t('liveRecorded.video.aboutDescription')}
            </Typography>
            
            <Box>
              <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
                {t('liveRecorded.video.whatToExpect')}
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                  • {t('liveRecorded.video.expectations.analysis')}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                  • {t('liveRecorded.video.expectations.examples')}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                  • {t('liveRecorded.video.expectations.qa')}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                  • {t('liveRecorded.video.expectations.technical')}
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${alpha('#ffffff', 0.1)}` }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Monitor size={24} weight="duotone" color="#22c55e" />
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'white' }}>
                    {t('liveRecorded.video.liveSessionRecording')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6) }}>
                    {t('liveRecorded.video.recordingDescription')}
                  </Typography>
                </Box>
              </Stack>
              
              <Alert 
                severity="info" 
                sx={{ 
                  mt: 2,
                  backgroundColor: alpha('#3b82f6', 0.1),
                  color: '#93c5fd',
                  '& .MuiAlert-icon': {
                    color: '#3b82f6',
                  },
                }}
              >
                <Typography variant="body2">
                  💡 {t('liveRecorded.video.tip')}
                </Typography>
              </Alert>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}