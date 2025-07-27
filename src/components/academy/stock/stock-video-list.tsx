'use client';

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { videoService } from '@/services/api/video.service';


interface StockVideo {
  key: string;
  signedUrl: string;
  captionsUrl?: string;
}

const StockVideoList: React.FC = () => {
  const {
    data: videos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['stock-videos'],
    queryFn: async () => {
      const data = await videoService.getStockVideos();
      return data;
    },
  });

  if (isLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />;
  if (error) return <Typography color="error">Error fetching stock videos.</Typography>;

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gridAutoRows: '1fr',
      }}
    >
      {videos?.map((video: StockVideo) => (
        <Box key={video.key} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          { }
          <video
            controls
            controlsList="nodownload"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            width="100%"
            height="240"
          >
            <source src={video.signedUrl} type="video/mp4" />
            {video.captionsUrl ? <track src={video.captionsUrl} kind="subtitles" label="Español" default /> : null}
            Tu navegador no soporta videos.
          </video>
          <Typography variant="h6" sx={{ mt: 1, textAlign: 'center' }}>
          {video.key.replace('stock-videos/', '').replace('.mp4', '')}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default StockVideoList;
