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
} from '@mui/material';
import {
  ArrowBack,
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  ScreenShare,
  StopScreenShare,
  ExitToApp,
} from '@mui/icons-material';
import { useClientAuth } from '@/hooks/use-client-auth';
import axios from 'axios';
import dynamic from 'next/dynamic';

// Dynamic import LiveKit components to avoid SSR issues
const LiveKitRoom = dynamic(
  () => import('@livekit/components-react').then(mod => mod.LiveKitRoom),
  { ssr: false }
);

const VideoConference = dynamic(
  () => import('@livekit/components-react').then(mod => mod.VideoConference),
  { ssr: false }
);

const RoomAudioRenderer = dynamic(
  () => import('@livekit/components-react').then(mod => mod.RoomAudioRenderer),
  { ssr: false }
);

const EnhancedLiveKitRoom = dynamic(
  () => import('@/components/meetings/enhanced-livekit-room').then(mod => mod.EnhancedLiveKitRoom),
  { ssr: false }
);

const SimpleLiveKitRoom = dynamic(
  () => import('@/components/meetings/simple-livekit-room').then(mod => mod.SimpleLiveKitRoom),
  { ssr: false }
);

const ProfessionalLiveKitRoom = dynamic(
  () => import('@/components/meetings/professional-livekit-room').then(mod => mod.ProfessionalLiveKitRoom),
  { ssr: false }
);

// Import LiveKit styles
import '@livekit/components-styles';

interface MeetingDetails {
  _id: string;
  title: string;
  description?: string;
  host: {
    firstName: string;
    lastName: string;
    email: string;
  };
  status: string;
  provider: string;
  livekitRoomName?: string;
  scheduledAt: string;
}

export default function LiveKitMeetingPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const { user, authToken, isLoading: authLoading } = useClientAuth();
  
  const meetingId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meeting, setMeeting] = useState<MeetingDetails | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [preJoinView, setPreJoinView] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

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
      
      // Also check localStorage as fallback
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
        
        setIsHost(meetingData.host._id === actualUser?._id);

        // Check if it's a LiveKit meeting
        if (meetingData.provider !== 'livekit') {
          setError('This meeting is not a LiveKit meeting');
          return;
        }

        // Fetch LiveKit token
        const tokenResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/livekit/rooms/${meetingId}/token`,
          {
            identity: actualUser?._id || `guest-${Date.now()}`,
            name: actualUser ? `${actualUser.firstName} ${actualUser.lastName}` : 'Guest',
            metadata: JSON.stringify({
              isHost: meetingData.host._id === actualUser?._id,
              userId: actualUser?._id || null,
            }),
          },
          {
            headers: {
              Authorization: `Bearer ${actualAuthToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setToken(tokenResponse.data.token);
      } catch (err: any) {
        console.error('Failed to fetch meeting data:', err);
        setError(err.response?.data?.message || 'Failed to load meeting');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingData();
  }, [meetingId, authToken, user, authChecked]);

  const handleJoinMeeting = () => {
    setPreJoinView(false);
  };

  const handleLeaveMeeting = () => {
    router.push('/live');
  };

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
        </Stack>
      </Box>
    );
  }

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

  // Pre-join view with branding
  if (preJoinView && meeting && token) {
    return (
      <Box
        sx={{
          height: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #0f1f0f 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
              <Chip
                label="LIVE MEETING"
                size="small"
                sx={{
                  backgroundColor: alpha('#16a34a', 0.2),
                  color: '#16a34a',
                  fontWeight: 600,
                }}
              />
            </Stack>

            {/* Meeting Info */}
            <Stack spacing={3} mb={4}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ backgroundColor: '#16a34a' }}>
                  {meeting.host.firstName[0]}
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

              {/* Pre-join controls */}
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: alpha('#000000', 0.5),
                  border: `1px solid ${alpha('#16a34a', 0.1)}`,
                }}
              >
                <Typography variant="h6" color="white" mb={2}>
                  Setup your devices
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant={cameraEnabled ? 'contained' : 'outlined'}
                    startIcon={cameraEnabled ? <Videocam /> : <VideocamOff />}
                    onClick={() => setCameraEnabled(!cameraEnabled)}
                    sx={{
                      backgroundColor: cameraEnabled ? '#16a34a' : 'transparent',
                      borderColor: '#16a34a',
                      color: cameraEnabled ? 'white' : '#16a34a',
                      '&:hover': {
                        backgroundColor: cameraEnabled ? '#15803d' : alpha('#16a34a', 0.1),
                      },
                    }}
                  >
                    Camera
                  </Button>
                  <Button
                    variant={micEnabled ? 'contained' : 'outlined'}
                    startIcon={micEnabled ? <Mic /> : <MicOff />}
                    onClick={() => setMicEnabled(!micEnabled)}
                    sx={{
                      backgroundColor: micEnabled ? '#16a34a' : 'transparent',
                      borderColor: '#16a34a',
                      color: micEnabled ? 'white' : '#16a34a',
                      '&:hover': {
                        backgroundColor: micEnabled ? '#15803d' : alpha('#16a34a', 0.1),
                      },
                    }}
                  >
                    Microphone
                  </Button>
                </Stack>
              </Paper>
            </Stack>

            {/* Join Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleJoinMeeting}
              startIcon={<Videocam />}
              sx={{
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                },
              }}
            >
              Join Meeting
            </Button>

            <Typography variant="caption" color="grey.500" display="block" textAlign="center" mt={2}>
              Powered by DayTradeDak Self-Hosted Infrastructure
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Main meeting room
  if (meeting && token && !preJoinView) {
    // Use professional LiveKit room component with custom controls
    return (
      <ProfessionalLiveKitRoom
        meetingId={meeting._id}
        roomName={meeting.title}
        userName={user ? `${user.firstName} ${user.lastName}` : 'Guest'}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://live.daytradedak.com'}
        onDisconnect={handleLeaveMeeting}
      />
    );
    
    // Old rendering code - kept for reference
    const oldRender = (
      <Box sx={{ height: '100vh', backgroundColor: '#0a0a0a' }}>
        <style jsx global>{`
          /* Custom LiveKit Theme for DayTradeDak */
          .lk-room {
            --lk-brand-color: #16a34a !important;
            --lk-brand-color-hover: #15803d !important;
            --lk-background: #0a0a0a !important;
            --lk-background-2: #0f1f0f !important;
            --lk-foreground: #ffffff !important;
            --lk-border-color: rgba(22, 163, 74, 0.2) !important;
            --lk-button-bg: #16a34a !important;
            --lk-button-bg-hover: #15803d !important;
            --lk-control-bg: rgba(0, 0, 0, 0.8) !important;
            --lk-control-bg-hover: rgba(22, 163, 74, 0.2) !important;
            --lk-danger: #dc2626 !important;
            --lk-danger-hover: #b91c1c !important;
          }

          /* Participant tiles */
          .lk-participant-tile {
            border: 1px solid rgba(22, 163, 74, 0.2) !important;
            background: #0a0a0a !important;
          }

          .lk-participant-tile.lk-participant-tile-speaking {
            border-color: #16a34a !important;
            box-shadow: 0 0 20px rgba(22, 163, 74, 0.3) !important;
          }

          /* Control bar */
          .lk-control-bar {
            background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent) !important;
            padding: 1rem !important;
          }

          .lk-button {
            transition: all 0.2s ease !important;
          }

          .lk-button:hover {
            transform: scale(1.05) !important;
          }

          /* Chat */
          .lk-chat {
            background: rgba(0, 0, 0, 0.8) !important;
            border-left: 1px solid rgba(22, 163, 74, 0.2) !important;
          }

          .lk-chat-entry {
            background: rgba(22, 163, 74, 0.1) !important;
            border: 1px solid rgba(22, 163, 74, 0.2) !important;
            margin: 0.5rem !important;
            border-radius: 8px !important;
          }

          /* Participant name */
          .lk-participant-name {
            background: rgba(0, 0, 0, 0.8) !important;
            padding: 0.25rem 0.75rem !important;
            border-radius: 4px !important;
            font-weight: 600 !important;
          }
        `}</style>

        <LiveKitRoom
          video={cameraEnabled}
          audio={micEnabled}
          token={token || undefined}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://live.daytradedak.com'}
          connectOptions={{ autoSubscribe: true }}
          onDisconnected={handleLeaveMeeting}
          style={{ height: '100%' }}
          data-e2ee={false}
        >
          <VideoConference />
          <RoomAudioRenderer />
          
          {/* Custom branding overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <img
              src="/logo-white.png"
              alt="DayTradeDak"
              style={{ height: 32, width: 'auto' }}
            />
            <Chip
              label={isHost ? 'HOST' : 'PARTICIPANT'}
              size="small"
              sx={{
                backgroundColor: isHost ? '#dc2626' : '#16a34a',
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Box>
        </LiveKitRoom>
      </Box>
    );
  }

  return null;
}