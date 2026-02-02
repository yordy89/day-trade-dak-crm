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
  Stack,
  Skeleton,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import { PlayCircle } from '@phosphor-icons/react/dist/ssr/PlayCircle';
import { Clock } from '@phosphor-icons/react/dist/ssr/Clock';
import { VideoCamera } from '@phosphor-icons/react/dist/ssr/VideoCamera';
import { Warning } from '@phosphor-icons/react/dist/ssr/Warning';
import { useQuery } from '@tanstack/react-query';
import { videoService } from '@/services/api/video.service';
import type { VideoMetadata } from '@/services/api/video.service';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface VideoWithProgress extends VideoMetadata {
  completed?: boolean;
  progress?: number;
}

export default function ClasesVideoList() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation('academy');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Fetch videos from API
  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ['classes-videos'],
    queryFn: () => videoService.getClassesVideos(),
  });

  // Fetch user's video progress
  // TODO: Enable when backend endpoints are implemented
  const userProgress: any[] = [];
  /*
  const { data: userProgress = [] } = useQuery({
    queryKey: ['user-video-classes'],
    queryFn: () => videoService.getUserVideoClasses(),
  });
  */

  // Extract video name from S3 key or use title from API
  const extractVideoName = (video: VideoMetadata & { title?: string }): string => {
    // Use the title from API if available
    if (video.title) {
      return video.title;
    }
    
    // Fallback to extracting from key
    const parts = video.key.split('/');
    const filename = parts[parts.length - 1];
    // Remove file extension
    const nameWithoutExt = filename.replace(/\.(?:mp4|webm|ogg|m3u8)$/i, '');
    // Replace underscores with spaces, clean up "clase" word, and capitalize
    return nameWithoutExt
      .replace(/_/g, ' ')
      .replace(/clase/gi, 'Clase')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Extract video order from filename (if videos are numbered)
  const extractOrder = (key: string): number => {
    const filename = key.split('/').pop() || '';
    const match = /^(?<order>\d+)[_\-\s]/.exec(filename);
    return match ? parseInt(match.groups!.order, 10) : 999;
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
      completed: Boolean(userClass?.completedAt),
      progress: userClass?.progress || 0,
    };
  });

  const handleVideoClick = (video: VideoWithProgress) => {
    setSelectedVideo(video.key);
    // Navigate to video player with the video key and signed URL
    const encodedKey = encodeURIComponent(video.key);
    const encodedUrl = encodeURIComponent(video.signedUrl);
    router.push(`/academy/classes/video/${encodedKey}?url=${encodedUrl}`);
  };

  const getVideoDuration = (_video: VideoWithProgress) => {
    // TODO: Get actual duration from video metadata
    // For now, return a placeholder
    return t('classes.videoLesson');
  };

  const _getTotalProgress = () => {
    if (videosWithProgress.length === 0) return 0;
    const completedCount = videosWithProgress.filter(v => v.completed).length;
    return Math.round((completedCount / videosWithProgress.length) * 100);
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
              key={`skeleton-${i}`}
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
            {t('common.error')}
          </Typography>
          <Typography variant="body2">
            {error instanceof Error ? error.message : 'Failed to load class videos'}
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
              {t('classes.noVideosAvailable')}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {t('classes.checkBackLater')}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Overall Progress - Hidden until backend implementation */}
      {/* TODO: Enable when video progress tracking is implemented
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={600}>
                {t('classes.courseProgress')}
              </Typography>
              <Chip
                label={`${getTotalProgress()}% Complete`}
                color="primary"
                size="small"
              />
            </Stack>
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  width: '100%',
                  height: 8,
                  borderRadius: 4,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${getTotalProgress()}%`,
                    height: '100%',
                    bgcolor: 'primary.main',
                    transition: 'width 0.3s ease',
                  }}
                />
              </Box>
            </Box>
            <Stack direction="row" spacing={2}>
              <Typography variant="caption" color="text.secondary">
                {videosWithProgress.filter(v => v.completed).length} of {videosWithProgress.length} lessons completed
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      */}

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
                          {extractVideoName(video)}
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
                          <VideoCamera size={14} />
                          <Typography component="span" variant="caption" color="text.secondary">
                            {t('classes.videoLesson')}
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
                  
                  {/* Progress indicator for partially watched videos */}
                  {/* TODO: Show circular progress when tracking is implemented
                  {video.progress && video.progress > 0 && video.progress < 100 && (
                    <Box sx={{ ml: 2, width: 60 }}>
                      <CircularProgress
                        variant="determinate"
                        value={video.progress}
                        size={30}
                        thickness={3}
                        sx={{
                          color: theme.palette.primary.main,
                          '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                          },
                        }}
                      />
                    </Box>
                  )}
                  */}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}