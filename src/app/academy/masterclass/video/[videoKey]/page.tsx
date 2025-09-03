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

export default function MentorshipVideoPlayerPage() {
  const router = useRouter();
  const { t } = useTranslation('academy');
  const params = useParams<{ videoKey: string }>();
  const searchParams = useSearchParams();
  const { hasAccess } = useModuleAccess(ModuleType.MASTER_CLASSES);
  
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
    // Example: hsl-daytradedak-videos/mentorias/mentoria_1/1080p/playlist.m3u8
    const pathParts = key.split('/');
    const mentoriaFolder = pathParts[2] || ''; // This gets "mentoria_1", "mentoria_2_iwm", etc.
    
    // Format title based on folder name patterns
    let formattedTitle = '';
    
    if (mentoriaFolder.includes('mentoria_entradas_parte')) {
      const partMatch = /parte_(?<partNum>\d+)(?:_(?<partLetter>[a-c]))?/.exec(mentoriaFolder);
      if (partMatch) {
        const partNumber = partMatch.groups?.partNum || '';
        const partLetter = partMatch.groups?.partLetter ? partMatch.groups.partLetter.toUpperCase() : '';
        formattedTitle = `Mentoría Entradas - Parte ${partNumber}${partLetter}`;
      } else {
        formattedTitle = 'Mentoría Entradas';
      }
    } else if (mentoriaFolder === 'mentoria_1') {
      formattedTitle = 'Mentoría 1';
    } else if (mentoriaFolder === 'mentoria_2_iwm') {
      formattedTitle = 'Mentoría 2 IWM';
    } else if (mentoriaFolder === 'mentoria_contexto_general') {
      formattedTitle = 'Mentoría Contexto General';
    } else if (mentoriaFolder === 'mentoria_de_refuerzos') {
      formattedTitle = 'Mentoría de Refuerzos';
    } else if (mentoriaFolder.includes('mentoria_medias_moviles')) {
      formattedTitle = 'Mentoría Medias Móviles';
    } else if (mentoriaFolder.includes('mentoria_para_manejar_cuentas')) {
      const num = mentoriaFolder.includes('_2') ? ' 2' : '';
      formattedTitle = `Mentoría Manejo de Cuentas${num}`;
    } else if (mentoriaFolder.includes('mentoria_preguntas_respuestas')) {
      formattedTitle = 'Mentoría Preguntas y Respuestas';
    } else {
      // Default formatting - clean up the folder name
      formattedTitle = mentoriaFolder
        .replace(/mentoria_/g, 'Mentoría ')
        .replace(/_/g, ' ')
        .trim()
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // If it doesn't start with "Mentoría", add it
      if (!formattedTitle.startsWith('Mentoría')) {
        formattedTitle = 'Mentoría ' + formattedTitle;
      }
    }
    
    // If we still get "Playlist" or empty, try extracting from the whole path
    if (!formattedTitle || formattedTitle.toLowerCase().includes('playlist')) {
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
          onClick={() => router.push('/academy/masterclass#videos')}
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 },
            color: 'white',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            '&:hover': {
              backgroundColor: alpha('#ffffff', 0.1),
            },
          }}
        >
          {t('masterclass.video.backToMasterClasses')}
        </Button>

        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="h3" fontWeight={700} sx={{ color: 'white', mb: 2, fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' } }}>
            {extractVideoName(videoKey)}
          </Typography>
          <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.7), fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Master Clase Elite - {t('masterclass.video.eliteContent')}
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
                description: t('masterclass.video.aboutDescription'),
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
          ) : (
            <ProtectedVideoPlayer
              videoId={videoKey}
              moduleType={ModuleType.MASTER_CLASSES}
              videoUrl={finalVideoUrl}
              title={extractVideoName(videoKey)}
              description={t('masterclass.video.aboutDescription')}
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
              {t('masterclass.video.aboutTitle')}
            </Typography>
            <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.8), mb: 3 }}>
              {t('masterclass.video.aboutDescription')}
            </Typography>
            
            <Box>
              <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
                {t('masterclass.video.keyTopics')}
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                  • {t('masterclass.video.topics.analysis')}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                  • {t('masterclass.video.topics.risk')}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                  • {t('masterclass.video.topics.psychology')}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                  • {t('masterclass.video.topics.caseStudies')}
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}