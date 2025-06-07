'use client';

import React, { JSX } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { videosDescriptions } from '@/data/curso1';
import API from '@/lib/axios';

interface Video {
  key: string;
  signedUrl: string;
  captionsUrl?: string;
}

interface VideoListProps {
  courseKey: string;
}

// 🔧 Format a description part: handles bold phrases inside quotes
const formatDescriptionPart = (text: string): JSX.Element => {
  const regex = /["“”](?<phrase>[^"“”]+)["“”]/gu; // named capture group
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index);
    if (before) parts.push(before);
    parts.push(<strong key={match.index}>{match.groups?.phrase}</strong>);
    lastIndex = match.index + match[0].length;
  }

  const after = text.slice(lastIndex);
  if (after) parts.push(after);

  return <>{parts}</>;
};

const SuperacionVideoList: React.FC<VideoListProps> = ({ courseKey }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [`superacion-videos-${courseKey}`],
    queryFn: async () => {
      const res = await API.get(`/videos/cursos/${courseKey}`);
      return res.data;
    },
  });

  if (isLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />;
  if (error) return <Typography color="error">Error al cargar los videos.</Typography>;

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gridAutoRows: '1fr',
      }}
    >
      {data?.map((video: Video) => {
        const filename = video.key.split('/').pop() || '';
        const match = /^(?<id>\d+)_(?<title>[\w_]+)\.mp4$/iu.exec(filename);
        const id = match?.groups?.id ? parseInt(match.groups.id, 10) : null;
        const title = match?.groups?.title?.replace(/_/g, ' ') ?? filename;        

        const rawDescription = videosDescriptions.find((d) => d.id === id)?.description ?? 'Descripción no disponible.';
        const descriptionParts = rawDescription
          .split(';')
          .map((part) => part.trim())
          .filter((part) => part.length > 0);

        return (
          <Box key={video.key} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption -- video component does not need a caption track here */}
            <video
              controls
              controlsList="nodownload"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              width="100%"
              height="240"
            >
              <source src={video.signedUrl} type="video/mp4" />
              {video.captionsUrl && <track src={video.captionsUrl} kind="subtitles" label="Español" default />}
              Tu navegador no soporta el video.
            </video>

            <Typography variant="h6" sx={{ mt: 1, textAlign: 'center' }}>
              {title}
            </Typography>

            {descriptionParts.length > 0 && (
              <Box sx={{ mt: 0.5, textAlign: 'center' }}>
                {descriptionParts.map((part, idx) => (
                  <Typography key={`desc-${id}-${idx}`} variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    {formatDescriptionPart(part)}.
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default SuperacionVideoList;
