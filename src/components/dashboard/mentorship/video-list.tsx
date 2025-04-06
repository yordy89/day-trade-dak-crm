'use client';

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import API from '@/lib/axios';

interface ClassVideo {
  key: string; // 🔹 S3 file key
  signedUrl: string; // 🔹 Pre-signed URL from S3
  captionsUrl?: string; // 🔹 Optional captions file
}

const MentorshipVideoList: React.FC = () => {
  const {
    data: videos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['mentorship-videos'],
    queryFn: async () => {
      const response = await API.get('/videos/mentorshipVideos');
      return response.data;
    },
  });

  if (isLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />;
  if (error) return <Typography color="error">Error fetching videos.</Typography>;

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gridAutoRows: '1fr',
      }}
    >
      {videos?.map((video: ClassVideo) => (
        <Box key={video.key} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- Video element has captions */}
          <video
            controls
            controlsList="nodownload"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()} // Prevents right-click downloads
            width="100%"
            height="240"
          >
            <source src={video.signedUrl} type="video/mp4" />
            {video.captionsUrl ? <track src={video.captionsUrl} kind="subtitles" label="Español" default /> : null}
            Tu navegador no soporta videos.
          </video>
          {/* ✅ Video Title Formatted */}
          <Typography variant="h6" sx={{ mt: 1, textAlign: 'center' }}>
            {video.key.replace('mentorias/', '').replace('.mp4', '')}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default MentorshipVideoList;
