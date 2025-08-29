'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  ControlBar,
  RoomAudioRenderer,
  ConnectionStateToast,
  Chat,
  TrackToggle,
  DisconnectButton,
  useParticipants,
  useTracks,
  useLocalParticipant,
  formatChatMessageLinks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
  Chat as ChatIcon,
  People,
  FiberManualRecord,
  Stop,
  Fullscreen,
  FullscreenExit,
  CallEnd,
  Settings,
  MoreVert,
} from '@mui/icons-material';
import Image from 'next/image';
import axios from 'axios';

interface ProfessionalLiveKitRoomProps {
  meetingId: string;
  roomName: string;
  userName: string;
  token?: string;
  serverUrl?: string;
  onDisconnect?: () => void;
}

// Custom Control Bar Component
function CustomControlBar({ 
  meetingId, 
  isHost,
  onLeave 
}: { 
  meetingId: string;
  isHost: boolean;
  onLeave: () => void;
}) {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Handle recording
  const handleRecording = async () => {
    if (!isHost) {
      console.warn('Only host can control recording');
      return;
    }

    try {
      const authToken = localStorage.getItem('custom-auth-token');
      const endpoint = isRecording ? 'stop' : 'start';
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/livekit/rooms/${meetingId}/recording/${endpoint}`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      
      setIsRecording(!isRecording);
    } catch (error) {
      console.error('Failed to toggle recording:', error);
    }
  };

  return (
    <>
      {/* Control Bar */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          zIndex: 100,
        }}
      >
        {/* Microphone Button */}
        <Box sx={{ position: 'relative' }}>
          <TrackToggle
            source={Track.Source.Microphone}
            onChange={(enabled) => setMicEnabled(enabled)}
          >
            <IconButton
              sx={{
                width: 56,
                height: 56,
                backgroundColor: micEnabled ? '#16a34a' : '#dc2626',
                color: 'white',
                '&:hover': {
                  backgroundColor: micEnabled ? '#15803d' : '#b91c1c',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s',
                boxShadow: micEnabled 
                  ? '0 4px 14px rgba(22, 163, 74, 0.4)' 
                  : '0 4px 14px rgba(220, 38, 38, 0.4)',
              }}
            >
              {micEnabled ? <Mic /> : <MicOff />}
            </IconButton>
          </TrackToggle>
        </Box>

        {/* Camera Button */}
        <Box sx={{ position: 'relative' }}>
          <TrackToggle
            source={Track.Source.Camera}
            onChange={(enabled) => setCameraEnabled(enabled)}
          >
            <IconButton
              sx={{
                width: 56,
                height: 56,
                backgroundColor: cameraEnabled ? '#16a34a' : '#dc2626',
                color: 'white',
                '&:hover': {
                  backgroundColor: cameraEnabled ? '#15803d' : '#b91c1c',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s',
                boxShadow: cameraEnabled 
                  ? '0 4px 14px rgba(22, 163, 74, 0.4)' 
                  : '0 4px 14px rgba(220, 38, 38, 0.4)',
              }}
            >
              {cameraEnabled ? <Videocam /> : <VideocamOff />}
            </IconButton>
          </TrackToggle>
        </Box>

        {/* Screen Share Button */}
        <Box sx={{ position: 'relative' }}>
          <TrackToggle
            source={Track.Source.ScreenShare}
            onChange={(enabled) => setScreenShareEnabled(enabled)}
          >
            <IconButton
              sx={{
                width: 56,
                height: 56,
                backgroundColor: screenShareEnabled ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
                color: 'white',
                border: '2px solid',
                borderColor: screenShareEnabled ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)',
                '&:hover': {
                  backgroundColor: screenShareEnabled ? '#2563eb' : 'rgba(59, 130, 246, 0.3)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s',
                boxShadow: screenShareEnabled 
                  ? '0 4px 14px rgba(59, 130, 246, 0.4)' 
                  : 'none',
              }}
            >
              {screenShareEnabled ? <StopScreenShare /> : <ScreenShare />}
            </IconButton>
          </TrackToggle>
        </Box>

        {/* Chat Button */}
        <IconButton
          onClick={() => setShowChat(!showChat)}
          sx={{
            width: 56,
            height: 56,
            backgroundColor: showChat ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)',
            color: 'white',
            border: '2px solid',
            borderColor: showChat ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)',
            '&:hover': {
              backgroundColor: showChat ? '#7c3aed' : 'rgba(139, 92, 246, 0.3)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s',
            boxShadow: showChat 
              ? '0 4px 14px rgba(139, 92, 246, 0.4)' 
              : 'none',
          }}
        >
          <ChatIcon />
        </IconButton>

        {/* Participants Button */}
        <IconButton
          onClick={() => setShowParticipants(!showParticipants)}
          sx={{
            width: 56,
            height: 56,
            backgroundColor: showParticipants ? '#f97316' : 'rgba(249, 115, 22, 0.2)',
            color: 'white',
            border: '2px solid',
            borderColor: showParticipants ? '#f97316' : 'rgba(249, 115, 22, 0.3)',
            '&:hover': {
              backgroundColor: showParticipants ? '#ea580c' : 'rgba(249, 115, 22, 0.3)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s',
            boxShadow: showParticipants 
              ? '0 4px 14px rgba(249, 115, 22, 0.4)' 
              : 'none',
          }}
        >
          <Badge badgeContent={participants.length} color="error">
            <People />
          </Badge>
        </IconButton>

        {/* Recording Button (Host Only) */}
        {isHost && (
          <IconButton
            onClick={handleRecording}
            sx={{
              width: 56,
              height: 56,
              backgroundColor: isRecording ? '#ef4444' : 'rgba(239, 68, 68, 0.2)',
              color: 'white',
              border: '2px solid',
              borderColor: isRecording ? '#ef4444' : 'rgba(239, 68, 68, 0.3)',
              '&:hover': {
                backgroundColor: isRecording ? '#dc2626' : 'rgba(239, 68, 68, 0.3)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s',
              boxShadow: isRecording 
                ? '0 4px 14px rgba(239, 68, 68, 0.4)' 
                : 'none',
              animation: isRecording ? 'pulse 2s infinite' : 'none',
            }}
          >
            {isRecording ? <Stop /> : <FiberManualRecord />}
          </IconButton>
        )}

        {/* Settings Button */}
        <IconButton
          sx={{
            width: 56,
            height: 56,
            backgroundColor: 'rgba(156, 163, 175, 0.2)',
            color: 'white',
            border: '2px solid rgba(156, 163, 175, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(156, 163, 175, 0.3)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s',
          }}
        >
          <Settings />
        </IconButton>

        {/* Leave Button */}
        <Button
          onClick={onLeave}
          variant="contained"
          startIcon={<CallEnd />}
          sx={{
            ml: 2,
            px: 3,
            py: 1.5,
            backgroundColor: '#dc2626',
            '&:hover': {
              backgroundColor: '#b91c1c',
              transform: 'scale(1.05)',
            },
            borderRadius: '28px',
            fontWeight: 600,
            transition: 'all 0.2s',
            boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
          }}
        >
          Leave
        </Button>
      </Box>

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={showChat}
        onClose={() => setShowChat(false)}
        PaperProps={{
          sx: {
            width: 320,
            backgroundColor: 'rgba(17, 17, 17, 0.95)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" color="white" gutterBottom>
            Chat
          </Typography>
          <Chat />
        </Box>
      </Drawer>

      {/* Participants Drawer */}
      <Drawer
        anchor="left"
        open={showParticipants}
        onClose={() => setShowParticipants(false)}
        PaperProps={{
          sx: {
            width: 320,
            backgroundColor: 'rgba(17, 17, 17, 0.95)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" color="white" gutterBottom>
            Participants ({participants.length})
          </Typography>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
          <List>
            {participants.map((participant) => (
              <ListItem key={participant.sid}>
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: '#16a34a' }}>
                    {(participant.name || participant.identity || 'U')[0].toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography color="white">
                      {participant.name || participant.identity || 'Unknown'}
                      {participant.isLocal && ' (You)'}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                      {participant.isSpeaking && (
                        <Chip label="Speaking" size="small" color="success" />
                      )}
                      {participant.isCameraEnabled && (
                        <Chip label="Video" size="small" sx={{ backgroundColor: 'rgba(22, 163, 74, 0.2)' }} />
                      )}
                      {participant.isMicrophoneEnabled && (
                        <Chip label="Audio" size="small" sx={{ backgroundColor: 'rgba(22, 163, 74, 0.2)' }} />
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Pulse Animation for Recording */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
          }
          50% {
            box-shadow: 0 4px 20px rgba(239, 68, 68, 0.6), 0 0 30px rgba(239, 68, 68, 0.4);
          }
          100% {
            box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
          }
        }
      `}</style>
    </>
  );
}

// Inner Room Component that uses tracks hooks
function RoomContent({ meetingId, isHost, onDisconnect }: { meetingId: string; isHost: boolean; onDisconnect: () => void }) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <>
      {/* Audio Renderer for all participants */}
      <RoomAudioRenderer />
      
      {/* Connection State Toast */}
      <ConnectionStateToast />
      
      {/* Video Grid */}
      <GridLayout
        tracks={tracks}
        style={{
          height: 'calc(100% - 100px)',
          padding: '16px',
        }}
      >
        <ParticipantTile />
      </GridLayout>
      
      {/* Custom Control Bar */}
      <CustomControlBar 
        meetingId={meetingId}
        isHost={isHost}
        onLeave={onDisconnect}
      />
    </>
  );
}

// Main Room Component
export function ProfessionalLiveKitRoom({
  meetingId,
  roomName,
  userName,
  token: providedToken,
  serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://live.daytradedak.com',
  onDisconnect,
}: ProfessionalLiveKitRoomProps) {
  const [token, setToken] = useState<string | null>(providedToken || null);
  const [loading, setLoading] = useState(!providedToken);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHost, setIsHost] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!providedToken) {
      const fetchToken = async () => {
        try {
          const authStorage = localStorage.getItem('auth-storage');
          let authToken = null;
          let userId = null;

          if (authStorage) {
            const parsed = JSON.parse(authStorage);
            authToken = parsed.state?.authToken;
            userId = parsed.state?.user?._id;
          }

          if (!authToken) {
            authToken = localStorage.getItem('custom-auth-token');
            const userStr = localStorage.getItem('custom-auth-user');
            if (userStr) {
              userId = JSON.parse(userStr)._id;
            }
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/livekit/rooms/${meetingId}/token`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({
                name: userName,
                identity: userId || userName,
              }),
            }
          );

          if (!response.ok) {
            throw new Error('Failed to get meeting token');
          }

          const data = await response.json();
          setToken(data.token);
          
          // Parse token to check if user is host
          try {
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            const metadata = payload.metadata ? JSON.parse(payload.metadata) : {};
            setIsHost(metadata.isHost === true);
          } catch (e) {
            console.error('Failed to parse token:', e);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to join meeting');
        } finally {
          setLoading(false);
        }
      };

      fetchToken();
    } else {
      // Parse provided token to check if user is host
      try {
        const payload = JSON.parse(atob(providedToken.split('.')[1]));
        const metadata = payload.metadata ? JSON.parse(payload.metadata) : {};
        setIsHost(metadata.isHost === true);
      } catch (e) {
        console.error('Failed to parse token:', e);
      }
    }
  }, [meetingId, userName, providedToken]);

  const handleDisconnect = async () => {
    if (onDisconnect) {
      onDisconnect();
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#0a0a0a',
        }}
      >
        <CircularProgress sx={{ color: '#16a34a' }} />
      </Box>
    );
  }

  if (error || !token) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#0a0a0a',
          p: 3,
        }}
      >
        <Alert severity="error">
          <Typography>{error || 'Unable to join meeting'}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100vh', 
      width: '100vw',
      display: 'flex', 
      flexDirection: 'column', 
      bgcolor: '#0a0a0a',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
    }}>
      {/* Custom Header */}
      <AppBar position="static" sx={{ 
        bgcolor: '#111', 
        borderBottom: '1px solid rgba(22, 163, 74, 0.3)',
        minHeight: '64px',
        zIndex: 1000,
      }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <Image 
              src="/assets/logos/day_trade_dak_white_logo.png" 
              alt="DayTradeDak" 
              width={120} 
              height={40}
              style={{ objectFit: 'contain' }}
            />
          </Box>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#16a34a' }}>
            {roomName}
          </Typography>
          {isHost && (
            <Chip 
              label="HOST" 
              size="small" 
              sx={{ 
                mr: 2,
                backgroundColor: '#dc2626',
                color: 'white',
                fontWeight: 600,
              }} 
            />
          )}
          <IconButton
            onClick={toggleFullscreen}
            sx={{
              color: '#16a34a',
              bgcolor: 'rgba(22, 163, 74, 0.1)',
              border: '1px solid rgba(22, 163, 74, 0.3)',
              '&:hover': {
                bgcolor: 'rgba(22, 163, 74, 0.2)',
                border: '1px solid rgba(22, 163, 74, 0.5)',
              },
            }}
          >
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* LiveKit Room */}
      <Box sx={{ 
        flex: 1, 
        position: 'relative',
        overflow: 'hidden',
        height: 'calc(100vh - 64px)',
      }}>
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
          style={{ height: '100%', width: '100%' }}
        >
          <RoomContent
            meetingId={meetingId}
            isHost={isHost}
            onDisconnect={handleDisconnect}
          />
        </LiveKitRoom>
      </Box>
    </Box>
  );
}