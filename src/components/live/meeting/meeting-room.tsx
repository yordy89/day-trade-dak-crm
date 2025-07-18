'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  IconButton,
  Button,
  Typography,
  Paper,
  Tooltip,
  Badge,
  Chip,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  Microphone,
  MicrophoneSlash,
  VideoCamera,
  VideoCameraSlash,
  Desktop,
  PhoneX,
  Record,
  Stop,
  Chat,
  Users,
  HandPalm,
  X,
  ArrowsOut,
  ArrowsIn,
} from '@phosphor-icons/react';
import { useMeeting, usePubSub } from '@videosdk.live/react-sdk';
import { useVideoSDK } from '../providers/videosdk-provider';
import { ParticipantView } from './participant-view';
import { ChatPanel } from './chat-panel';
import { ParticipantsList } from './participants-list';
import { MuteAllButton } from './mute-all-button';
import { useRouter } from 'next/navigation';
import { DynamicLogo } from '@/components/core/logo';

interface MeetingRoomProps {
  onLeave?: () => void;
}

export function MeetingRoom({ onLeave }: MeetingRoomProps) {
  const theme = useTheme();
  const router = useRouter();
  const { isHost, participantId: localParticipantId, userName } = useVideoSDK();
  
  const {
    join,
    leave,
    toggleMic,
    toggleWebcam,
    toggleScreenShare,
    startRecording,
    stopRecording,
    participants,
    presenterId,
    localMicOn,
    localWebcamOn,
    recordingState,
    // meetingState,
    localParticipant: sdkLocalParticipant,
  } = useMeeting({
    onMeetingJoined: () => {
      // Meeting joined
    },
    onMeetingLeft: () => {
      // Meeting left
    },
  });

  const [joined, setJoined] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [raiseHandQueue, setRaiseHandQueue] = useState<Map<string, { participantId: string; participantName: string; timestamp: number }>>(new Map());
  const [screenSharing, setScreenSharing] = useState(false);
  const [recording, setRecording] = useState(false);
  const [showRaiseHandQueue, setShowRaiseHandQueue] = useState(false);
  const [allMuted, setAllMuted] = useState(false);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mainStageRef = React.useRef<HTMLDivElement>(null);

  // Convert participants Map to array first
  const participantsArray = Array.from(participants.values());
  const participantCount = participantsArray.length;
  const raiseHandCount = raiseHandQueue.size;
  const localParticipant = sdkLocalParticipant || participantsArray.find(p => p.local);
  const hasRaisedHand = localParticipantId ? raiseHandQueue.has(localParticipantId) : false;


  // PubSub for raise hand functionality
  const { publish: publishRaiseHand } = usePubSub('RAISE_HAND', {
  });
  
  // Subscribe to raise hand messages
  usePubSub('RAISE_HAND', {
    onMessageReceived: (data) => {
      
      // VideoSDK sends data in a specific format
      const senderId = data.senderId;
      const message = data.message;
      const timestamp = data.timestamp;
      
      // Parse the message if it's a string
      try {
        const parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
        const { participantId, participantName, action } = parsedMessage;
        
        if (action === 'RAISE') {
          setRaiseHandQueue(prev => {
            const newQueue = new Map(prev);
            newQueue.set(participantId || senderId, {
              participantId: participantId || senderId,
              participantName: participantName || 'Unknown',
              timestamp: typeof timestamp === 'number' ? timestamp : Date.now()
            });
            return newQueue;
          });
        } else if (action === 'LOWER') {
          setRaiseHandQueue(prev => {
            const newQueue = new Map(prev);
            newQueue.delete(participantId || senderId);
            return newQueue;
          });
        }
      } catch (error) {
        // Fallback: treat any message as a raise hand toggle
        const participant = participantsArray.find(p => p.id === senderId);
        if (participant) {
          setRaiseHandQueue(prev => {
            const newQueue = new Map(prev);
            if (newQueue.has(senderId)) {
              newQueue.delete(senderId);
            } else {
              newQueue.set(senderId, {
                participantId: senderId,
                participantName: participant.displayName || 'Unknown',
                timestamp: typeof timestamp === 'number' ? timestamp : Date.now()
              });
            }
            return newQueue;
          });
        }
      }
    },
  });


  // Join meeting on mount
  useEffect(() => {
    if (!joined) {
      join();
      setJoined(true);
    }
  }, [join, joined]);

  // Handle recording state
  useEffect(() => {
    setRecording(recordingState === 'RECORDING_STARTED');
  }, [recordingState]);

  // Handle screen share state
  useEffect(() => {
    setScreenSharing(Boolean(presenterId));
  }, [presenterId]);

  const handleToggleMic = () => {
    toggleMic();
  };

  const handleToggleWebcam = () => {
    toggleWebcam();
  };

  const handleToggleScreenShare = async () => {
    if (!isHost) return;
    
    try {
      toggleScreenShare();
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  const handleToggleRecording = async () => {
    if (!isHost) return;
    
    try {
      if (recording) {
        stopRecording();
      } else {
        startRecording(`${process.env.NEXT_PUBLIC_API_URL}/api/videosdk/recording-webhook`);
      }
    } catch (error) {
      console.error('Error toggling recording:', error);
    }
  };

  const handleLeaveMeeting = () => {
    leave();
    if (onLeave) {
      onLeave();
    } else {
      router.push('/live');
    }
  };

  const handleRaiseHand = () => {
    if (!joined) {
      return;
    }
    
    if (localParticipantId && userName) {
      const currentlyRaised = raiseHandQueue.has(localParticipantId);
      
      const message = {
        participantId: localParticipantId,
        participantName: userName,
        action: currentlyRaised ? 'LOWER' : 'RAISE'
      };
      
      // Send as JSON string
      publishRaiseHand(JSON.stringify(message), { persist: true });
    }
  };

  const handleLowerHand = (participantId: string) => {
    const participant = raiseHandQueue.get(participantId);
    if (participant) {
      const message = {
        participantId,
        participantName: participant.participantName,
        action: 'LOWER'
      };
      publishRaiseHand(JSON.stringify(message), { persist: true });
    }
  };

  const handleToggleFullscreen = async () => {
    if (!mainStageRef.current) return;

    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        await mainStageRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);


  // Active speaker detection
  useEffect(() => {
    // Set initial active speaker when no screen share
    if (!presenterId && participantsArray.length > 0) {
      if (isHost && localParticipant) {
        // If current user is host, show them
        setActiveSpeakerId(localParticipant.id);
      } else if (localParticipant) {
        setActiveSpeakerId(localParticipant.id);
      }
    } else if (presenterId) {
      // Clear active speaker when screen sharing
      setActiveSpeakerId(null);
    }
  }, [presenterId, participantsArray.length, localParticipant?.id, isHost]);


  // Update raise hand timer every second
  useEffect(() => {
    if (raiseHandCount > 0) {
      const interval = setInterval(() => {
        // Force re-render to update timer
        setRaiseHandQueue(new Map(raiseHandQueue));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [raiseHandCount, raiseHandQueue]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          px: 3,
          py: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <DynamicLogo height={40} width={40} />
            <Typography variant="h6" fontWeight={600}>
              Live Trading Session
            </Typography>
            {recording ? <Chip
                label="RECORDING"
                color="error"
                size="small"
                icon={<Record size={16} weight="fill" />}
                sx={{
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                    '100%': { opacity: 1 },
                  },
                }}
              /> : null}
          </Stack>
          
          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip
              icon={<Users size={16} />}
              label={participantCount}
              size="small"
              onClick={() => setShowParticipants(!showParticipants)}
              clickable
            />
            {isHost && raiseHandCount > 0 ? <Chip
                icon={<HandPalm size={16} />}
                label={raiseHandCount}
                size="small"
                color="warning"
                onClick={() => setShowRaiseHandQueue(!showRaiseHandQueue)}
                clickable
              /> : null}
          </Stack>
        </Stack>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Video Grid */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            gap: 2,
          }}
        >
          {/* Main Stage (Screen Share or Active Speaker) */}
          <Box
            ref={mainStageRef}
            sx={{
              flex: 1,
              bgcolor: 'background.paper',
              borderRadius: isFullscreen ? 0 : 2,
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {presenterId ? (
              <Box sx={{ width: '100%', height: '100%' }}>
                <ParticipantView participantId={presenterId} isPresenter />
              </Box>
            ) : activeSpeakerId ? (
              <Box sx={{ width: '100%', height: '100%' }}>
                <ParticipantView participantId={activeSpeakerId} isMainStage />
              </Box>
            ) : localParticipant ? (
              <Box sx={{ width: '100%', height: '100%' }}>
                <ParticipantView participantId={localParticipant.id} isMainStage />
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <Desktop size={64} color={theme.palette.text.secondary} />
                <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                  {isHost ? 'Share your screen to start presenting' : 'Waiting for presenter to share screen'}
                </Typography>
              </Box>
            )}
            
            {/* Fullscreen button */}
            <Tooltip title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
              <IconButton
                onClick={handleToggleFullscreen}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                  },
                }}
              >
                {isFullscreen ? <ArrowsIn size={24} /> : <ArrowsOut size={24} />}
              </IconButton>
            </Tooltip>
          </Box>

          {/* Participant Thumbnails */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              height: 150,
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: 'background.paper',
                borderRadius: 1,
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'divider',
                borderRadius: 1,
              },
            }}
          >
            {participantsArray.map((participant) => (
              <Box
                key={participant.id}
                sx={{
                  width: 200,
                  height: '100%',
                  flexShrink: 0,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <ParticipantView participantId={participant.id} />
              </Box>
            ))}
          </Stack>
        </Box>


        {/* Raise Hand Queue Panel for Host */}
        {isHost && showRaiseHandQueue && raiseHandCount > 0 ? <Paper
            sx={{
              position: 'absolute',
              top: 80,
              right: 20,
              width: 300,
              maxHeight: 400,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10,
              boxShadow: 3,
            }}
          >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" fontSize={16} fontWeight={600}>
                  Raise Hand Queue ({raiseHandCount})
                </Typography>
                <IconButton size="small" onClick={() => setShowRaiseHandQueue(false)}>
                  <X size={20} />
                </IconButton>
              </Stack>
            </Box>
            <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
              {Array.from(raiseHandQueue.entries())
                .sort((a, b) => a[1].timestamp - b[1].timestamp)
                .map(([participantId, data]) => {
                  const waitTime = Math.floor((Date.now() - data.timestamp) / 1000);
                  const minutes = Math.floor(waitTime / 60);
                  const seconds = waitTime % 60;
                  
                  return (
                    <ListItem key={participantId}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                          <HandPalm size={20} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={data.participantName}
                        secondary={`Waiting ${minutes}:${seconds.toString().padStart(2, '0')}`}
                      />
                      <ListItemSecondaryAction>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleLowerHand(participantId)}
                        >
                          Allow to Speak
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
            </List>
          </Paper> : null}

        {/* Side Panels */}
        {(showChat || showParticipants) ? <Box
            sx={{
              width: 320,
              display: 'flex',
              flexDirection: 'column',
              borderLeft: 1,
              borderColor: 'divider',
            }}
          >
            {showParticipants ? <ParticipantsList
                participants={participantsArray}
                raiseHandQueue={raiseHandQueue}
                onClose={() => setShowParticipants(false)}
                onLowerHand={handleLowerHand}
                isHost={isHost}
              /> : null}
            {showChat && !showParticipants && !showRaiseHandQueue ? <ChatPanel onClose={() => setShowChat(false)} /> : null}
            {showRaiseHandQueue && isHost && !showParticipants ? <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" fontWeight={600}>
                      Raise Hand Queue
                    </Typography>
                    <IconButton size="small" onClick={() => setShowRaiseHandQueue(false)}>
                      <X size={20} />
                    </IconButton>
                  </Stack>
                </Box>
                <List sx={{ flex: 1, overflowY: 'auto' }}>
                  {Array.from(raiseHandQueue.values())
                    .sort((a, b) => a.timestamp - b.timestamp)
                    .map((item) => (
                      <ListItem key={item.participantId}>
                        <ListItemText
                          primary={item.participantName}
                          secondary={`Waiting ${Math.floor((Date.now() - item.timestamp) / 1000)}s`}
                        />
                        <ListItemSecondaryAction>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleLowerHand(item.participantId)}
                          >
                            Allow to Speak
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                </List>
              </Box> : null}
          </Box> : null}
      </Box>

      {/* Control Bar */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
          {/* Media Controls */}
          <Tooltip title={allMuted && !isHost ? 'Muted by host' : (localMicOn ? 'Mute' : 'Unmute')}>
            <IconButton
              onClick={handleToggleMic}
              disabled={allMuted && !isHost ? localMicOn : false}
              color={localMicOn ? 'default' : 'error'}
              sx={{
                bgcolor: localMicOn ? 'background.paper' : alpha(theme.palette.error.main, 0.1),
              }}
            >
              {localMicOn ? <Microphone size={24} /> : <MicrophoneSlash size={24} />}
            </IconButton>
          </Tooltip>

          <Tooltip title={localWebcamOn ? 'Turn off camera' : 'Turn on camera'}>
            <IconButton
              onClick={handleToggleWebcam}
              color={localWebcamOn ? 'default' : 'error'}
              sx={{
                bgcolor: localWebcamOn ? 'background.paper' : alpha(theme.palette.error.main, 0.1),
              }}
            >
              {localWebcamOn ? <VideoCamera size={24} /> : <VideoCameraSlash size={24} />}
            </IconButton>
          </Tooltip>

          {isHost ? <>
              <Tooltip title={screenSharing ? 'Stop sharing' : 'Share screen'}>
                <IconButton
                  onClick={handleToggleScreenShare}
                  color={screenSharing ? 'primary' : 'default'}
                  sx={{
                    bgcolor: screenSharing ? alpha(theme.palette.primary.main, 0.1) : 'background.paper',
                  }}
                >
                  <Desktop size={24} />
                </IconButton>
              </Tooltip>

              <Tooltip title={recording ? 'Stop recording' : 'Start recording'}>
                <IconButton
                  onClick={handleToggleRecording}
                  color={recording ? 'error' : 'default'}
                  sx={{
                    bgcolor: recording ? alpha(theme.palette.error.main, 0.1) : 'background.paper',
                  }}
                >
                  {recording ? <Stop size={24} weight="fill" /> : <Record size={24} />}
                </IconButton>
              </Tooltip>

              <MuteAllButton
                participants={participantsArray}
                isHost={isHost}
                allMuted={allMuted}
                onMuteStateChange={setAllMuted}
              />
            </> : null}

          {/* Leave Button */}
          <Box sx={{ mx: 2 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<PhoneX size={20} />}
              onClick={handleLeaveMeeting}
            >
              Leave
            </Button>
          </Box>

          {/* Right Controls */}
          <Tooltip title="Chat">
            <IconButton
              onClick={() => {
                setShowChat(!showChat);
                setShowParticipants(false);
              }}
              color={showChat ? 'primary' : 'default'}
            >
              <Badge badgeContent={0} color="error">
                <Chat size={24} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Participants">
            <IconButton
              onClick={() => {
                setShowParticipants(!showParticipants);
                setShowChat(false);
              }}
              color={showParticipants ? 'primary' : 'default'}
            >
              <Badge badgeContent={raiseHandCount} color="warning">
                <Users size={24} />
              </Badge>
            </IconButton>
          </Tooltip>

          {!isHost && (
            <Tooltip title={hasRaisedHand ? "Lower hand" : "Raise hand"}>
              <IconButton
                onClick={handleRaiseHand}
                color={hasRaisedHand ? "warning" : "default"}
                sx={{
                  bgcolor: hasRaisedHand ? alpha(theme.palette.warning.main, 0.1) : 'background.paper',
                }}
              >
                <HandPalm size={24} weight={hasRaisedHand ? "fill" : "regular"} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Paper>

      {/* Raise Hand Queue Dialog (Host Only) */}
      {isHost ? <Dialog
          open={showRaiseHandQueue}
          onClose={() => setShowRaiseHandQueue(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Raised Hands Queue</Typography>
              <IconButton
                size="small"
                onClick={() => setShowRaiseHandQueue(false)}
                sx={{ color: 'text.secondary' }}
              >
                <X size={20} />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent>
            {raiseHandCount === 0 ? (
              <Typography color="text.secondary" align="center" py={3}>
                No participants have raised their hands
              </Typography>
            ) : (
              <List>
                {Array.from(raiseHandQueue.entries()).map(([participantId, data]) => {
                  const elapsedTime = Math.floor((Date.now() - data.timestamp) / 1000);
                  const minutes = Math.floor(elapsedTime / 60);
                  const seconds = elapsedTime % 60;
                  
                  return (
                    <ListItem
                      key={participantId}
                      secondaryAction={
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => handleLowerHand(participantId)}
                        >
                          Lower Hand
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          <HandPalm size={20} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={data.participantName}
                        secondary={`Waiting for ${minutes}:${seconds.toString().padStart(2, '0')}`}
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </DialogContent>
        </Dialog> : null}
    </Box>
  );
}