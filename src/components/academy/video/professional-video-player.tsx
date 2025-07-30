'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  PlayCircleOutline,
  Lock,
} from '@mui/icons-material';
import { SimpleHLSPlayer } from '../shared/simple-hls-player';
import type Player from 'video.js/dist/types/player';

interface VideoInfo {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  category?: string;
  instructor?: string;
  uploadDate?: string;
  views?: number;
  isLocked?: boolean;
}

interface ProfessionalVideoPlayerProps {
  video: VideoInfo;
  src: string;
  captionsUrl?: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  relatedVideos?: VideoInfo[];
  bookmarks?: { time: number; note: string }[];
  onBookmark?: (time: number, note: string) => void;
}

export function ProfessionalVideoPlayer({
  video: _video,
  src,
  captionsUrl: _captionsUrl,
  onProgress,
  onComplete,
  relatedVideos = [],
  bookmarks: _bookmarks = [],
  onBookmark: _onBookmark,
}: ProfessionalVideoPlayerProps) {
  const playerRef = useRef<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePlayerReady = (player: Player) => {
    playerRef.current = player;
    
    // Handle video end event
    player.on('ended', () => {
      if (onComplete) {
        onComplete();
      }
    });
  };

  const handleProgress = (percent: number) => {
    if (onProgress) {
      onProgress(percent);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredRelatedVideos = relatedVideos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
      {/* Main Video Player */}
      <Box sx={{ flex: 1 }}>
        <SimpleHLSPlayer
          src={src}
          poster={_video.thumbnail}
          onReady={handlePlayerReady}
          onProgress={handleProgress}
          onError={(error) => {
            console.error('Video playback error:', error);
          }}
        />
      </Box>

      {/* Related Videos Sidebar */}
      {relatedVideos.length > 0 ? (
        <Box sx={{ width: { xs: '100%', lg: 350 } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Related Videos
              </Typography>
              
              <TextField
                fullWidth
                size="small"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                {filteredRelatedVideos.map((relatedVideo, index) => (
                  <React.Fragment key={relatedVideo.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        component="a"
                        href={`/academy/videos/${relatedVideo.id}`}
                        disabled={relatedVideo.isLocked}
                      >
                        <ListItemIcon>
                          {relatedVideo.isLocked ? (
                            <Lock color="disabled" />
                          ) : (
                            <PlayCircleOutline />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={relatedVideo.title}
                          secondary={
                            relatedVideo.duration
                              ? formatTime(relatedVideo.duration)
                              : relatedVideo.category
                          }
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: 600,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                    {index < filteredRelatedVideos.length - 1 ? <Divider /> : null}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      ) : null}
    </Box>
  );
}