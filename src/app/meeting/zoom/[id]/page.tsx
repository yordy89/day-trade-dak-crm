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
  Avatar,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  ArrowBack,
  Videocam,
  Launch,
  ContentCopy,
  Info,
  Schedule,
  Person,
} from '@mui/icons-material';
import { useClientAuth } from '@/hooks/use-client-auth';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

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
  roomUrl: string; // The complete Zoom URL with password
  zoomMeetingId?: string;
  zoomJoinUrl?: string;
  zoomStartUrl?: string; // Host URL with start privileges
  zoomPassword?: string;
  meetingId?: string;
  scheduledAt: string;
  duration?: number;
}

export default function ZoomMeetingPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const { user, authToken, isLoading: authLoading } = useClientAuth();
  
  const meetingId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meeting, setMeeting] = useState<MeetingDetails | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [joinUrl, setJoinUrl] = useState<string | null>(null);
  const [extractedMeetingId, setExtractedMeetingId] = useState<string | null>(null);
  const [extractedPasscode, setExtractedPasscode] = useState<string | null>(null);

  // Handle auth state hydration
  useEffect(() => {
    if (!authLoading) {
      setAuthChecked(true);
    }
  }, [authLoading]);

  // Fetch meeting details
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
        
        // Validate meeting data
        if (!meetingData || typeof meetingData !== 'object') {
          console.error('Invalid meeting data received:', meetingData);
          setError('Invalid meeting data received');
          setLoading(false);
          return;
        }
        
        console.log('Zoom meeting data:', {
          roomUrl: meetingData.roomUrl,
          zoomJoinUrl: meetingData.zoomJoinUrl,
          zoomStartUrl: meetingData.zoomStartUrl,
          zoomMeetingId: meetingData.zoomMeetingId,
          zoomPassword: meetingData.zoomPassword,
          provider: meetingData.provider
        });
        
        // Verify it's a Zoom meeting
        if (meetingData.provider !== 'zoom') {
          // Redirect to appropriate provider
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
        const hostId = typeof meetingData.host === 'object' && meetingData.host?._id 
          ? meetingData.host._id 
          : meetingData.host;
        const userIsHost = hostId && actualUser?._id && (hostId === actualUser._id || hostId.toString() === actualUser._id.toString());
        setIsHost(userIsHost);
        
        // Get Zoom join URL - use roomUrl for everyone but add role parameter for host
        if (meetingData.roomUrl && typeof meetingData.roomUrl === 'string') {
          // Use the room URL which has the password included
          let finalUrl = meetingData.roomUrl;
          
          // For hosts, add the role=1 parameter to get host privileges without sign-in
          if (userIsHost) {
            try {
              const url = new URL(meetingData.roomUrl);
              // Add role=1 for host privileges
              url.searchParams.set('role', '1');
              finalUrl = url.toString();
              console.log('Using host URL with role=1:', finalUrl);
            } catch (e) {
              console.log('Could not modify URL for host role:', e);
              finalUrl = meetingData.roomUrl;
            }
          } else {
            console.log('Using participant join URL:', meetingData.roomUrl);
          }
          
          setJoinUrl(finalUrl);
          
          // Extract meeting ID and passcode from the URL for display
          try {
            const url = new URL(meetingData.roomUrl);
            const pathMatch = url.pathname.match(/\/j\/(\d+)/);
            if (pathMatch) {
              setExtractedMeetingId(pathMatch[1]);
            }
            const pwdParam = url.searchParams.get('pwd');
            if (pwdParam) {
              setExtractedPasscode(pwdParam);
            }
          } catch (e) {
            console.log('Could not parse Zoom URL:', e);
          }
        } else if (meetingData.zoomJoinUrl && typeof meetingData.zoomJoinUrl === 'string') {
          // Fallback to zoomJoinUrl if available
          let finalUrl = meetingData.zoomJoinUrl;
          if (userIsHost) {
            try {
              const url = new URL(meetingData.zoomJoinUrl);
              url.searchParams.set('role', '1');
              finalUrl = url.toString();
            } catch (e) {
              console.log('Could not modify URL for host role:', e);
            }
          }
          setJoinUrl(finalUrl);
        } else if (meetingData.zoomMeetingId && typeof meetingData.zoomMeetingId === 'string') {
          // Last fallback: construct URL from meeting ID and password
          const baseUrl = 'https://zoom.us/j/';
          let url = baseUrl + meetingData.zoomMeetingId;
          if (meetingData.zoomPassword && typeof meetingData.zoomPassword === 'string') {
            url += '?pwd=' + meetingData.zoomPassword;
          }
          // Add role=1 for host
          if (userIsHost) {
            url += (meetingData.zoomPassword ? '&' : '?') + 'role=1';
          }
          setJoinUrl(url);
          setExtractedMeetingId(meetingData.zoomMeetingId);
          setExtractedPasscode(meetingData.zoomPassword || null);
        } else {
          // No valid URL found
          console.error('No valid Zoom URL found in meeting data:', meetingData);
          setError('Meeting URL not available. Please contact support.');
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('Failed to fetch meeting data:', err);
        setError(err.response?.data?.message || 'Failed to load meeting');
        setLoading(false);
      }
    };

    fetchMeetingData();
  }, [meetingId, authToken, user, authChecked, router]);

  const handleJoinMeeting = async () => {
    if (!joinUrl) {
      toast.error('Meeting URL not available');
      return;
    }
    
    // If host, update meeting status to 'live'
    if (isHost && meeting) {
      try {
        const actualAuthToken = authToken || localStorage.getItem('custom-auth-token');
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/meetings/${meetingId}/status`,
          { status: 'live' },
          {
            headers: {
              Authorization: `Bearer ${actualAuthToken}`,
            },
          }
        );
        console.log('Meeting status updated to live');
      } catch (err) {
        console.error('Failed to update meeting status:', err);
        // Continue anyway - don't block joining
      }
    }
    
    // Open Zoom meeting in new tab
    window.open(joinUrl, '_blank');
    
    // Show success message
    toast.success('Opening Zoom meeting...');
  };

  const handleCopyMeetingId = () => {
    const meetingId = meeting?.zoomMeetingId || extractedMeetingId;
    if (meetingId) {
      navigator.clipboard.writeText(meetingId);
      toast.success('Meeting ID copied to clipboard');
    }
  };

  const handleCopyPasscode = () => {
    const passcode = meeting?.zoomPassword || extractedPasscode;
    if (passcode) {
      navigator.clipboard.writeText(passcode);
      toast.success('Passcode copied to clipboard');
    }
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
            {authLoading ? 'Checking authentication...' : 'Loading Zoom meeting...'}
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

  // Zoom meeting details page
  if (meeting) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #0f1f0f 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={24}
            sx={{
              p: 4,
              backgroundColor: alpha('#000000', 0.8),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha('#16a34a', 0.2)}`,
            }}
          >
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2} mb={4}>
              <IconButton
                onClick={() => router.push('/live')}
                sx={{ color: '#16a34a' }}
              >
                <ArrowBack />
              </IconButton>
              <Box flex={1}>
                <Typography variant="h4" fontWeight={700} color="white">
                  {meeting.title}
                </Typography>
                {meeting.description && (
                  <Typography variant="body2" color="grey.400" mt={0.5}>
                    {meeting.description}
                  </Typography>
                )}
              </Box>
              <Stack direction="row" spacing={1}>
                <Chip
                  label="ZOOM MEETING"
                  size="small"
                  sx={{
                    backgroundColor: alpha('#2563eb', 0.2),
                    color: '#3b82f6',
                    fontWeight: 600,
                  }}
                />
                {isHost && (
                  <Chip
                    label="HOST"
                    size="small"
                    sx={{
                      backgroundColor: alpha('#dc2626', 0.2),
                      color: '#dc2626',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Stack>
            </Stack>

            {/* Meeting Info Cards */}
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ backgroundColor: alpha('#000000', 0.5) }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ backgroundColor: '#16a34a' }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="grey.400">
                            Hosted by
                          </Typography>
                          <Typography variant="body1" color="white" fontWeight={600}>
                            {meeting.host.firstName} {meeting.host.lastName}
                          </Typography>
                        </Box>
                      </Stack>
                      
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ backgroundColor: alpha('#16a34a', 0.2) }}>
                          <Schedule />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="grey.400">
                            Scheduled for
                          </Typography>
                          <Typography variant="body1" color="white">
                            {format(new Date(meeting.scheduledAt), 'PPp')}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ backgroundColor: alpha('#000000', 0.5) }}>
                  <CardContent>
                    <Typography variant="h6" color="white" mb={2}>
                      Meeting Details
                    </Typography>
                    <Stack spacing={2}>
                      {(meeting.zoomMeetingId || extractedMeetingId) && (
                        <Box>
                          <Typography variant="body2" color="grey.400" mb={0.5}>
                            Meeting ID
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body1" color="white" fontFamily="monospace">
                              {meeting.zoomMeetingId || extractedMeetingId}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={handleCopyMeetingId}
                              sx={{ color: '#16a34a' }}
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Box>
                      )}
                      
                      {/* Only show passcode to hosts */}
                      {isHost && (meeting.zoomPassword || extractedPasscode) && (
                        <Box>
                          <Typography variant="body2" color="grey.400" mb={0.5}>
                            Passcode
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body1" color="white" fontFamily="monospace">
                              {meeting.zoomPassword || extractedPasscode}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={handleCopyPasscode}
                              sx={{ color: '#16a34a' }}
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Info Alert */}
            <Alert 
              severity={isHost ? "warning" : "info"}
              icon={<Info />}
              sx={{ 
                mb: 3,
                backgroundColor: isHost 
                  ? alpha('#f59e0b', 0.1)
                  : alpha('#3b82f6', 0.1),
                color: 'white',
                '& .MuiAlert-icon': {
                  color: isHost ? '#f59e0b' : '#3b82f6',
                },
              }}
            >
              <Typography variant="body2">
                {isHost ? (
                  <>
                    <strong>As the host, you'll start this meeting.</strong> This will open Zoom in a new tab 
                    with host privileges. You can manage participants, recording, and meeting settings.
                  </>
                ) : (
                  <>
                    This will open the Zoom meeting in a new tab. Make sure you have the Zoom client installed 
                    or use the web version if prompted.
                  </>
                )}
              </Typography>
            </Alert>

            {/* Join/Start Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleJoinMeeting}
              startIcon={<Launch />}
              disabled={!joinUrl}
              sx={{
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                background: isHost 
                  ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                  : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                '&:hover': {
                  background: isHost
                    ? 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)'
                    : 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                },
              }}
            >
              {isHost ? 'Start Zoom Meeting (Host)' : 'Join Zoom Meeting'}
            </Button>

            <Typography variant="caption" color="grey.500" display="block" textAlign="center" mt={2}>
              Powered by Zoom Communications
            </Typography>
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