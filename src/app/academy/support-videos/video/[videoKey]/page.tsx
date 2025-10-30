'use client';

import React from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  alpha,
} from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ProfessionalVideoPlayer } from '@/components/academy/video/professional-video-player';
import { ProtectedVideoPlayer } from '@/components/academy/shared/protected-video-player';
import { ModuleType } from '@/types/module-permission';
import { useModuleAccess } from '@/hooks/use-module-access';
import API from '@/lib/axios';

export default function SupportVideoPlayerPage() {
  const router = useRouter();
  const { t } = useTranslation('academy');
  const params = useParams<{ videoKey: string }>();
  const searchParams = useSearchParams();
  const { hasAccess } = useModuleAccess(ModuleType.SUPPORT_VIDEOS);

  // Decode the video key
  const videoKey = decodeURIComponent(params.videoKey);

  // Get the signed URL from query params
  const signedUrl = searchParams.get('url');
  const videoUrl = signedUrl ? decodeURIComponent(signedUrl) : null;

  // Only fetch if we don't have the URL from params
  const { data: videoData, isLoading: loadingVideo, error: videoError } = useQuery({
    queryKey: ['support-video-url', videoKey],
    queryFn: async () => {
      // If we have the URL from params, return it directly
      if (videoUrl) {
        return { videoUrl };
      }
      // Otherwise, fetch from API (fallback for direct navigation)
      const response = await API.get(`/videos/supportVideos`);
      const videos = response.data;
      const video = videos.find((v: any) => v.key === videoKey);
      return video ? { videoUrl: video.signedUrl } : null;
    },
    retry: 1,
    enabled: true,
  });

  // Extract video name from key
  const extractVideoName = (): string => {
    // Key structure: hsl-daytradedak-videos/help-videos/VIDEO_FOLDER_NAME/master.m3u8
    // We want to extract VIDEO_FOLDER_NAME
    const parts = videoKey.split('/');

    // Find the folder name (it's the part before master.m3u8 or playlist.m3u8)
    let folderName = '';

    if (parts.length >= 2) {
      // Get the second-to-last part (the folder name before master.m3u8)
      folderName = parts[parts.length - 2];
    }

    // If we couldn't extract a folder name, fall back to filename
    if (!folderName || folderName === 'help-videos') {
      const filename = parts[parts.length - 1];
      folderName = filename.replace(/\.(?:mp4|webm|ogg|m3u8)$/i, '');
    }

    // Clean up the name but preserve the original formatting
    const cleanName = folderName
      .replace(/master/gi, '')
      .replace(/playlist/gi, '')
      .trim();

    return cleanName || t('supportVideos.video.supportGuide');
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
            {t('supportVideos.video.errorLoading')}
          </Typography>
          <Typography variant="body2">
            {videoError ? t('supportVideos.video.failedToLoad') : t('supportVideos.video.notFound')}
          </Typography>
        </Alert>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.push('/academy/support-videos#videos')}
        >
          {t('supportVideos.video.backToSupportVideos')}
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

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.push('/academy/support-videos#videos')}
          sx={{
            mb: { xs: 2, sm: 3, md: 4 },
            color: 'white',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            '&:hover': {
              backgroundColor: alpha('#ffffff', 0.1),
            },
          }}
        >
          {t('supportVideos.video.backToSupportVideos')}
        </Button>

        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="h3" fontWeight={700} sx={{ color: 'white', mb: 2, fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' } }}>
            {extractVideoName()}
          </Typography>
          <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.7), fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            {t('supportVideos.video.supportGuide')}
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
                title: extractVideoName(),
                description: t('supportVideos.video.aboutDescription'),
                duration: 0,
                instructor: 'Support Team',
                thumbnail: '',
              }}
              src={finalVideoUrl}
              onProgress={() => {}}
              onComplete={() => {}}
            />
          ) : (
            <ProtectedVideoPlayer
              videoId={videoKey}
              moduleType={ModuleType.SUPPORT_VIDEOS}
              videoUrl={finalVideoUrl}
              title={extractVideoName()}
              description={t('supportVideos.video.aboutDescription')}
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
              {t('supportVideos.video.aboutTitle')}
            </Typography>
            <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.8), mb: 3 }}>
              {t('supportVideos.video.aboutDescription')}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
