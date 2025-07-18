'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { ArrowLeft } from '@phosphor-icons/react';
import { useClientAuth } from '@/hooks/use-client-auth';
import { videoSDKService } from '@/services/api/videosdk.service';
import dynamic from 'next/dynamic';

// Dynamic imports to avoid SSR issues
const VideoSDKProvider = dynamic(
  () => import('@/components/live/providers/videosdk-provider').then(mod => mod.VideoSDKProvider),
  { ssr: false }
);

const MeetingRoom = dynamic(
  () => import('@/components/live/meeting/meeting-room').then(mod => mod.MeetingRoom),
  { ssr: false }
);

export default function RoomPage() {
  const [isMounted, setIsMounted] = useState(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useClientAuth();
  
  const roomId = params.roomId as string;
  const isHost = searchParams.get('host') === 'true';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [meetingValid, setMeetingValid] = useState(false);
  
  // Ensure component only renders on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const initializeMeeting = async () => {
      if (!user || !roomId) return;

      try {
        // Validate room exists
        const isValid = await videoSDKService.validateRoom(roomId);
        if (!isValid) {
          setError('Meeting room not found');
          setLoading(false);
          return;
        }
        
        setMeetingValid(true);

        // Generate authentication token through backend
        const token = await videoSDKService.generateToken({
          roomId,
          role: isHost ? 'host' : 'participant',
        });
        
        setAuthToken(token);
      } catch (err) {
        console.error('Error initializing meeting:', err);
        setError('Failed to join meeting. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      void initializeMeeting();
    }
  }, [user, roomId, isHost, authLoading]);

  // Don't render VideoSDK components until client-side
  if (!isMounted) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (authLoading || loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !meetingValid) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Unable to Join Meeting
          </Typography>
          <Typography variant="body2">
            {error || 'This meeting room is no longer available.'}
          </Typography>
        </Alert>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.push('/live')}
        >
          Back to Live Sessions
        </Button>
      </Container>
    );
  }

  if (!authToken || !user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="warning">
          Please log in to join this meeting.
        </Alert>
        <Button
          sx={{ mt: 2 }}
          onClick={() => router.push('/auth/sign-in')}
        >
          Sign In
        </Button>
      </Container>
    );
  }

  return (
    <VideoSDKProvider
      meetingId={roomId}
      authToken={authToken}
      participantId={user._id || `participant-${Date.now()}`}
      participantName={`${user.firstName} ${user.lastName}`}
      micEnabled={false}
      webcamEnabled={false}
      isHost={isHost}
    >
      <MeetingRoom />
    </VideoSDKProvider>
  );
}