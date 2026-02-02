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
import { Warning } from '@phosphor-icons/react/dist/ssr/Warning';
import { Question } from '@phosphor-icons/react/dist/ssr/Question';
import { useQuery } from '@tanstack/react-query';
import { videoService } from '@/services/api/video.service';
import type { VideoMetadata } from '@/services/api/video.service';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function SupportVideosVideoList() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation('academy');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Fetch support videos from API
  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ['support-videos'],
    queryFn: () => videoService.getSupportVideos(),
  });

  // Extract video name from S3 key
  const extractVideoName = (video: VideoMetadata): string => {
    // Key structure: hsl-daytradedak-videos/help-videos/VIDEO_FOLDER_NAME/master.m3u8
    // We want to extract VIDEO_FOLDER_NAME
    const parts = video.key.split('/');

    // Find the folder name (it's the part before master.m3u8 or playlist.m3u8)
    let folderName = '';

    if (parts.length >= 2) {
      // Get the second-to-last part (the folder name before master.m3u8)
      folderName = parts[parts.length - 2];
    }

    // If we couldn't extract a folder name, fall back to filename
    if (!folderName || folderName === 'help-videos') {
      const filename = parts[parts.length - 1];
      folderName = filename.replace(/\.(?:mp4|webm|ogg|m3u8)$/i, '');
    }

    // Clean up the name but preserve the original formatting
    const cleanName = folderName
      .replace(/master/gi, '')
      .replace(/playlist/gi, '')
      .trim();

    return cleanName || t('supportVideos.video.supportGuide');
  };

  const handleVideoClick = (video: VideoMetadata) => {
    setSelectedVideo(video.key);
    // Navigate to video player with the video key and signed URL
    const encodedKey = encodeURIComponent(video.key);
    const encodedUrl = encodeURIComponent(video.signedUrl);
    router.push(`/academy/support-videos/video/${encodedKey}?url=${encodedUrl}`);
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
          {[1, 2, 3, 4].map((i) => (
            <Box
              key={`skeleton-${i}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 2.5,
                px: 3,
                borderBottom: i < 4 ? `1px solid ${alpha(theme.palette.primary.main, 0.12)}` : 'none',
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
                <Skeleton
                  width={100}
                  height={16}
                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}
                />
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
            {error instanceof Error ? error.message : 'Failed to load support videos'}
          </Typography>
        </Stack>
      </Alert>
    );
  }

  if (videos.length === 0) {
    return (
      <Alert
        severity="info"
        icon={<Question size={24} />}
        sx={{
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {t('supportVideos.title')}
        </Typography>
        <Typography variant="body2">
          No support videos available at the moment. Check back later for new content.
        </Typography>
      </Alert>
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
            {videos.map((video, index) => (
              <ListItem
                key={video.key}
                disablePadding
                sx={{
                  borderBottom:
                    index < videos.length - 1
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
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{
                          color: 'text.primary',
                        }}
                      >
                        {extractVideoName(video)}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        {t('supportVideos.video.supportGuide')}
                      </Typography>
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
