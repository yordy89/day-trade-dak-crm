'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  useRoomContext,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Box, CircularProgress, Typography, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

interface LiveKitMeetingRoomProps {
  meetingId: string;
  roomName: string;
  userName: string;
  token?: string;
  serverUrl?: string;
  onDisconnect?: () => void;
}

export function LiveKitMeetingRoom({
  meetingId,
  roomName: _roomName,
  userName,
  token: providedToken,
  serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'ws://localhost:7880',
  onDisconnect,
}: LiveKitMeetingRoomProps) {
  const [token, setToken] = useState<string | null>(providedToken || null);
  const [loading, setLoading] = useState(!providedToken);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!providedToken) {
      // Fetch token from API
      const fetchToken = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/livekit/rooms/${meetingId}/token`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
              },
              body: JSON.stringify({
                name: userName,
                identity: localStorage.getItem('userId') || userName,
              }),
            }
          );

          if (!response.ok) {
            throw new Error('Failed to get meeting token');
          }

          const data = await response.json();
          setToken(data.token);
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
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
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
          bgcolor: 'background.default',
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
      video
      audio
      token={token}
      serverUrl={serverUrl}
      connectOptions={{ autoSubscribe: true }}
      onDisconnected={onDisconnect}
      style={{ height: '100vh' }}
    >
      <VideoConference />
      <RoomAudioRenderer />
      <HostControls meetingId={meetingId} token={token} />
    </LiveKitRoom>
  );
}

// Host controls component
function HostControls({ meetingId, token }: { meetingId: string; token: string }) {
  const room = useRoomContext();
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [ending, setEnding] = useState(false);

  // Parse token to check if user is host
  const isHost = useMemo(() => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const metadata = payload.metadata ? JSON.parse(payload.metadata) : {};
      return metadata.isHost === true;
    } catch {
      return false;
    }
  }, [token]);

  const handleEndMeeting = async () => {
    setEnding(true);
    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem('authToken');
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/livekit/rooms/${meetingId}/end`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      // Room will be disconnected automatically by the server
    } catch (error) {
      console.error('Failed to end meeting:', error);
      // Even if API fails, disconnect locally
      room.disconnect();
    }
    setShowEndDialog(false);
  };

  if (!isHost) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={() => setShowEndDialog(true)}
          disabled={ending}
        >
          End Meeting
        </Button>
      </Box>

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
    </>
  );
}