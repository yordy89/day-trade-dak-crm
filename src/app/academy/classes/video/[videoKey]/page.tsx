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

export default function ClassesVideoPlayerPage() {
  const router = useRouter();
  const { t } = useTranslation('academy');
  const params = useParams<{ videoKey: string }>();
  const searchParams = useSearchParams();
  const { hasAccess } = useModuleAccess(ModuleType.CLASSES);
  
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
  
  // Extract video name from key or use title from API
  const extractVideoName = (video?: any): string => {
    // Use the title from API if available
    if (video?.title) {
      return video.title;
    }
    
    // Fallback to extracting from key
    const key = video?.key || videoKey;
    const filename = key.split('/').pop() || key;
    const nameWithoutExt = filename.replace(/\.(?:mp4|webm|ogg|m3u8)$/i, '');
    
    // Clean up the name
    const cleanName = nameWithoutExt
      .replace(/_/g, ' ')
      .replace(/clase/gi, 'Clase')
      .replace(/playlist/gi, '') // Remove "playlist" from the name
      .trim()
      .replace(/\b\w/g, (l: string) => l.toUpperCase());
    
    // If the name is empty or just "Playlist", extract from the key
    if (!cleanName || cleanName.toLowerCase() === 'playlist') {
      // Try to extract a meaningful name from the path
      const pathParts = videoKey.split('/');
      for (let i = pathParts.length - 1; i >= 0; i--) {
        const part = pathParts[i];
        if (part && !part.includes('.') && part.toLowerCase() !== 'playlist') {
          return part
            .replace(/_/g, ' ')
            .replace(/clase/gi, 'Clase')
            .replace(/\b\w/g, (l: string) => l.toUpperCase());
        }
      }
    }
    
    return cleanName || 'Clase de Trading';
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
          onClick={() => router.push('/academy/classes#videos')}
          sx={{ 
            mb: 4,
            color: 'white',
            '&:hover': {
              backgroundColor: alpha('#ffffff', 0.1),
            },
          }}
        >
          {t('classes.video.backToClasses')}
        </Button>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight={700} sx={{ color: 'white', mb: 2 }}>
            {extractVideoName()}
          </Typography>
          <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.7) }}>
            {t('classes.video.tradingClass')}
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
                description: `Lesson video for ${extractVideoName()}`,
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
              moduleType={ModuleType.CLASSES}
              videoUrl={finalVideoUrl}
              title={extractVideoName()}
              description={`Lesson video for ${extractVideoName()}`}
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
              {t('classes.video.aboutTitle')}
            </Typography>
            <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.8), mb: 3 }}>
              {t('classes.video.aboutDescription')}
            </Typography>
            
            <Box>
              <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
                {t('classes.video.keyTopics')}
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                  • {t('classes.video.topics.analysis')}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                  • {t('classes.video.topics.risk')}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                  • {t('classes.video.topics.entry')}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                  • {t('classes.video.topics.examples')}
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}