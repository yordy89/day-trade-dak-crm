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
import { CheckCircle } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Clock } from '@phosphor-icons/react/dist/ssr/Clock';
import { Brain } from '@phosphor-icons/react/dist/ssr/Brain';
import { Warning } from '@phosphor-icons/react/dist/ssr/Warning';
import { useQuery } from '@tanstack/react-query';
import { videoService, VideoMetadata } from '@/services/api/video.service';
import { useRouter } from 'next/navigation';

interface VideoWithProgress extends VideoMetadata {
  completed?: boolean;
  progress?: number;
}

export default function PsicoTradingVideoList() {
  const theme = useTheme();
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Fetch videos from API
  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ['psicotrading-videos'],
    queryFn: () => videoService.getPsicotradingVideos(),
  });

  // Fetch user's video progress
  // TODO: Enable when backend endpoints are implemented
  const userProgress: any[] = [];

  // Extract video name from S3 key
  const extractVideoName = (key: string): string => {
    const parts = key.split('/');
    const filename = parts[parts.length - 1];
    // Remove file extension
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    // Replace underscores with spaces and capitalize words
    return nameWithoutExt
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Extract video order from filename (if videos are numbered)
  const extractOrder = (key: string): number => {
    const filename = key.split('/').pop() || '';
    const match = filename.match(/^(\d+)[_\-\s]/);
    return match ? parseInt(match[1], 10) : 999;
  };

  // Sort videos by order
  const sortedVideos = [...videos].sort((a, b) => {
    return extractOrder(a.key) - extractOrder(b.key);
  });

  // Merge video data with user progress
  const videosWithProgress: VideoWithProgress[] = sortedVideos.map(video => {
    const userClass = userProgress.find(uc => uc.s3Key === video.key);
    return {
      ...video,
      completed: userClass?.completedAt ? true : false,
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
      <Card>
        <CardContent sx={{ p: 0 }}>
          <List sx={{ p: 0 }}>
            {videosWithProgress.map((video, index) => (
              <ListItem
                key={video.key}
                disablePadding
                sx={{
                  borderBottom:
                    index < videosWithProgress.length - 1
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
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
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
                          Lección {index + 1}: {extractVideoName(video.key)}
                        </Typography>
                        {/* TODO: Show completion status when progress tracking is implemented
                        {video.completed && (
                          <Chip
                            label="Completed"
                            size="small"
                            color="success"
                            sx={{ height: 20 }}
                          />
                        )}
                        */}
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
                        {/* TODO: Show watch progress when tracking is implemented
                        {video.progress && video.progress > 0 && video.progress < 100 && (
                          <Typography component="span" variant="caption" color="primary.main">
                            {video.progress}% watched
                          </Typography>
                        )}
                        */}
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