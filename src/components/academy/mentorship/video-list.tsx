'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack,
  Skeleton,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import { PlayCircle } from '@phosphor-icons/react/dist/ssr/PlayCircle';
import { Clock } from '@phosphor-icons/react/dist/ssr/Clock';
import { VideoCamera } from '@phosphor-icons/react/dist/ssr/VideoCamera';
import { Certificate } from '@phosphor-icons/react/dist/ssr/Certificate';
import { Warning } from '@phosphor-icons/react/dist/ssr/Warning';
import { useQuery } from '@tanstack/react-query';
import { videoService, type VideoMetadata } from '@/services/api/video.service';
import { useRouter } from 'next/navigation';

interface VideoWithProgress extends VideoMetadata {
  completed?: boolean;
  progress?: number;
  title?: string;
  topic?: string;
  level?: string;
}

export default function MentorshipVideoList() {
  const theme = useTheme();
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Fetch videos from API
  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ['mentorship-videos'],
    queryFn: async () => {
      const data = await videoService.getMentorshipVideos();
      return data.map((video: any, _index: number) => {
        const fileName = video.key.split('/').pop() || '';
        const cleanName = fileName.replace('.mp4', '').replace('mentorias/', '');
        
        // Format title based on file name patterns
        let formattedTitle = '';
        let topic = '';
        
        if (cleanName.includes('mentoria_entradas_parte')) {
          const partMatch = /parte_(?<partNum>\d+)(?:_(?<partLetter>[a-c]))?/.exec(cleanName);
          if (partMatch) {
            const partNumber = partMatch.groups?.partNum || '';
            const partLetter = partMatch.groups?.partLetter ? partMatch.groups.partLetter.toUpperCase() : '';
            formattedTitle = `Estrategias de Entrada - Parte ${partNumber}${partLetter}`;
          } else {
            formattedTitle = 'Estrategias de Entrada';
          }
          topic = 'Puntos de Entrada';
        } else if (cleanName.includes('mentoria_medias_moviles')) {
          formattedTitle = 'Medias Móviles Avanzadas';
          topic = 'Análisis Técnico';
        } else if (cleanName.includes('mentoria_para_manejar_cuentas')) {
          const num = cleanName.includes('_2') ? ' 2' : '';
          formattedTitle = `Gestión de Cuentas${num}`;
          topic = 'Risk Management';
        } else if (cleanName.includes('mentoria_de_refuerzos')) {
          formattedTitle = 'Sesión de Refuerzo';
          topic = 'Conceptos Clave';
        } else if (cleanName.includes('mentoria_preguntas_respuestas')) {
          formattedTitle = 'Preguntas y Respuestas';
          topic = 'Q&A Profesional';
        } else if (cleanName === 'mentoria_1') {
          formattedTitle = 'Introducción al Trading Profesional';
          topic = 'Fundamentos';
        } else if (cleanName === 'mentoria_2_iwm') {
          formattedTitle = 'Trading con IWM';
          topic = 'Análisis de ETFs';
        } else {
          // Default formatting
          formattedTitle = cleanName
            .replace(/_/g, ' ')
            .replace(/mentoria/g, '')
            .trim()
            .split(' ')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          topic = 'Trading Avanzado';
        }
        
        return {
          ...video,
          title: formattedTitle,
          topic,
          level: 'Profesional',
        };
      });
    },
  });

  // Fetch user's video progress
  // TODO: Enable when backend endpoints are implemented
  const userProgress: any[] = [];

  // Merge video data with user progress
  const videosWithProgress: VideoWithProgress[] = videos.map((video: any) => {
    const userClass = userProgress.find(uc => uc.s3Key === video.key);
    return {
      ...video,
      completed: Boolean(userClass?.completedAt),
      progress: userClass?.progress || 0,
    };
  });

  const handleVideoClick = (video: VideoWithProgress) => {
    setSelectedVideo(video.key);
    // Navigate to video player with the video key and signed URL
    const encodedKey = encodeURIComponent(video.key);
    const encodedUrl = encodeURIComponent(video.signedUrl);
    router.push(`/academy/masterclass/video/${encodedKey}?url=${encodedUrl}`);
  };

  const getVideoDuration = (_video: VideoWithProgress) => {
    // TODO: Get actual duration from video metadata
    // For now, return a placeholder
    return 'Video lesson';
  };

  if (isLoading) {
    return (
      <Box>
        {[1, 2, 3].map((i) => (
          <Card key={i} sx={{ mb: 2 }}>
            <CardContent>
              <Skeleton variant="rectangular" height={80} />
              <Box sx={{ mt: 2 }}>
                <Skeleton width="60%" />
                <Skeleton width="40%" />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle1" fontWeight={600}>
            Error loading videos
          </Typography>
          <Typography variant="body2">
            {error instanceof Error ? error.message : 'Failed to load Master Classes videos'}
          </Typography>
        </Stack>
      </Alert>
    );
  }

  if (videos.length === 0) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
            <Warning size={48} color={theme.palette.text.secondary} />
            <Typography variant="h6" color="text.secondary">
              No videos available yet
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Check back later for new Master Classes content
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Video List */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <List sx={{ p: 0 }}>
            {videosWithProgress.map((video, _index) => (
              <ListItem
                key={video.key}
                disablePadding
                sx={{
                  borderBottom:
                    _index < videosWithProgress.length - 1
                      ? `1px solid ${alpha(theme.palette.divider, 0.1)}`
                      : 'none',
                }}
              >
                <ListItemButton
                  onClick={() => handleVideoClick(video)}
                  selected={selectedVideo === video.key}
                  sx={{
                    py: 2.5,
                    px: 3,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.action.hover, 0.05),
                    },
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.secondary.main, 0.08),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.secondary.main, 0.12),
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                      }}
                    >
                      <PlayCircle size={24} />
                    </Box>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{
                            color: 'text.primary',
                          }}
                        >
                          {video.title}
                        </Typography>
                        {/* TODO: Show completion status when progress tracking is implemented */}
                        {video.completed ? (
                          <Chip
                            label="Completed"
                            size="small"
                            color="success"
                            sx={{ height: 20 }}
                          />
                        ) : null}
                      </Stack>
                    }
                    secondary={
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Clock size={14} />
                          <Typography component="span" variant="caption" color="text.secondary">
                            {getVideoDuration(video)}
                          </Typography>
                        </Box>
                        {video.topic ? (
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <VideoCamera size={14} />
                            <Typography component="span" variant="caption" color="text.secondary">
                              {video.topic}
                            </Typography>
                          </Box>
                        ) : null}
                        {video.level ? (
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Certificate size={14} />
                            <Typography component="span" variant="caption" color="text.secondary">
                              {video.level}
                            </Typography>
                          </Box>
                        ) : null}
                        {/* TODO: Show watch progress when tracking is implemented */}
                        {video.progress && video.progress > 0 && video.progress < 100 ? (
                          <Typography component="span" variant="caption" color="secondary.main">
                            {video.progress}% watched
                          </Typography>
                        ) : null}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}