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
import { extractUniqueVideoFromHLS } from '@/data/video-mappings';

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
      
      // Extract unique videos from HLS variants
      const uniqueVideos = extractUniqueVideoFromHLS(data);
      
      return uniqueVideos.map((video: any) => {
        // Extract the folder name from the path structure again
        const pathParts = video.key.split('/');
        const mentoriaFolder = pathParts[2] || '';
        
        // Format title based on folder name patterns
        let formattedTitle = '';
        let topic = '';
        
        if (mentoriaFolder.includes('mentoria_entradas_parte')) {
          const partMatch = /parte_(?<partNum>\d+)(?:_(?<partLetter>[a-c]))?/.exec(mentoriaFolder);
          if (partMatch) {
            const partNumber = partMatch.groups?.partNum || '';
            const partLetter = partMatch.groups?.partLetter ? partMatch.groups.partLetter.toUpperCase() : '';
            formattedTitle = `Mentoría Entradas - Parte ${partNumber}${partLetter}`;
          } else {
            formattedTitle = 'Mentoría Entradas';
          }
          topic = 'Puntos de Entrada';
        } else if (mentoriaFolder === 'mentoria_1') {
          formattedTitle = 'Mentoría 1';
          topic = 'Fundamentos';
        } else if (mentoriaFolder === 'mentoria_2_iwm') {
          formattedTitle = 'Mentoría 2 IWM';
          topic = 'Análisis de ETFs';
        } else if (mentoriaFolder === 'mentoria_contexto_general') {
          formattedTitle = 'Mentoría Contexto General';
          topic = 'Análisis de Mercado';
        } else if (mentoriaFolder === 'mentoria_de_refuerzos') {
          formattedTitle = 'Mentoría de Refuerzos';
          topic = 'Conceptos Clave';
        } else if (mentoriaFolder.includes('mentoria_medias_moviles')) {
          formattedTitle = 'Mentoría Medias Móviles';
          topic = 'Análisis Técnico';
        } else if (mentoriaFolder.includes('mentoria_para_manejar_cuentas')) {
          const num = mentoriaFolder.includes('_2') ? ' 2' : '';
          formattedTitle = `Mentoría Manejo de Cuentas${num}`;
          topic = 'Risk Management';
        } else if (mentoriaFolder.includes('mentoria_preguntas_respuestas')) {
          formattedTitle = 'Mentoría Preguntas y Respuestas';
          topic = 'Q&A Profesional';
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
          
          topic = 'Trading Avanzado';
        }
        
        // Determine sort order based on content
        let sortOrder = 999;
        if (mentoriaFolder === 'mentoria_1') sortOrder = 1;
        else if (mentoriaFolder === 'mentoria_2_iwm') sortOrder = 2;
        else if (mentoriaFolder === 'mentoria_contexto_general') sortOrder = 3;
        else if (mentoriaFolder === 'mentoria_de_refuerzos') sortOrder = 4;
        else if (mentoriaFolder.includes('mentoria_entradas_parte')) {
          const partMatch = /parte_(\d+)/.exec(mentoriaFolder);
          if (partMatch) {
            sortOrder = 10 + parseInt(partMatch[1]);
          }
        }
        
        return {
          ...video,
          title: formattedTitle,
          topic,
          level: 'Profesional',
          sortOrder,
        };
      }).sort((a, b) => a.sortOrder - b.sortOrder);
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
      <Card
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
            : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          boxShadow: `0 6px 28px ${alpha(theme.palette.primary.main, 0.12)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          },
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 2.5,
                px: 3,
                borderBottom: i < 5 ? `1px solid ${alpha(theme.palette.primary.main, 0.12)}` : 'none',
              }}
            >
              <Skeleton
                variant="circular"
                width={44}
                height={44}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Skeleton
                  width="70%"
                  height={24}
                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.12), mb: 1 }}
                />
                <Stack direction="row" spacing={2}>
                  <Skeleton
                    width={80}
                    height={16}
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}
                  />
                  <Skeleton
                    width={100}
                    height={16}
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}
                  />
                  <Skeleton
                    width={70}
                    height={16}
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}
                  />
                </Stack>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
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
      <Card
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
            : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          boxShadow: `0 6px 28px ${alpha(theme.palette.primary.main, 0.12)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          },
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <List sx={{ p: 0 }}>
            {videosWithProgress.map((video, _index) => (
              <ListItem
                key={video.key}
                disablePadding
                sx={{
                  borderBottom:
                    _index < videosWithProgress.length - 1
                      ? `1px solid ${alpha(theme.palette.primary.main, 0.12)}`
                      : 'none',
                }}
              >
                <ListItemButton
                  onClick={() => handleVideoClick(video)}
                  selected={selectedVideo === video.key}
                  sx={{
                    py: 2.5,
                    px: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '& .video-play-icon': {
                        boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                    },
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.16),
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 56 }}>
                    <Box
                      className="video-play-icon"
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.25)} 0%, ${alpha(theme.palette.primary.main, 0.12)} 100%)`,
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        color: 'primary.main',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <PlayCircle size={26} weight="fill" />
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