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
import { useClientAuth } from '@/hooks/use-client-auth';
import axios from 'axios';

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
  provider: 'zoom' | 'livekit' | 'videosdk';
  livekitRoomName?: string;
  zoomMeetingId?: string;
  meetingId?: string;
  scheduledAt: string;
}

export default function MeetingJoinPage() {
  const params = useParams();
  const router = useRouter();
  const { user, authToken, isLoading: authLoading } = useClientAuth();
  
  const meetingId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meeting, setMeeting] = useState<MeetingDetails | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Handle auth state hydration
  useEffect(() => {
    if (!authLoading) {
      setAuthChecked(true);
    }
  }, [authLoading]);

  // Fetch meeting details and route to appropriate provider
  useEffect(() => {
    const fetchMeetingAndRoute = async () => {
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
        setMeeting(meetingData);
        
        // Route based on provider
        const provider = meetingData.provider || 'videosdk';
        console.log('Meeting provider:', provider, 'Meeting data:', meetingData);
        
        // Add small delay to show loading state
        setTimeout(() => {
          switch (provider) {
            case 'livekit':
              // Route to LiveKit meeting page
              router.push(`/meeting/livekit/${meetingId}`);
              break;
              
            case 'zoom':
              // Route to Zoom meeting page
              router.push(`/meeting/zoom/${meetingId}`);
              break;
              
            case 'videosdk':
            default:
              // Route to VideoSDK meeting page (or handle inline)
              router.push(`/meeting/videosdk/${meetingId}`);
              break;
          }
        }, 500);
        
      } catch (err: any) {
        console.error('Failed to fetch meeting data:', err);
        setError(err.response?.data?.message || 'Failed to load meeting');
        setLoading(false);
      }
    };

    fetchMeetingAndRoute();
  }, [meetingId, authToken, authChecked, router]);

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
            {authLoading ? 'Checking authentication...' : 'Loading meeting...'}
          </Typography>
          {meeting && (
            <Typography variant="body2" color="grey.400">
              Redirecting to {meeting.provider === 'livekit' ? 'LiveKit' : 
                             meeting.provider === 'zoom' ? 'Zoom' : 'VideoSDK'} meeting...
            </Typography>
          )}
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
            <Stack spacing={2}>
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
              {error.includes('sign in') && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => router.push('/login')}
                  sx={{
                    borderColor: '#16a34a',
                    color: '#16a34a',
                    '&:hover': {
                      borderColor: '#15803d',
                      backgroundColor: alpha('#16a34a', 0.1),
                    },
                  }}
                >
                  Sign In
                </Button>
              )}
            </Stack>
          </Paper>
        </Container>
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