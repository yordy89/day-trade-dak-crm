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
import { Brain } from '@phosphor-icons/react/dist/ssr/Brain';
import { Warning } from '@phosphor-icons/react/dist/ssr/Warning';
import { useQuery } from '@tanstack/react-query';
import { videoService, type VideoMetadata } from '@/services/api/video.service';
import { useRouter } from 'next/navigation';
import { psicotradingMappings, getVideoTitle, extractUniqueVideoFromHLS } from '@/data/video-mappings';

interface VideoWithProgress extends VideoMetadata {
  completed?: boolean;
  progress?: number;
  title?: string;
  sortOrder?: number;
}

export default function PsicoTradingVideoList() {
  const theme = useTheme();
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Fetch videos from API
  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ['psicotrading-videos'],
    queryFn: async () => {
      const data = await videoService.getPsicotradingVideos();
      
      // Extract unique videos from HLS variants
      const uniqueVideos = extractUniqueVideoFromHLS(data);
      
      return uniqueVideos.map((video: any) => {
        // Extract folder name from the path
        const pathParts = video.key.split('/');
        // The folder structure is: hsl-daytradedak-videos/psicotrading-curso1/[folder_name]/...
        const folderName = pathParts[2] || '';
        
        // Get title and order from mapping
        const { title, order } = getVideoTitle(folderName, psicotradingMappings);
        
        // Determine sort order
        let sortOrder = order !== undefined ? order : 999;
        
        // Extract lesson number if it's a lesson
        if (folderName.match(/^\d+_Leccion_\d+/)) {
          const match = folderName.match(/^(\d+)_/);
          if (match) {
            sortOrder = parseInt(match[1]);
          }
        } else if (folderName.match(/^Mentoria (\d+)$/)) {
          const match = folderName.match(/^Mentoria (\d+)$/);
          if (match) {
            sortOrder = 100 + parseInt(match[1]); // Mentorías come after lessons
          }
        }
        
        return {
          ...video,
          title: title,
          sortOrder: sortOrder,
        };
      }).sort((a, b) => a.sortOrder - b.sortOrder);
    },
  });

  // Fetch user's video progress
  // TODO: Enable when backend endpoints are implemented
  const userProgress: any[] = [];

  // Merge video data with user progress
  const videosWithProgress: VideoWithProgress[] = videos.map(video => {
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
    router.push(`/academy/psicotrading/video/${encodedKey}?url=${encodedUrl}`);
  };

  const getVideoDuration = (video: VideoWithProgress) => {
    // Check if it's a lesson or mentoria
    if (video.title && video.title.includes('Lección')) {
      return 'Lección teórica';
    } else if (video.title && video.title.includes('Mentoría')) {
      return 'Sesión de mentoría';
    }
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
                    width={120}
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
            {error instanceof Error ? error.message : 'Failed to load PsicoTrading videos'}
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
              Check back later for new PsicoTrading content
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
            {videosWithProgress.map((video, index) => (
              <ListItem
                key={video.key}
                disablePadding
                sx={{
                  borderBottom:
                    index < videosWithProgress.length - 1
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
                          {(video as any).title || `Lección ${index + 1}`}
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
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Brain size={14} />
                          <Typography component="span" variant="caption" color="text.secondary">
                            Psicología del Trading
                          </Typography>
                        </Box>
                        {/* TODO: Show watch progress when tracking is implemented */}
                        {video.progress && video.progress > 0 && video.progress < 100 ? (
                          <Typography component="span" variant="caption" color="primary.main">
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