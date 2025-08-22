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
import { HandsPraying } from '@phosphor-icons/react/dist/ssr/HandsPraying';
import { Calendar } from '@phosphor-icons/react/dist/ssr/Calendar';
import { Sparkle } from '@phosphor-icons/react/dist/ssr/Sparkle';
import { Warning } from '@phosphor-icons/react/dist/ssr/Warning';
import { useQuery } from '@tanstack/react-query';
import { videoService } from '@/services/api/video.service';
import type { VideoMetadata } from '@/services/api/video.service';
import { useRouter } from 'next/navigation';
import { getVideosDescriptions } from '@/data/curso1';
import { useTranslation } from 'react-i18next';
import { pazConElDineroMappings, getVideoTitle, extractUniqueVideoFromHLS } from '@/data/video-mappings';

interface VideoWithProgress extends VideoMetadata {
  completed?: boolean;
  progress?: number;
  lessonNumber?: number;
  title?: string;
  description?: string;
}

interface VideoListProps {
  courseKey: string;
}

export default function SuperacionVideoList({ courseKey }: VideoListProps) {
  const theme = useTheme();
  const router = useRouter();
  const { i18n, t } = useTranslation('academy');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Fetch videos from API
  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: [`superacion-videos-${courseKey}`, i18n.language],
    queryFn: async () => {
      const data = await videoService.getSuperacionVideos(courseKey);
      
      // Extract unique videos from HLS variants
      const uniqueVideos = extractUniqueVideoFromHLS(data);
      
      return uniqueVideos.map((video: any) => {
        // Extract folder name from the path
        const pathParts = video.key.split('/');
        // The folder structure is: hsl-daytradedak-videos/curso1/[folder_name]/...
        const folderName = pathParts[2] || '';
        
        // Get title and lesson number from mapping
        const { title, lessonNumber } = getVideoTitle(folderName, pazConElDineroMappings);
        
        // Get description from existing descriptions data
        const videosDescriptions = getVideosDescriptions(i18n.language);
        const rawDescription = lessonNumber ? 
          videosDescriptions.find((d) => d.id === lessonNumber)?.description ?? '' : '';

        return {
          ...video,
          title: title,
          lessonNumber: lessonNumber || null,
          description: rawDescription,
          folderName: folderName, // Keep for debugging
        };
      }).sort((a: any, b: any) => (a.lessonNumber || 999) - (b.lessonNumber || 999));
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
    router.push(`/academy/personal-growth/peace-with-money/video/${encodedKey}?url=${encodedUrl}`);
  };

  const getVideoDuration = (_video: VideoWithProgress) => {
    // TODO: Get actual duration from video metadata
    // For now, return a placeholder
    return t('peaceWithMoney.video.videoLesson');
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
            {t('peaceWithMoney.video.errorLoading')}
          </Typography>
          <Typography variant="body2">
            {error instanceof Error ? error.message : t('peaceWithMoney.video.failedToLoad')}
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
              {t('peaceWithMoney.video.noVideosAvailable')}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {t('peaceWithMoney.video.checkBackLater')}
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
            {videosWithProgress.map((video, index) => {
              const isSpecialDay = video.lessonNumber && [7, 14, 21].includes(video.lessonNumber);
              
              return (
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
                          bgcolor: alpha(theme.palette.secondary.main, 0.1),
                          color: 'secondary.main',
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
                          {isSpecialDay ? <Chip
                              icon={<Sparkle size={14} />}
                              label={t('peaceWithMoney.video.selfInquiry')}
                              size="small"
                              color="warning"
                              sx={{ height: 20 }}
                            /> : null}
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
                            <HandsPraying size={14} />
                            <Typography component="span" variant="caption" color="text.secondary">
                              {t('peaceWithMoney.title')}
                            </Typography>
                          </Box>
                          {video.lessonNumber ? <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Calendar size={14} />
                              <Typography component="span" variant="caption" color="text.secondary">
                                {t('peaceWithMoney.video.dayOf21', { day: video.lessonNumber })}
                              </Typography>
                            </Box> : null}
                          {/* TODO: Show watch progress when tracking is implemented
                          {video.progress && video.progress > 0 && video.progress < 100 && (
                            <Typography component="span" variant="caption" color="secondary.main">
                              {video.progress}% watched
                            </Typography>
                          )}
                          */}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}