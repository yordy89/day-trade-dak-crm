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
      <Box>
        {[1, 2, 3, 4].map((i) => (
          <Card key={`skeleton-${i}`} sx={{ mb: 2 }}>
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
      <Card>
        <CardContent sx={{ p: 0 }}>
          <List sx={{ p: 0 }}>
            {videos.map((video, index) => (
              <ListItem
                key={video.key}
                disablePadding
                sx={{
                  borderBottom:
                    index < videos.length - 1
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
