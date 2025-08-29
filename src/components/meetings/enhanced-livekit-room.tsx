'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  useRoomContext,
  useParticipants,
  useLocalParticipant,
  Chat,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Alert, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Badge,
  Tooltip,
  AppBar,
  Toolbar,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  MicOff as MicOffIcon,
  Mic as MicIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
  CallEnd as CallEndIcon,
  People as PeopleIcon,
  Chat as ChatIcon,
  MoreVert as MoreVertIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  PanTool as PanToolIcon,
  Settings as SettingsIcon,
  PresentToAll as PresentToAllIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Track, RemoteParticipant, LocalParticipant, Room, RoomEvent, ParticipantEvent, TrackPublication } from 'livekit-client';
import axios from 'axios';
import Image from 'next/image';

interface EnhancedLiveKitRoomProps {
  meetingId: string;
  roomName: string;
  userName: string;
  token?: string;
  serverUrl?: string;
  onDisconnect?: () => void;
}

export function EnhancedLiveKitRoom({
  meetingId,
  roomName,
  userName,
  token: providedToken,
  serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://live.daytradedak.com',
  onDisconnect,
}: EnhancedLiveKitRoomProps) {
  const [token, setToken] = useState<string | null>(providedToken || null);
  const [loading, setLoading] = useState(!providedToken);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<{
    canPublish: boolean;
    canSubscribe: boolean;
    canPublishData: boolean;
    canShare: boolean;
    canMuteOthers: boolean;
    isHost: boolean;
  }>({
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    canShare: true,
    canMuteOthers: false,
    isHost: false,
  });

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
          
          // Parse token to get permissions
          try {
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            const metadata = payload.metadata ? JSON.parse(payload.metadata) : {};
            const videoGrants = payload.video || {};
            
            setPermissions({
              canPublish: videoGrants.canPublish !== false,
              canSubscribe: videoGrants.canSubscribe !== false,
              canPublishData: videoGrants.canPublishData !== false,
              canShare: videoGrants.canPublish !== false, // Share requires publish permission
              canMuteOthers: metadata.isHost === true,
              isHost: metadata.isHost === true,
            });
          } catch (e) {
            console.error('Failed to parse permissions from token:', e);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to join meeting');
        } finally {
          setLoading(false);
        }
      };

      fetchToken();
    }
  }, [meetingId, userName, providedToken]);

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
    <LiveKitRoom
      video={permissions.canPublish}
      audio={permissions.canPublish}
      token={token}
      serverUrl={serverUrl}
      connectOptions={{ 
        autoSubscribe: permissions.canSubscribe,
      }}
      onDisconnected={onDisconnect}
      style={{ height: '100vh', backgroundColor: '#0a0a0a' }}
    >
      <MeetingInterface 
        meetingId={meetingId} 
        token={token} 
        roomName={roomName}
        permissions={permissions} 
      />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

function MeetingInterface({ 
  meetingId, 
  token, 
  roomName,
  permissions 
}: { 
  meetingId: string; 
  token: string; 
  roomName: string;
  permissions: {
    canPublish: boolean;
    canSubscribe: boolean;
    canPublishData: boolean;
    canShare: boolean;
    canMuteOthers: boolean;
    isHost: boolean;
  };
}) {
  const room = useRoomContext();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isMuted, setIsMuted] = useState(!permissions.canPublish);
  const [isVideoOff, setIsVideoOff] = useState(!permissions.canPublish);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [ending, setEnding] = useState(false);

  // Use permissions from props
  const isHost = permissions.isHost;

  const toggleMicrophone = useCallback(async () => {
    if (!permissions.canPublish) {
      console.warn('User does not have permission to publish audio');
      return;
    }
    if (localParticipant.localParticipant) {
      const enabled = localParticipant.localParticipant.isMicrophoneEnabled;
      await localParticipant.localParticipant.setMicrophoneEnabled(!enabled);
      // State will be updated by the track event listeners
    }
  }, [localParticipant, permissions.canPublish]);

  const toggleCamera = useCallback(async () => {
    if (!permissions.canPublish) {
      console.warn('User does not have permission to publish video');
      return;
    }
    if (localParticipant.localParticipant) {
      const enabled = localParticipant.localParticipant.isCameraEnabled;
      await localParticipant.localParticipant.setCameraEnabled(!enabled);
      // State will be updated by the track event listeners
    }
  }, [localParticipant, permissions.canPublish]);

  const toggleScreenShare = useCallback(async () => {
    if (!permissions.canShare) {
      console.warn('User does not have permission to share screen');
      return;
    }
    if (localParticipant.localParticipant) {
      if (isScreenSharing) {
        await localParticipant.localParticipant.setScreenShareEnabled(false);
      } else {
        await localParticipant.localParticipant.setScreenShareEnabled(true);
      }
      setIsScreenSharing(!isScreenSharing);
    }
  }, [localParticipant, isScreenSharing, permissions.canShare]);

  const handleMuteAll = useCallback(async () => {
    if (!permissions.canMuteOthers) {
      console.warn('User does not have permission to mute others');
      return;
    }
    
    // Send data message to all participants to mute
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify({ action: 'muteAll' }));
    await localParticipant.localParticipant?.publishData(data, { reliable: true });
  }, [permissions.canMuteOthers, localParticipant]);

  const handleEndMeeting = async () => {
    setEnding(true);
    try {
      const authStorage = localStorage.getItem('auth-storage');
      let authToken = null;

      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        authToken = parsed.state?.authToken;
      }

      if (!authToken) {
        authToken = localStorage.getItem('custom-auth-token');
      }
      
      // Call the end meeting endpoint which will:
      // 1. Update meeting status to 'completed'
      // 2. Send WebSocket notifications to all participants
      // 3. Delete the LiveKit room
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/livekit/rooms/${meetingId}/end`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      console.log('Meeting ended successfully:', response.data);
      
      // The room will be disconnected automatically when LiveKit server deletes it
      // But we disconnect immediately for better UX
      room.disconnect();
    } catch (error) {
      console.error('Failed to end meeting:', error);
      // Even if API call fails, disconnect locally
      room.disconnect();
    }
    setShowEndDialog(false);
  };

  const handleLeaveMeeting = () => {
    room.disconnect();
  };

  // Track initial setup
  const [hasInitialized, setHasInitialized] = useState(false);

  // Sync local participant state with UI
  useEffect(() => {
    if (!localParticipant.localParticipant) return;

    // Sync current state
    setIsMuted(!localParticipant.localParticipant.isMicrophoneEnabled);
    setIsVideoOff(!localParticipant.localParticipant.isCameraEnabled);

    // Listen for track muted/unmuted events
    const handleTrackMuted = (pub: TrackPublication) => {
      if (pub.source === Track.Source.Camera) {
        setIsVideoOff(true);
      } else if (pub.source === Track.Source.Microphone) {
        setIsMuted(true);
      }
    };

    const handleTrackUnmuted = (pub: TrackPublication) => {
      if (pub.source === Track.Source.Camera) {
        setIsVideoOff(false);
      } else if (pub.source === Track.Source.Microphone) {
        setIsMuted(false);
      }
    };

    localParticipant.localParticipant.on(ParticipantEvent.TrackMuted, handleTrackMuted);
    localParticipant.localParticipant.on(ParticipantEvent.TrackUnmuted, handleTrackUnmuted);

    return () => {
      localParticipant.localParticipant?.off(ParticipantEvent.TrackMuted, handleTrackMuted);
      localParticipant.localParticipant?.off(ParticipantEvent.TrackUnmuted, handleTrackUnmuted);
    };
  }, [localParticipant.localParticipant]);

  // Enable camera/mic on initial connect only
  useEffect(() => {
    if (!room || hasInitialized) return;

    const handleConnected = () => {
      if (permissions.canPublish && localParticipant.localParticipant && !hasInitialized) {
        setHasInitialized(true);
        // Enable camera and mic by default on first join
        localParticipant.localParticipant.setCameraEnabled(true).catch(console.error);
        localParticipant.localParticipant.setMicrophoneEnabled(true).catch(console.error);
      }
    };

    const handleDataReceived = (payload: Uint8Array, participant?: RemoteParticipant) => {
      const decoder = new TextDecoder();
      const message = decoder.decode(payload);
      
      try {
        const data = JSON.parse(message);
        if (data.action === 'muteAll' && !permissions.isHost) {
          localParticipant.localParticipant?.setMicrophoneEnabled(false);
        }
      } catch (e) {
        console.error('Failed to parse data message:', e);
      }
    };

    room.on(RoomEvent.Connected, handleConnected);
    room.on(RoomEvent.DataReceived, handleDataReceived);

    // If already connected and not initialized, enable devices
    if (room.state === 'connected' && !hasInitialized) {
      handleConnected();
    }

    return () => {
      room.off(RoomEvent.Connected, handleConnected);
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room, hasInitialized, permissions, localParticipant]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0a0a0a' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: '#111', borderBottom: '1px solid rgba(22, 163, 74, 0.3)' }}>
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
          <Typography variant="body2" sx={{ mr: 2, color: 'rgba(255,255,255,0.7)' }}>
            {participants.length} participant{participants.length !== 1 ? 's' : ''}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            {new Date().toLocaleTimeString()}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Video Conference with built-in layouts */}
        <Box sx={{ flex: 1, position: 'relative', bgcolor: '#0a0a0a' }}>
          <VideoConference />
        </Box>

        {/* Participants Sidebar */}
        <Drawer
          anchor="right"
          open={showParticipants}
          onClose={() => setShowParticipants(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: 320,
              bgcolor: '#111',
              borderLeft: '1px solid rgba(22, 163, 74, 0.3)',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(22, 163, 74, 0.3)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ color: '#16a34a' }}>
                Participants ({participants.length})
              </Typography>
              <IconButton onClick={() => setShowParticipants(false)} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <List>
            {participants.map((participant) => (
              <ListItem key={participant.sid}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: '#16a34a' }}>
                    {participant.name?.charAt(0) || participant.identity.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography sx={{ color: 'white' }}>
                      {participant.name || participant.identity}
                      {participant.isLocal && ' (You)'}
                      {participant.metadata && JSON.parse(participant.metadata).isHost && ' (Host)'}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      {participant.isMicrophoneEnabled ? (
                        <MicIcon sx={{ fontSize: 16, color: '#16a34a' }} />
                      ) : (
                        <MicOffIcon sx={{ fontSize: 16, color: '#dc2626' }} />
                      )}
                      {participant.isCameraEnabled ? (
                        <VideocamIcon sx={{ fontSize: 16, color: '#16a34a' }} />
                      ) : (
                        <VideocamOffIcon sx={{ fontSize: 16, color: '#dc2626' }} />
                      )}
                    </Box>
                  }
                />
                {permissions.canMuteOthers && !participant.isLocal && (
                  <ListItemSecondaryAction>
                    <Tooltip title="Remove participant">
                      <IconButton size="small" sx={{ color: '#dc2626' }}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
          {permissions.canMuteOthers && (
            <Box sx={{ p: 2, borderTop: '1px solid rgba(22, 163, 74, 0.3)' }}>
              <Typography variant="subtitle2" sx={{ color: '#16a34a', mb: 2 }}>
                Host Controls
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<VolumeOffIcon />}
                onClick={handleMuteAll}
                sx={{ 
                  color: 'white', 
                  borderColor: 'rgba(22, 163, 74, 0.3)',
                  '&:hover': {
                    borderColor: '#16a34a',
                    bgcolor: 'rgba(22, 163, 74, 0.1)',
                  },
                }}
              >
                Mute All
              </Button>
            </Box>
          )}
        </Drawer>

        {/* Chat Sidebar */}
        <Drawer
          anchor="right"
          open={showChat}
          onClose={() => setShowChat(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: 360,
              bgcolor: '#111',
              borderLeft: '1px solid rgba(22, 163, 74, 0.3)',
            },
          }}
        >
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(22, 163, 74, 0.3)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ color: '#16a34a' }}>
                  Chat
                </Typography>
                <IconButton onClick={() => setShowChat(false)} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Chat />
            </Box>
          </Box>
        </Drawer>
      </Box>

      {/* Control Bar */}
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: '#111', 
          borderTop: '1px solid rgba(22, 163, 74, 0.3)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {/* Microphone - Only show if user can publish */}
        {permissions.canPublish && (
          <Tooltip title={isMuted ? "Unmute" : "Mute"}>
            <IconButton
            onClick={toggleMicrophone}
            sx={{
              bgcolor: isMuted ? '#dc2626' : 'rgba(22, 163, 74, 0.2)',
              color: 'white',
              '&:hover': {
                bgcolor: isMuted ? '#b91c1c' : 'rgba(22, 163, 74, 0.3)',
              },
            }}
          >
            {isMuted ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
        </Tooltip>
        )}

        {/* Camera - Only show if user can publish */}
        {permissions.canPublish && (
        <Tooltip title={isVideoOff ? "Turn on camera" : "Turn off camera"}>
          <IconButton
            onClick={toggleCamera}
            sx={{
              bgcolor: isVideoOff ? '#dc2626' : 'rgba(22, 163, 74, 0.2)',
              color: 'white',
              '&:hover': {
                bgcolor: isVideoOff ? '#b91c1c' : 'rgba(22, 163, 74, 0.3)',
              },
            }}
          >
            {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
          </IconButton>
        </Tooltip>
        )}

        {/* Screen Share - Only show if user can share */}
        {permissions.canShare && (
        <Tooltip title={isScreenSharing ? "Stop sharing" : "Share screen"}>
          <IconButton
            onClick={toggleScreenShare}
            sx={{
              bgcolor: isScreenSharing ? '#16a34a' : 'rgba(22, 163, 74, 0.2)',
              color: 'white',
              '&:hover': {
                bgcolor: isScreenSharing ? '#15803d' : 'rgba(22, 163, 74, 0.3)',
              },
            }}
          >
            {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
          </IconButton>
        </Tooltip>
        )}

        {(permissions.canPublish || permissions.canShare) && (
          <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(22, 163, 74, 0.3)' }} />
        )}

        {/* Participants */}
        <Tooltip title="Participants">
          <IconButton
            onClick={() => setShowParticipants(!showParticipants)}
            sx={{
              bgcolor: showParticipants ? '#16a34a' : 'rgba(22, 163, 74, 0.2)',
              color: 'white',
              '&:hover': {
                bgcolor: showParticipants ? '#15803d' : 'rgba(22, 163, 74, 0.3)',
              },
            }}
          >
            <Badge badgeContent={participants.length} color="primary">
              <PeopleIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Chat */}
        <Tooltip title="Chat">
          <IconButton
            onClick={() => setShowChat(!showChat)}
            sx={{
              bgcolor: showChat ? '#16a34a' : 'rgba(22, 163, 74, 0.2)',
              color: 'white',
              '&:hover': {
                bgcolor: showChat ? '#15803d' : 'rgba(22, 163, 74, 0.3)',
              },
            }}
          >
            <ChatIcon />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(22, 163, 74, 0.3)' }} />

        {/* Leave/End Meeting */}
        {permissions.isHost ? (
          <Button
            variant="contained"
            color="error"
            startIcon={<CallEndIcon />}
            onClick={() => setShowEndDialog(true)}
            disabled={ending}
          >
            End Meeting
          </Button>
        ) : (
          <Button
            variant="contained"
            color="error"
            startIcon={<CallEndIcon />}
            onClick={handleLeaveMeeting}
          >
            Leave Meeting
          </Button>
        )}
      </Box>

      {/* End Meeting Dialog */}
      <Dialog open={showEndDialog} onClose={() => setShowEndDialog(false)}>
        <DialogTitle>End Meeting</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to end this meeting? This will disconnect all participants.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEndDialog(false)} disabled={ending}>
            Cancel
          </Button>
          <Button
            onClick={handleEndMeeting}
            color="error"
            variant="contained"
            disabled={ending}
          >
            {ending ? 'Ending...' : 'End Meeting'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}