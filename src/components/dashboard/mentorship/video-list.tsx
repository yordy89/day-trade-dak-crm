'use client';

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import API from '@/lib/axios';

interface Video {
  id: string;
  title: string;
  description: string;
  vimeoId: string;
}

const VideoList: React.FC = () => {
  // ✅ Use React Query to fetch video data
  const {
    data: videos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await API.get('/videos');
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', // ✅ Adjust column size
        gridAutoRows: '1fr', // ✅ Ensures equal row heights
        alignItems: 'center',
      }}
    >
      {videos?.map((video: Video) => (
        <Box key={video.vimeoId} sx={{ width: '100%' }}>
          <iframe
            src={`https://player.vimeo.com/video/${video.vimeoId}`}
            title={`Mentorship Video - ${video.title}`}
            width="100%"
            height="240" // ✅ Adjust height to fit grid rows
            allow="autoplay; fullscreen"
            frameBorder="0"
          />
          <Typography variant="h6" sx={{ mt: 1, textAlign: 'center' }}>
            {video.title}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default VideoList;
