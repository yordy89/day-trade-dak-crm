'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Slider,
  Stack,
  Tooltip,
  LinearProgress,
  Chip,
  useTheme,
  Collapse,
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
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  PictureInPicture,
  Forward10,
  Replay10,
  Search,
  PlayCircleOutline,
  Lock,
} from '@mui/icons-material';

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
  captionsUrl,
  onProgress,
  onComplete,
  relatedVideos = [],
  bookmarks: _bookmarks = [],
  onBookmark: _onBookmark,
}: ProfessionalVideoPlayerProps) {
  const theme = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [buffered, setBuffered] = useState(0);
  
  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [_showNotes, _setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Control visibility timer
  const controlsTimeoutRef = useRef<number>();

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updateTime = () => {
      setCurrentTime(videoElement.currentTime);
      
      // Update buffered amount
      if (videoElement.buffered.length > 0) {
        const bufferedEnd = videoElement.buffered.end(videoElement.buffered.length - 1);
        setBuffered((bufferedEnd / videoElement.duration) * 100);
      }
      
      // Call progress callback
      if (onProgress) {
        const progress = (videoElement.currentTime / videoElement.duration) * 100;
        onProgress(progress);
      }
    };

    const updateDuration = () => {
      setDuration(videoElement.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) {
        onComplete();
      }
    };

    videoElement.addEventListener('timeupdate', updateTime);
    videoElement.addEventListener('loadedmetadata', updateDuration);
    videoElement.addEventListener('ended', handleEnded);

    return () => {
      videoElement.removeEventListener('timeupdate', updateTime);
      videoElement.removeEventListener('loadedmetadata', updateDuration);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [onProgress, onComplete]);

  const togglePlayPause = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
    } else {
      void videoElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newTime: number) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    videoElement.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVolume: number) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    videoElement.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (isMuted) {
      videoElement.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoElement.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        void container.requestFullscreen();
      }
    } else if (document.exitFullscreen) {
      void document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const changePlaybackRate = (rate: number) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    videoElement.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const skip = (seconds: number) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const newTime = Math.max(0, Math.min(videoElement.currentTime + seconds, duration));
    handleSeek(newTime);
  };

  const togglePictureInPicture = async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoElement.requestPictureInPicture();
      }
    } catch (error) {
      console.error('PiP error:', error);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
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

  const _addBookmark = () => {
    if (_onBookmark && noteText) {
      _onBookmark(currentTime, noteText);
      setNoteText('');
    }
  };

  const filteredRelatedVideos = relatedVideos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
      {/* Main Video Player */}
      <Box sx={{ flex: 1 }}>
        <Card
          ref={containerRef}
          sx={{
            position: 'relative',
            backgroundColor: 'black',
            overflow: 'hidden',
            borderRadius: 2,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            if (isPlaying) {
              setShowControls(false);
            }
          }}
        >
          {/* Video Element */}
          <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
            <video
              ref={videoRef}
              src={src}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              onClick={togglePlayPause}
            >
              <track 
                src={captionsUrl || ''} 
                kind="captions" 
                srcLang="en" 
                label="English" 
                default 
              />
            </video>

            {/* Controls Overlay */}
            <Collapse in={showControls}>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
                  p: 2,
                }}
              >
                {/* Progress Bar */}
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <LinearProgress
                    variant="buffer"
                    value={(currentTime / duration) * 100}
                    valueBuffer={buffered}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.palette.primary.main,
                      },
                      '& .MuiLinearProgress-bar2Buffer': {
                        backgroundColor: 'rgba(255,255,255,0.3)',
                      },
                    }}
                  />
                  <Slider
                    value={currentTime}
                    max={duration}
                    onChange={(_, value) => handleSeek(value as number)}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      left: 0,
                      right: 0,
                      '& .MuiSlider-thumb': {
                        width: 12,
                        height: 12,
                      },
                      '& .MuiSlider-rail': {
                        opacity: 0,
                      },
                      '& .MuiSlider-track': {
                        opacity: 0,
                      },
                    }}
                  />
                </Box>

                {/* Control Buttons */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton onClick={togglePlayPause} sx={{ color: 'white' }}>
                    {isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>

                  <IconButton onClick={() => skip(-10)} sx={{ color: 'white' }} size="small">
                    <Replay10 />
                  </IconButton>

                  <IconButton onClick={() => skip(10)} sx={{ color: 'white' }} size="small">
                    <Forward10 />
                  </IconButton>

                  <Typography variant="caption" sx={{ color: 'white', mx: 2 }}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </Typography>

                  <Box sx={{ flex: 1 }} />

                  {/* Volume Control */}
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton onClick={toggleMute} sx={{ color: 'white' }} size="small">
                      {isMuted ? <VolumeOff /> : <VolumeUp />}
                    </IconButton>
                    <Slider
                      value={isMuted ? 0 : volume}
                      onChange={(_, value) => handleVolumeChange(value as number)}
                      max={1}
                      step={0.1}
                      sx={{
                        width: 80,
                        color: 'white',
                        '& .MuiSlider-thumb': {
                          width: 12,
                          height: 12,
                        },
                      }}
                    />
                  </Stack>

                  {/* Speed Control */}
                  <Tooltip title="Playback Speed">
                    <Chip
                      label={`${playbackRate}x`}
                      onClick={() => setShowSettings(!showSettings)}
                      size="small"
                      sx={{
                        color: 'white',
                        borderColor: 'white',
                        cursor: 'pointer',
                      }}
                      variant="outlined"
                    />
                  </Tooltip>

                  <IconButton onClick={togglePictureInPicture} sx={{ color: 'white' }} size="small">
                    <PictureInPicture />
                  </IconButton>

                  <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }} size="small">
                    {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                  </IconButton>
                </Stack>

                {/* Speed Settings */}
                <Collapse in={showSettings}>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                      <Chip
                        key={`rate-${rate}`}
                        label={`${rate}x`}
                        onClick={() => {
                          changePlaybackRate(rate);
                          setShowSettings(false);
                        }}
                        size="small"
                        color={playbackRate === rate ? 'primary' : 'default'}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Stack>
                </Collapse>
              </Box>
            </Collapse>
          </Box>
        </Card>
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