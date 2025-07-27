'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useClientAuth } from '@/hooks/use-client-auth';
import { useRouter } from 'next/navigation';
import { useMeetingSocket } from '@/hooks/use-meeting-socket';
import { VideoSDKProvider } from '@/components/live/providers/videosdk-provider';
import { MeetingRoom } from '@/components/live/meeting/meeting-room';

interface VideoMeetingRoomProps {
  meetingId: string;
  roomId: string;
  isHost: boolean;
  userName: string;
  onClose: () => void;
}

export function VideoMeetingRoom({ meetingId, roomId, userName, isHost, onClose }: VideoMeetingRoomProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meetingToken, setMeetingToken] = useState<string | null>(null);
  const [useZoom, setUseZoom] = useState(false);
  const { authToken, isLoading: authLoading, user } = useClientAuth();
  const router = useRouter();

  // Use WebSocket for real-time meeting status updates
  useMeetingSocket({
    meetingId,
    onMeetingEnded: () => {
      window.location.href = '/live';
    },
    onMeetingStatusUpdate: (status) => {
      if (status === 'completed') {
        window.location.href = '/live';
      }
    },
  });

  // Fetch meeting token from backend
  useEffect(() => {
    const fetchMeetingToken = async () => {
      if (authLoading) return;

      if (!authToken) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const tokenString = String(authToken).trim();
        
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/meetings/${meetingId}/token`,
          {
            headers: {
              Authorization: `Bearer ${tokenString}`,
            },
          }
        );
        
        const { token, useZoom: isZoom, zoomUrl: url } = response.data;
        
        if (isZoom && url) {
          // If using Zoom, redirect to Zoom URL
          setUseZoom(true);
          setLoading(false);
          
          // Open Zoom in new window
          window.open(url, '_blank', 'noopener,noreferrer');
          
          // Close the modal after a short delay
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          // Use VideoSDK as before
          setMeetingToken(token);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Failed to fetch meeting token:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
        } else {
          setError(err.response?.data?.message || 'Failed to join meeting');
        }
        setLoading(false);
      }
    };

    void fetchMeetingToken();
  }, [meetingId, authToken, authLoading, onClose]);

  const handleLeaveMeeting = async () => {
    try {
      // Call API to update meeting status
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/meetings/${meetingId}/leave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    } catch (err) {
      console.error('Failed to update meeting status:', err);
    }
    
    // Redirect to live page
    window.location.href = '/live';
  };

  if (loading) {
    return (
      <Box 
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={60} />
          <Typography variant="h6" color="white">
            {useZoom ? 'Opening Zoom...' : 'Joining meeting...'}
          </Typography>
          {useZoom ? <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
              If Zoom doesn&apos;t open automatically, check your popup blocker
            </Typography> : null}
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <Paper sx={{ p: 4, maxWidth: 400 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Stack spacing={2}>
            {error?.includes('log in') ? (
              <Button 
                variant="contained" 
                onClick={() => router.push('/auth/sign-in')} 
                fullWidth
              >
                Go to Login
              </Button>
            ) : null}
            <Button 
              variant={error?.includes('log in') ? "outlined" : "contained"} 
              onClick={onClose} 
              fullWidth
            >
              Close
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  // Don't render VideoSDK components if using Zoom
  if (useZoom || (!meetingToken || !user)) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: '#000',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <VideoSDKProvider
        meetingId={roomId || meetingId}
        authToken={meetingToken}
        participantId={user._id || `participant-${Date.now()}`}
        participantName={userName}
        micEnabled
        webcamEnabled
        isHost={isHost}
      >
        <MeetingRoom onLeave={handleLeaveMeeting} />
      </VideoSDKProvider>
    </Box>
  );
}