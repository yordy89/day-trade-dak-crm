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

export default function PsicoTradingVideoPlayerPage() {
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
    // Extract the folder name from the path structure
    // Example: hsl-daytradedak-videos/PsicoTrading/Mentoria 1/360p/playlist.m3u8
    const pathParts = key.split('/');
    const mentoriaFolder = pathParts[2] || ''; // This gets "Mentoria 1", "Mentoria Introductoria", etc.
    
    // Format title based on folder name
    let formattedTitle = '';
    
    if (mentoriaFolder === 'Mentoria Introductoria') {
      formattedTitle = 'Mentoría Introductoria';
    } else if (mentoriaFolder.startsWith('Mentoria ')) {
      // Extract number from "Mentoria 1", "Mentoria 2", etc.
      const match = /Mentoria (?<number>\d+)/.exec(mentoriaFolder);
      if (match?.groups) {
        const number = match.groups.number;
        formattedTitle = `Mentoría ${number}`;
      } else {
        formattedTitle = mentoriaFolder.replace('Mentoria', 'Mentoría');
      }
    } else {
      // Default formatting - fallback to filename
      const filename = pathParts[pathParts.length - 1];
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
      formattedTitle = nameWithoutExt
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }
    
    return formattedTitle;
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

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
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

        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight={700} sx={{ color: 'white', mb: 2 }}>
            {extractVideoName(videoKey)}
          </Typography>
          <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.7) }}>
            {t('psicotrading.video.psicoTrading')}
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
                description: 'Esta mentoría de PsicoTrading te ayudará a desarrollar la mentalidad correcta para el trading. Aprende a controlar tus emociones, manejar el estrés y tomar decisiones racionales en el mercado.',
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
              description="Esta mentoría de PsicoTrading te ayudará a desarrollar la mentalidad correcta para el trading."
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
              Esta mentoría de PsicoTrading te ayudará a desarrollar la mentalidad correcta para el trading. Aprende a controlar tus emociones, manejar el estrés y tomar decisiones racionales en el mercado.
            </Typography>
            
            <Box>
              <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
                {t('psicotrading.video.keyLearningPoints')}
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                  • Comprender la psicología del trader y cómo afecta tus decisiones
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                  • Manejar las emociones durante las operaciones de trading
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                  • Desarrollar disciplina y paciencia en el mercado
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                  • Construir confianza y resiliencia mental
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}