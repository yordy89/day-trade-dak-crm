'use client';

import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ConnectionStateToast,
  useLocalParticipant,
  useRemoteParticipants,
  useTracks,
  useRoomContext,
} from '@livekit/components-react';
import '@livekit/components-styles';
import '@/styles/livekit-mobile.css';
import { Track, RemoteParticipant } from 'livekit-client';
import {
  Box,
  IconButton,
  Badge,
  Drawer,
  Typography,
  useTheme,
  useMediaQuery,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  VideoCamera,
  VideoCameraSlash,
  Microphone,
  MicrophoneSlash,
  MonitorPlay,
  ChatTeardrop,
  Users,
  Record,
  PhoneDisconnect,
  DotsThreeVertical,
  X,
} from '@phosphor-icons/react';
import axios from 'axios';

interface MobileOptimizedLiveKitRoomProps {
  meetingId: string;
  roomName: string;
  userName: string;
  token: string;
  serverUrl?: string;
  onDisconnect?: () => void;
  isHost?: boolean;
}

// Mobile-optimized control bar
function MobileControlBar({
  meetingId,
  isHost,
  onLeave,
  isRecording,
  onRecordingToggle,
  recordingStatus,
}: {
  meetingId: string;
  isHost: boolean;
  onLeave: () => void;
  isRecording: boolean;
  onRecordingToggle: () => void;
  recordingStatus: string;
}) {
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(true);
  const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);
  const participants = useRemoteParticipants();
  const localParticipant = useLocalParticipant();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery('(max-width:600px)');
  const isSmallMobile = useMediaQuery('(max-width:400px)');
  const isTablet = useMediaQuery('(max-width:900px)');

  return (
    <>
      {/* Main Control Bar - Fixed at bottom */}
      <Box
        className="lk-control-bar-mobile"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1400,
          background: isDarkMode
            ? 'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.95) 20%)'
            : 'linear-gradient(to top, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 20%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          pb: 'env(safe-area-inset-bottom)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            px: isSmallMobile ? 1 : 2,
            py: isSmallMobile ? 1.5 : 2,
            gap: isSmallMobile ? 0.5 : 1,
            maxWidth: isTablet ? '100%' : '800px',
            margin: '0 auto',
          }}
        >
          {/* Camera Button */}
          <IconButton
            onClick={() => setIsCameraEnabled(!isCameraEnabled)}
            sx={{
              bgcolor: isCameraEnabled
                ? 'rgba(76, 175, 80, 0.15)'
                : 'rgba(244, 67, 54, 0.15)',
              color: isCameraEnabled ? 'success.main' : 'error.main',
              width: isSmallMobile ? 52 : 56,
              height: isSmallMobile ? 52 : 56,
              borderRadius: '50%',
              border: `2px solid ${isCameraEnabled ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: isCameraEnabled
                  ? 'rgba(76, 175, 80, 0.25)'
                  : 'rgba(244, 67, 54, 0.25)',
                transform: 'scale(1.05)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            {isCameraEnabled ?
              <VideoCamera size={isSmallMobile ? 26 : 28} weight="fill" /> :
              <VideoCameraSlash size={isSmallMobile ? 26 : 28} weight="fill" />
            }
          </IconButton>

          {/* Microphone Button */}
          <IconButton
            onClick={() => setIsMicrophoneEnabled(!isMicrophoneEnabled)}
            sx={{
              bgcolor: isMicrophoneEnabled
                ? 'rgba(76, 175, 80, 0.15)'
                : 'rgba(244, 67, 54, 0.15)',
              color: isMicrophoneEnabled ? 'success.main' : 'error.main',
              width: isSmallMobile ? 52 : 56,
              height: isSmallMobile ? 52 : 56,
              borderRadius: '50%',
              border: `2px solid ${isMicrophoneEnabled ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: isMicrophoneEnabled
                  ? 'rgba(76, 175, 80, 0.25)'
                  : 'rgba(244, 67, 54, 0.25)',
                transform: 'scale(1.05)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            {isMicrophoneEnabled ?
              <Microphone size={isSmallMobile ? 26 : 28} weight="fill" /> :
              <MicrophoneSlash size={isSmallMobile ? 26 : 28} weight="fill" />
            }
          </IconButton>

          {/* Chat Button */}
          <IconButton
            onClick={() => setShowChat(!showChat)}
            sx={{
              bgcolor: showChat ? 'primary.main' : 'action.hover',
              color: showChat ? 'white' : 'text.primary',
              width: isSmallMobile ? 52 : 56,
              height: isSmallMobile ? 52 : 56,
              borderRadius: '50%',
              border: `2px solid ${showChat ? theme.palette.primary.dark : 'rgba(156, 163, 175, 0.3)'}`,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: showChat ? 'primary.dark' : 'action.selected',
                transform: 'scale(1.05)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            <ChatTeardrop size={isSmallMobile ? 26 : 28} weight="fill" />
          </IconButton>

          {/* Participants Button */}
          <IconButton
            onClick={() => setShowParticipants(!showParticipants)}
            sx={{
              bgcolor: showParticipants ? 'primary.main' : 'action.hover',
              color: showParticipants ? 'white' : 'text.primary',
              width: isSmallMobile ? 52 : 56,
              height: isSmallMobile ? 52 : 56,
              borderRadius: '50%',
              border: `2px solid ${showParticipants ? theme.palette.primary.dark : 'rgba(156, 163, 175, 0.3)'}`,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: showParticipants ? 'primary.dark' : 'action.selected',
                transform: 'scale(1.05)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            <Badge
              badgeContent={participants.length + 1}
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: isSmallMobile ? 10 : 11,
                  minWidth: 18,
                  height: 18,
                },
              }}
            >
              <Users size={isSmallMobile ? 26 : 28} weight="fill" />
            </Badge>
          </IconButton>

          {/* Leave Button */}
          <IconButton
            onClick={onLeave}
            sx={{
              bgcolor: 'error.main',
              color: 'white',
              width: isSmallMobile ? 52 : 56,
              height: isSmallMobile ? 52 : 56,
              borderRadius: '50%',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'error.dark',
                transform: 'scale(1.05)',
                boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            <PhoneDisconnect size={isSmallMobile ? 26 : 28} weight="fill" />
          </IconButton>

          {/* More Options (Screen share, Recording for host) */}
          {!isSmallMobile && (
            <IconButton
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              sx={{
                bgcolor: 'action.hover',
                color: 'text.primary',
                width: 56,
                height: 56,
                borderRadius: '50%',
                border: '2px solid rgba(156, 163, 175, 0.3)',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'action.selected',
                  transform: 'scale(1.05)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
              }}
            >
              <DotsThreeVertical size={28} weight="bold" />
            </IconButton>
          )}
        </Box>

        {/* Secondary Options Panel (for tablets/larger mobiles) */}
        {showMoreOptions && !isSmallMobile && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              px: 2,
              py: 1.5,
              borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            }}
          >
            {/* Screen Share */}
            <Tooltip title={isScreenShareEnabled ? 'Stop sharing' : 'Share screen'}>
              <IconButton
                onClick={() => setIsScreenShareEnabled(!isScreenShareEnabled)}
                sx={{
                  bgcolor: isScreenShareEnabled
                    ? 'primary.main'
                    : 'action.hover',
                  color: isScreenShareEnabled ? 'white' : 'text.primary',
                  width: 48,
                  height: 48,
                  '&:hover': {
                    bgcolor: isScreenShareEnabled
                      ? 'primary.dark'
                      : 'action.selected',
                  },
                }}
              >
                <MonitorPlay size={24} />
              </IconButton>
            </Tooltip>

            {/* Recording (Host only) */}
            {isHost && (
              <Tooltip title={isRecording ? 'Stop recording' : 'Start recording'}>
                <IconButton
                  onClick={onRecordingToggle}
                  disabled={!!recordingStatus}
                  sx={{
                    bgcolor: isRecording ? 'error.main' : 'action.hover',
                    color: isRecording ? 'white' : 'text.primary',
                    width: 48,
                    height: 48,
                    '&:hover': {
                      bgcolor: isRecording ? 'error.dark' : 'action.selected',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'action.disabledBackground',
                    },
                  }}
                >
                  {recordingStatus ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <Record size={24} weight={isRecording ? 'fill' : 'regular'} />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </Box>

      {/* Mobile Chat Drawer */}
      <Drawer
        anchor="right"
        open={showChat}
        onClose={() => setShowChat(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: isTablet ? '100%' : 450,
            bgcolor: isDarkMode ? 'background.paper' : 'background.default',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Chat</Typography>
          <IconButton onClick={() => setShowChat(false)}>
            <X size={24} />
          </IconButton>
        </Box>
        {/* Chat content would go here */}
      </Drawer>

      {/* Mobile Participants Drawer */}
      <Drawer
        anchor="bottom"
        open={showParticipants}
        onClose={() => setShowParticipants(false)}
        PaperProps={{
          sx: {
            maxHeight: '70vh',
            borderRadius: '16px 16px 0 0',
            bgcolor: isDarkMode ? 'background.paper' : 'background.default',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            Participants ({participants.length + 1})
          </Typography>
        </Box>
        <List sx={{ px: 2, pb: 2 }}>
          {/* Local participant */}
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {localParticipant.localParticipant?.name?.charAt(0) || 'Y'}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={localParticipant.localParticipant?.name || 'You'}
              secondary={
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  <Chip label="You" size="small" color="primary" />
                  {isHost && <Chip label="Host" size="small" color="error" />}
                </Box>
              }
            />
          </ListItem>
          {/* Remote participants */}
          {participants.map((participant) => (
            <ListItem key={participant.identity}>
              <ListItemAvatar>
                <Avatar>
                  {participant.name?.charAt(0) || 'U'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={participant.name || 'Unknown'}
                secondary={
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                    {participant.isMicrophoneEnabled && <Microphone size={16} />}
                    {participant.isCameraEnabled && <VideoCamera size={16} />}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

// Room content wrapper
function MobileRoomContent({
  meetingId,
  isHost,
  onDisconnect,
}: {
  meetingId: string;
  isHost: boolean;
  onDisconnect: () => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<string>('');
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:900px)');

  const handleRecordingToggle = async () => {
    if (!isHost) return;

    setRecordingStatus(isRecording ? 'Stopping...' : 'Starting...');

    let authToken = localStorage.getItem('custom-auth-token');
    if (!authToken) {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const authData = JSON.parse(authStorage);
          authToken = authData.state?.authToken;
        } catch (e) {
          console.error('Failed to parse auth storage:', e);
        }
      }
    }

    if (!authToken) {
      alert('Authentication required to control recording');
      setRecordingStatus('');
      return;
    }

    try {
      const url = isRecording
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/livekit/rooms/${meetingId}/recording/stop`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/livekit/rooms/${meetingId}/recording/start`;

      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setIsRecording(!isRecording);
      setRecordingStatus('');
    } catch (error: any) {
      console.error('Failed to toggle recording:', error);
      alert(`Failed to ${isRecording ? 'stop' : 'start'} recording. Please try again.`);
      setRecordingStatus('');
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100vh',
        width: '100vw',
        bgcolor: isDarkMode ? 'rgb(17, 17, 17)' : '#f5f5f5',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Recording indicator */}
      {isRecording && (
        <Box
          sx={{
            position: 'fixed',
            top: 'env(safe-area-inset-top, 16px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1500,
            bgcolor: 'error.main',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
          }}
        >
          <Record size={16} weight="fill" />
          <Typography variant="caption" fontWeight="bold">
            RECORDING
          </Typography>
        </Box>
      )}

      {/* Video Grid Container */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: isMobile ? 1 : 2,
          pb: isMobile ? '100px' : '120px', // Space for bottom controls
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            '& .lk-video-conference': {
              height: '100%',
            },
            '& .lk-grid-layout': {
              height: '100%',
              padding: isMobile ? '0.5rem' : '1rem',
              gap: isMobile ? '0.5rem' : '1rem',
            },
            '& .lk-participant-tile': {
              borderRadius: isMobile ? '8px' : '12px',
            },
            '& .lk-participant-metadata': {
              padding: isMobile ? '4px 8px' : '8px 12px',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
            },
            '& .lk-focus-layout': {
              height: '100%',
            },
            '& .lk-focus-layout__stage': {
              padding: isMobile ? '0.5rem' : '1rem',
            },
          }}
        >
          <VideoConference
            chatMessageFormatter={(message) => message}
            SettingsComponent={() => null}
          />
        </Box>
      </Box>

      {/* Mobile Control Bar */}
      <MobileControlBar
        meetingId={meetingId}
        isHost={isHost}
        onLeave={onDisconnect}
        isRecording={isRecording}
        onRecordingToggle={handleRecordingToggle}
        recordingStatus={recordingStatus}
      />

      <RoomAudioRenderer />
      <ConnectionStateToast />
    </Box>
  );
}

// Main component
export function MobileOptimizedLiveKitRoom({
  meetingId,
  roomName,
  userName,
  token,
  serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://live.daytradedak.com',
  onDisconnect,
  isHost = false,
}: MobileOptimizedLiveKitRoomProps) {
  const handleDisconnect = async () => {
    if (onDisconnect) {
      onDisconnect();
    }
  };

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={serverUrl}
      onDisconnected={handleDisconnect}
      connect={true}
      connectOptions={{
        autoSubscribe: true,
      }}
      data-e2e="livekit-room"
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <MobileRoomContent
        meetingId={meetingId}
        isHost={isHost}
        onDisconnect={handleDisconnect}
      />
    </LiveKitRoom>
  );
}