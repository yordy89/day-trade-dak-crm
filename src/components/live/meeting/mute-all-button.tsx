'use client';

import React, { useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { SpeakerSlash } from '@phosphor-icons/react';
import { useParticipant } from '@videosdk.live/react-sdk';
import { alpha, useTheme } from '@mui/material/styles';

interface MuteAllButtonProps {
  participants: any[];
  isHost: boolean;
  allMuted: boolean;
  onMuteStateChange: (muted: boolean) => void;
}

// Individual participant mute handler
function ParticipantMuter({ participant, shouldMute }: { participant: any; shouldMute: boolean }) {
  const { disableMic } = useParticipant(participant.id);
  
  useEffect(() => {
    if (shouldMute && participant.micOn && !participant.isLocal) {
      disableMic();
    }
  }, [shouldMute, participant.micOn, participant.isLocal, participant.displayName, disableMic]);
  
  return null;
}

export function MuteAllButton({ participants, isHost, allMuted, onMuteStateChange }: MuteAllButtonProps) {
  const theme = useTheme();
  
  if (!isHost) return null;
  
  const handleClick = () => {
    const newMuteState = !allMuted;
    onMuteStateChange(newMuteState);
  };
  
  return (
    <>
      {/* Render individual muters when mute all is active */}
      {allMuted ? participants.map((participant) => (
        <ParticipantMuter 
          key={participant.id} 
          participant={participant} 
          shouldMute={allMuted}
        />
      )) : null}
      
      <Tooltip title={allMuted ? "Allow all to unmute" : "Mute all participants"}>
        <IconButton
          onClick={handleClick}
          color={allMuted ? 'error' : 'default'}
          sx={{
            bgcolor: allMuted ? alpha(theme.palette.error.main, 0.1) : 'background.paper',
          }}
        >
          <SpeakerSlash size={24} />
        </IconButton>
      </Tooltip>
    </>
  );
}