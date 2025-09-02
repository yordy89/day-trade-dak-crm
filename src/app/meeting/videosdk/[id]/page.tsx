'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Paper,
  alpha,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useClientAuth } from '@/hooks/use-client-auth';
import axios from 'axios';
import { VideoSDKProvider } from '@/components/live/providers/videosdk-provider';
import { MeetingRoom } from '@/components/live/meeting/meeting-room';

interface MeetingDetails {
  _id: string;
  title: string;
  description?: string;
  host: {
    firstName: string;
    lastName: string;
    email: string;
    _id?: string;
  };
  status: string;
  provider: string;
  meetingId: string;
  scheduledAt: string;
}

export default function VideoSDKMeetingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, authToken, isLoading: authLoading } = useClientAuth();
  
  const meetingId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meeting, setMeeting] = useState<MeetingDetails | null>(null);
  const [meetingToken, setMeetingToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isHost, setIsHost] = useState(false);

  // Handle auth state hydration
  useEffect(() => {
    if (!authLoading) {
      setAuthChecked(true);
    }
  }, [authLoading]);

  // Fetch meeting details and token
  useEffect(() => {
    const fetchMeetingData = async () => {
      // Wait for auth to be checked
      if (!authChecked) return;
      
      setLoading(true);
      setError(null);
      
      // Get auth token from various sources
      let actualAuthToken = authToken;
      if (!actualAuthToken) {
        // Try to get from localStorage directly
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          try {
            const authData = JSON.parse(authStorage);
            actualAuthToken = authData.state?.authToken;
          } catch (e) {
            console.error('Failed to parse auth storage:', e);
          }
        }
        
        // Also try the old format
        if (!actualAuthToken) {
          actualAuthToken = localStorage.getItem('custom-auth-token');
        }
      }
      
      if (!actualAuthToken) {
        setError('Please sign in to join the meeting');
        setLoading(false);
        return;
      }

      try {
        // Fetch meeting details
        const meetingResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/meetings/${meetingId}`,
          {
            headers: { Authorization: `Bearer ${actualAuthToken}` }
          }
        );

        const meetingData = meetingResponse.data;
        
        // Check if it's a VideoSDK meeting
        if (meetingData.provider && meetingData.provider !== 'videosdk') {
          // Redirect to the appropriate provider page
          console.log('Meeting is not VideoSDK, redirecting to:', meetingData.provider);
          router.push(`/meeting/${meetingId}`);
          return;
        }
        
        setMeeting(meetingData);
        
        // Get user data if not available from hook
        let actualUser = user;
        if (!actualUser) {
          const authStorage = localStorage.getItem('auth-storage');
          if (authStorage) {
            try {
              const authData = JSON.parse(authStorage);
              actualUser = authData.state?.user;
            } catch (e) {
              console.error('Failed to parse user from auth storage:', e);
            }
          }
        }
        
        // Check if user is host
        const userIsHost = meetingData.host._id === actualUser?._id || 
                           meetingData.host === actualUser?._id;
        setIsHost(userIsHost);
        
        // Fetch VideoSDK token
        const tokenResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/meetings/${meetingId}/token`,
          {
            headers: { Authorization: `Bearer ${actualAuthToken}` }
          }
        );
        
        setMeetingToken(tokenResponse.data.token);
        setLoading(false);
      } catch (err: any) {
        console.error('Failed to fetch meeting data:', err);
        setError(err.response?.data?.message || 'Failed to load meeting');
        setLoading(false);
      }
    };

    fetchMeetingData();
  }, [meetingId, authToken, user, authChecked, router]);

  const handleLeaveMeeting = () => {
    router.push('/live');
  };

  // Show loading screen while checking auth or fetching data
  if (loading || authLoading || !authChecked) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
        }}
      >
        <Stack spacing={3} alignItems="center">
          <CircularProgress size={60} sx={{ color: '#16a34a' }} />
          <Typography variant="h6" color="white">
            {authLoading ? 'Checking authentication...' : 'Loading VideoSDK meeting...'}
          </Typography>
        </Stack>
      </Box>
    );
  }

  // Show error
  if (error) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
        }}
      >
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, backgroundColor: alpha('#ffffff', 0.05) }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              fullWidth
              onClick={() => router.push('/live')}
              sx={{
                backgroundColor: '#16a34a',
                '&:hover': {
                  backgroundColor: '#15803d',
                },
              }}
            >
              Return to Live Sessions
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  // VideoSDK meeting room
  if (meeting && meetingToken) {
    return (
      <Box sx={{ height: '100vh', backgroundColor: '#0a0a0a', position: 'relative' }}>
        {/* Back button overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 1000,
          }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={handleLeaveMeeting}
            sx={{
              color: 'white',
              backgroundColor: alpha('#000000', 0.5),
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: alpha('#000000', 0.7),
              },
            }}
          >
            Leave Meeting
          </Button>
        </Box>

        {/* VideoSDK Meeting Room */}
        <VideoSDKProvider
          meetingId={meeting.meetingId}
          authToken={meetingToken}
          participantId={user?._id || `guest-${Date.now()}`}
          participantName={user ? `${user.firstName} ${user.lastName}` : 'Guest'}
          micEnabled={true}
          webcamEnabled={true}
          isHost={isHost}
        >
          <MeetingRoom
            onLeave={handleLeaveMeeting}
          />
        </VideoSDKProvider>
      </Box>
    );
  }

  // Default loading fallback
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
      }}
    >
      <CircularProgress size={60} sx={{ color: '#16a34a' }} />
    </Box>
  );
}