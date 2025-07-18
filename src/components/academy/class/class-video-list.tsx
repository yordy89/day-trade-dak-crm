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
  Badge,
} from '@mui/material';
import { PlayCircle } from '@phosphor-icons/react/dist/ssr/PlayCircle';
import { Clock } from '@phosphor-icons/react/dist/ssr/Clock';
import { VideoCamera } from '@phosphor-icons/react/dist/ssr/VideoCamera';
import { Calendar } from '@phosphor-icons/react/dist/ssr/Calendar';
import { Warning } from '@phosphor-icons/react/dist/ssr/Warning';
import { useQuery } from '@tanstack/react-query';
import { videoService, type VideoMetadata } from '@/services/api/video.service';
import { useRouter } from 'next/navigation';
import { formatVideoTitle } from '@/lib/date-format';

interface VideoWithProgress extends VideoMetadata {
  completed?: boolean;
  progress?: number;
  title?: string;
  date?: string;
  isLive?: boolean;
}

export default function ClassVideoList() {
  const theme = useTheme();
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Check if we're in live hours
  const isLiveNow = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    const startTime = 8 * 60 + 45; // 8:45 AM
    const endTime = 11 * 60; // 11:00 AM
    
    // Monday to Friday (1-5)
    return day >= 1 && day <= 5 && currentTime >= startTime && currentTime < endTime;
  };

  const getNextLiveText = () => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    const startTime = 8 * 60 + 45; // 8:45 AM
    
    // If it's a weekday before 8:45 AM
    if (day >= 1 && day <= 5 && currentTime < startTime) {
      return "Únete hoy a las 8:45 AM EST";
    }
    // If it's Friday after 11 AM or weekend
    else if (day === 5 && currentTime >= 11 * 60 || day === 6 || day === 0) {
      return "Únete el lunes a las 8:45 AM EST";
    }
    // Any other time (weekday after 11 AM)
    return "Únete mañana a las 8:45 AM EST";
  };

  // Fetch videos from API
  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ['live-recorded-videos'],
    queryFn: async () => {
      const data = await videoService.getLiveRecordedVideos();
      return data.map((video: any) => {
        const title = formatVideoTitle(video.key);
        
        // Extract date from title or use key
        let dateStr = '';
        const dateMatch = /(?<date>\d{4}-\d{2}-\d{2})/.exec(title);
        if (dateMatch) {
          dateStr = dateMatch.groups!.date;
        }
        
        return {
          ...video,
          title,
          date: dateStr,
          isLive: false,
        };
      }).sort((a: any, b: any) => {
        // Sort by date, newest first
        return b.date.localeCompare(a.date);
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

  // Add live session indicator if currently live
  const allVideos = isLiveNow() ? [
    {
      key: 'live-now',
      title: 'Sesión en Vivo - Únete Ahora',
      isLive: true,
      date: new Date().toISOString().split('T')[0],
      signedUrl: '',
    },
    ...videosWithProgress
  ] : videosWithProgress;

  const handleVideoClick = (video: VideoWithProgress) => {
    if (video.isLive) {
      // Redirect to live session page or show message
      window.open('https://zoom.us/your-live-session-link', '_blank');
      return;
    }
    
    setSelectedVideo(video.key);
    // Navigate to video player with the video key and signed URL
    const encodedKey = encodeURIComponent(video.key);
    const encodedUrl = encodeURIComponent(video.signedUrl);
    router.push(`/academy/live-sessions/video/${encodedKey}?url=${encodedUrl}`);
  };

  const getVideoDuration = (_video: VideoWithProgress) => {
    // TODO: Get actual duration from video metadata
    // For now, return a placeholder
    return 'Live recording';
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
            {error instanceof Error ? error.message : 'Failed to load live session recordings'}
          </Typography>
        </Stack>
      </Alert>
    );
  }

  if (videos.length === 0 && !isLiveNow()) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
            <Warning size={48} color={theme.palette.text.secondary} />
            <Typography variant="h6" color="text.secondary">
              No recordings available yet
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Join our live sessions Monday-Friday at 8:45 AM EST
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Next Live Session Alert */}
      {!isLiveNow() && (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3,
            bgcolor: alpha(theme.palette.info.main, 0.1),
            '& .MuiAlert-icon': {
              color: 'info.main',
            },
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            Próxima sesión en vivo: {getNextLiveText()}
          </Typography>
        </Alert>
      )}

      {/* Video List */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <List sx={{ p: 0 }}>
            {allVideos.map((video, index) => (
              <ListItem
                key={video.key}
                disablePadding
                sx={{
                  borderBottom:
                    index < allVideos.length - 1
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
                        bgcolor: video.isLive 
                          ? alpha(theme.palette.error.main, 0.1)
                          : alpha(theme.palette.primary.main, 0.1),
                        color: video.isLive ? 'error.main' : 'primary.main',
                      }}
                    >
                      {video.isLive ? (
                        <Badge
                          badgeContent=""
                          variant="dot"
                          sx={{
                            '& .MuiBadge-badge': {
                              bgcolor: 'error.main',
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              animation: 'pulse 1.5s infinite',
                              '@keyframes pulse': {
                                '0%': {
                                  transform: 'scale(1)',
                                  opacity: 1,
                                },
                                '50%': {
                                  transform: 'scale(1.2)',
                                  opacity: 0.7,
                                },
                                '100%': {
                                  transform: 'scale(1)',
                                  opacity: 1,
                                },
                              },
                            },
                          }}
                        >
                          <VideoCamera size={24} weight="fill" />
                        </Badge>
                      ) : (
                        <PlayCircle size={24} />
                      )}
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
                        {video.isLive ? <Chip
                            label="EN VIVO"
                            size="small"
                            color="error"
                            sx={{ 
                              height: 20,
                              animation: 'pulse 1.5s infinite',
                            }}
                          /> : null}
                        {/* TODO: Show completion status when progress tracking is implemented */}
                        {video.completed && !video.isLive ? (
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
                        {!video.isLive && (
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Clock size={14} />
                            <Typography component="span" variant="caption" color="text.secondary">
                              {getVideoDuration(video)}
                            </Typography>
                          </Box>
                        )}
                        {video.date ? <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Calendar size={14} />
                            <Typography component="span" variant="caption" color="text.secondary">
                              {video.isLive ? 'Ahora' : (video.date || '')}
                            </Typography>
                          </Box> : null}
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <VideoCamera size={14} />
                          <Typography component="span" variant="caption" color="text.secondary">
                            {video.isLive ? 'Sesión en vivo' : 'Grabación de sesión en vivo'}
                          </Typography>
                        </Box>
                        {/* TODO: Show watch progress when tracking is implemented */}
                        {video.progress && video.progress > 0 && video.progress < 100 && !video.isLive ? (
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