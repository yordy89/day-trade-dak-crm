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
  CircularProgress,
} from '@mui/material';
import { PlayCircle } from '@phosphor-icons/react/dist/ssr/PlayCircle';
import { CheckCircle } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Clock } from '@phosphor-icons/react/dist/ssr/Clock';
import { VideoCamera } from '@phosphor-icons/react/dist/ssr/VideoCamera';
import { Warning } from '@phosphor-icons/react/dist/ssr/Warning';
import { useQuery } from '@tanstack/react-query';
import { videoService, VideoMetadata } from '@/services/api/video.service';
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
    router.push(`/academy/classes/video/${encodedKey}?url=${encodedUrl}`);
  };

  const getVideoDuration = (video: VideoWithProgress) => {
    // TODO: Get actual duration from video metadata
    // For now, return a placeholder
    return t('classes.videoLesson');
  };

  const getTotalProgress = () => {
    if (videosWithProgress.length === 0) return 0;
    const completedCount = videosWithProgress.filter(v => v.completed).length;
    return Math.round((completedCount / videosWithProgress.length) * 100);
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
                          {t('classes.lessons')} {index + 1}: {extractVideoName(video.key)}
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