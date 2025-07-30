import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Skeleton,
  Alert,
  Button,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material';
import { PlayCircle } from '@phosphor-icons/react/dist/ssr/PlayCircle';
import { VideoCamera } from '@phosphor-icons/react/dist/ssr/VideoCamera';
import { Warning } from '@phosphor-icons/react/dist/ssr/Warning';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { useQuery } from '@tanstack/react-query';
import { videoService } from '@/services/api/video.service';
import type { VideoMetadata } from '@/services/api/video.service';
import { useRouter } from 'next/navigation';

interface ClasesVideoListStandaloneProps {
  onBack: () => void;
}

interface _VideoWithProgress extends VideoMetadata {
  completed?: boolean;
  progress?: number;
}

// Helper function to extract title from video
function extractVideoTitle(video: VideoMetadata & { title?: string }): string {
  // Use the title from API if available
  if (video.title) {
    return video.title;
  }
  
  // Fallback to extracting from key
  const key = video.key;
  const filename = key.split('/').pop() || key;
  const nameWithoutExt = filename.replace(/\.(?:mp4|webm|ogg|m3u8)$/i, '');
  return nameWithoutExt
    .replace(/_/g, ' ')
    .replace(/clase/gi, 'Clase')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ClasesVideoListStandalone({ onBack }: ClasesVideoListStandaloneProps) {
  const _theme = useTheme();
  const router = useRouter();
  const [_selectedVideo, _setSelectedVideo] = useState<string | null>(null);

  // Fetch videos from API
  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ['classes-videos'],
    queryFn: () => videoService.getClassesVideos(),
  });

  const handleVideoClick = (videoKey: string) => {
    // URL encode the video key to handle slashes and special characters
    const encodedKey = encodeURIComponent(videoKey);
    router.push(`/classes/video/${encodedKey}`);
  };

  const sortedVideos = [...videos].sort((a, b) => {
    const titleA = extractVideoTitle(a);
    const titleB = extractVideoTitle(b);
    const orderA = parseInt((/\d+/.exec(titleA))?.[0] || '0');
    const orderB = parseInt((/\d+/.exec(titleB))?.[0] || '0');
    return orderA - orderB;
  });


  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0a0a0a', p: 4 }}>
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={onBack}
            sx={{ mb: 4, color: 'white' }}
          >
            Volver a la introducción
          </Button>
          <Alert severity="error" sx={{ backgroundColor: alpha('#f44336', 0.1), color: 'white' }}>
            Error al cargar los videos. Por favor, intenta de nuevo más tarde.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
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

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4, pb: 8 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={onBack}
            sx={{ 
              mb: 3,
              color: 'white',
              '&:hover': {
                backgroundColor: alpha('#ffffff', 0.1),
              },
            }}
          >
            Volver a la introducción
          </Button>
          
          <Typography variant="h3" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
            Clases de Trading - Curso Intensivo
          </Typography>
          <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.7) }}>
            Accede a todas las lecciones del curso intensivo de 15 días
          </Typography>
        </Box>

        {/* Video Stats */}
        <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#22c55e' }}>
              {videos.length}
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6) }}>
              Clases disponibles
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#22c55e' }}>
              15
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6) }}>
              Días de acceso
            </Typography>
          </Box>
        </Stack>

        {/* Video List */}
        {isLoading ? (
          <Stack spacing={2}>
            {[...Array(6)].map((_, index) => (
              <Card 
                key={index}
                sx={{ 
                  backgroundColor: alpha('#ffffff', 0.05),
                  backdropFilter: 'blur(10px)',
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Skeleton variant="circular" width={48} height={48} />
                    <Box flex={1}>
                      <Skeleton variant="text" width="60%" height={28} />
                      <Skeleton variant="text" width="40%" height={20} />
                    </Box>
                    <Skeleton variant="text" width={60} height={24} />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <List sx={{ p: 0 }}>
            {sortedVideos.map((video, index) => {
              const isSelected = _selectedVideo === video.key;
              const videoNumber = index + 1;

              return (
                <ListItem
                  key={video.key}
                  disablePadding
                  sx={{ mb: 2 }}
                >
                  <Card
                    sx={{
                      width: '100%',
                      backgroundColor: isSelected
                        ? alpha('#22c55e', 0.2)
                        : alpha('#ffffff', 0.05),
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${isSelected ? '#22c55e' : alpha('#22c55e', 0.2)}`,
                      transition: 'all 0.3s',
                      '&:hover': {
                        backgroundColor: alpha('#22c55e', 0.1),
                        borderColor: '#22c55e',
                        transform: 'translateX(5px)',
                      },
                    }}
                  >
                    <ListItemButton
                      onClick={() => handleVideoClick(video.key)}
                      sx={{ p: 3 }}
                    >
                      <ListItemIcon sx={{ mr: 2 }}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            backgroundColor: alpha('#22c55e', 0.2),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                          }}
                        >
                          <VideoCamera size={28} weight="fill" color="#22c55e" />
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              backgroundColor: '#22c55e',
                              color: 'white',
                              borderRadius: '50%',
                              width: 24,
                              height: 24,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                            }}
                          >
                            {videoNumber}
                          </Typography>
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="h6" fontWeight={600} sx={{ color: 'white' }}>
                            {extractVideoTitle(video)}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6), mt: 1 }}>
                            Clase de trading profesional
                          </Typography>
                        }
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          sx={{
                            backgroundColor: '#22c55e',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#16a34a',
                            },
                          }}
                        >
                          <PlayCircle size={24} weight="fill" />
                        </IconButton>
                      </Box>
                    </ListItemButton>
                  </Card>
                </ListItem>
              );
            })}
          </List>
        )}

        {/* Footer Notice */}
        <Box sx={{ mt: 6, p: 3, backgroundColor: alpha('#22c55e', 0.1), borderRadius: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Warning size={24} color="#22c55e" />
            <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.8) }}>
              Tu acceso al curso está activo. Recuerda que tienes 15 días para completar todas las lecciones.
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}