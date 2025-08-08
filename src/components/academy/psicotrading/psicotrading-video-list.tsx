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
    queryFn: async () => {
      const data = await videoService.getPsicotradingVideos();
      
      // Filter to get only unique mentoria folders (deduplicate by folder name)
      const uniqueVideos = new Map<string, any>();
      
      // Create a map to group videos by mentoria folder
      const mentoriaMap = new Map<string, any[]>();
      
      data.forEach((video: any) => {
        const pathParts = video.key.split('/');
        const mentoriaFolder = pathParts[2] || '';
        
        if (!mentoriaMap.has(mentoriaFolder)) {
          mentoriaMap.set(mentoriaFolder, []);
        }
        mentoriaMap.get(mentoriaFolder)!.push(video);
      });
      
      // For each mentoria, try to use master.m3u8 first, fallback to 720p if master is too small
      mentoriaMap.forEach((videos, mentoriaFolder) => {
        // Find master.m3u8
        const masterVideo = videos.find(v => v.key.includes('master.m3u8'));
        
        if (masterVideo && masterVideo.size && masterVideo.size > 100) {
          // Use master if it's a reasonable size (more than 100 bytes)
          uniqueVideos.set(mentoriaFolder, masterVideo);
        } else {
          // Fallback to 720p if master is too small or doesn't exist
          const quality720p = videos.find(v => v.key.includes('720p/playlist.m3u8'));
          const quality480p = videos.find(v => v.key.includes('480p/playlist.m3u8'));
          const quality360p = videos.find(v => v.key.includes('360p/playlist.m3u8'));
          const quality1080p = videos.find(v => v.key.includes('1080p/playlist.m3u8'));
          
          // Prefer 720p, then 480p, then 360p, then 1080p
          const selectedVideo = quality720p || quality480p || quality360p || quality1080p || masterVideo || videos[0];
          if (selectedVideo) {
            uniqueVideos.set(mentoriaFolder, selectedVideo);
          }
        }
      });
      
      // Convert Map values back to array and continue with the mapping
      return Array.from(uniqueVideos.values()).map((video: any) => {
        // Extract the folder name from the path structure again
        const pathParts = video.key.split('/');
        const mentoriaFolder = pathParts[2] || '';
        
        // Format title based on folder name
        let formattedTitle = '';
        let order = 999;
        
        if (mentoriaFolder === 'Mentoria Introductoria') {
          formattedTitle = 'Mentoría Introductoria';
          order = 0; // Show first
        } else if (mentoriaFolder.startsWith('Mentoria ')) {
          // Extract number from "Mentoria 1", "Mentoria 2", etc.
          const match = /Mentoria (\d+)/.exec(mentoriaFolder);
          if (match) {
            const number = match[1];
            formattedTitle = `Mentoría ${number}`;
            order = parseInt(number);
          } else {
            formattedTitle = mentoriaFolder.replace('Mentoria', 'Mentoría');
          }
        } else {
          // Default formatting
          formattedTitle = mentoriaFolder;
        }
        
        return {
          ...video,
          title: formattedTitle,
          sortOrder: order,
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