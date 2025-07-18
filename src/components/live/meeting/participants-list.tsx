'use client';

import React from 'react';
import {
  Box,
  Typography,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Tooltip,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  X,
  Microphone,
  MicrophoneSlash,
  VideoCamera,
  VideoCameraSlash,
  HandPalm,
  Crown,
  UserMinus,
} from '@phosphor-icons/react';
import { Participant, useParticipant } from '@videosdk.live/react-sdk';

interface ParticipantsListProps {
  participants: Participant[];
  raiseHandQueue: Map<string, { participantId: string; participantName: string; timestamp: number }>;
  onClose: () => void;
  onLowerHand: (participantId: string) => void;
  isHost: boolean;
}

export function ParticipantsList({
  participants,
  raiseHandQueue,
  onClose,
  onLowerHand,
  isHost,
}: ParticipantsListProps) {
  const theme = useTheme();

  // Component to handle individual participant controls
  const ParticipantControls = ({ participant }: { participant: Participant }) => {
    const { 
      enableMic, 
      disableMic, 
      enableWebcam, 
      disableWebcam,
      remove
    } = useParticipant(participant.id);

    const handleToggleMic = () => {
      if (participant.micOn) {
        disableMic();
      } else {
        enableMic();
      }
    };

    const handleToggleCamera = () => {
      if (participant.webcamOn) {
        disableWebcam();
      } else {
        enableWebcam();
      }
    };

    const handleRemoveParticipant = () => {
      if (window.confirm(`Remove ${participant.displayName} from the meeting?`)) {
        remove();
      }
    };

    return (
      <Stack direction="row" spacing={0.5}>
        {raiseHandQueue.has(participant.id) && (
          <Tooltip title="Lower hand">
            <IconButton
              size="small"
              onClick={() => onLowerHand(participant.id)}
            >
              <HandPalm size={16} />
            </IconButton>
          </Tooltip>
        )}
        
        <Tooltip title={participant.micOn ? "Mute participant" : "Request unmute (participant must unmute themselves)"}>
          <IconButton
            size="small"
            onClick={handleToggleMic}
            color={participant.micOn ? "default" : "error"}
          >
            {participant.micOn ? <Microphone size={16} /> : <MicrophoneSlash size={16} />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title={participant.webcamOn ? "Turn off camera" : "Request camera on"}>
          <IconButton
            size="small"
            onClick={handleToggleCamera}
            color={participant.webcamOn ? "default" : "error"}
          >
            {participant.webcamOn ? <VideoCamera size={16} /> : <VideoCameraSlash size={16} />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Remove from meeting">
          <IconButton
            size="small"
            color="error"
            onClick={handleRemoveParticipant}
          >
            <UserMinus size={16} />
          </IconButton>
        </Tooltip>
      </Stack>
    );
  };

  // Sort participants: raised hands first, then hosts, then others
  const sortedParticipants = [...participants].sort((a, b) => {
    const aRaisedHand = raiseHandQueue.has(a.id);
    const bRaisedHand = raiseHandQueue.has(b.id);
    const aIsHost = a.mode === 'CONFERENCE';
    const bIsHost = b.mode === 'CONFERENCE';

    if (aRaisedHand && !bRaisedHand) return -1;
    if (!aRaisedHand && bRaisedHand) return 1;
    if (aIsHost && !bIsHost) return -1;
    if (!aIsHost && bIsHost) return 1;
    return 0;
  });

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" fontWeight={600}>
              Participants
            </Typography>
            <Chip label={participants.length} size="small" />
          </Stack>
          <IconButton size="small" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </Stack>
      </Box>

      {/* Participants List */}
      <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
        {sortedParticipants.map((participant) => {
          const hasRaisedHand = raiseHandQueue.has(participant.id);
          const isParticipantHost = participant.mode === 'CONFERENCE';
          
          return (
            <ListItem
              key={participant.id}
              sx={{
                py: 1.5,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: isParticipantHost
                      ? theme.palette.warning.main
                      : theme.palette.primary.main,
                  }}
                >
                  {participant.displayName?.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" fontWeight={500}>
                      {participant.displayName}
                      {participant.isLocal && ' (You)'}
                    </Typography>
                    {isParticipantHost && (
                      <Crown size={16} color={theme.palette.warning.main} weight="fill" />
                    )}
                    {hasRaisedHand && (
                      <Chip
                        icon={<HandPalm size={14} />}
                        label="Hand Raised"
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                }
                secondaryTypographyProps={{ component: 'div' }}
                secondary={
                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                    {participant.micOn ? (
                      <Microphone size={16} color={theme.palette.text.secondary} />
                    ) : (
                      <MicrophoneSlash size={16} color={theme.palette.error.main} />
                    )}
                    {participant.webcamOn ? (
                      <VideoCamera size={16} color={theme.palette.text.secondary} />
                    ) : (
                      <VideoCameraSlash size={16} color={theme.palette.error.main} />
                    )}
                  </Stack>
                }
              />
              
              {isHost && !participant.isLocal && (
                <ListItemSecondaryAction>
                  <ParticipantControls participant={participant} />
                </ListItemSecondaryAction>
              )}
            </ListItem>
          );
        })}
      </List>

      {/* Host Controls */}
      {isHost && raiseHandQueue.size > 0 && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              {raiseHandQueue.size} participant{raiseHandQueue.size > 1 ? 's' : ''} waiting to speak
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}