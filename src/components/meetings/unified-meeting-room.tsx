'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import { useClientAuth } from '@/hooks/use-client-auth';
import { useRouter } from 'next/navigation';
import { useMeetingSocket } from '@/hooks/use-meeting-socket';
import { VideoSDKProvider } from '@/components/live/providers/videosdk-provider';
import { MeetingRoom } from '@/components/live/meeting/meeting-room';
import { LiveKitMeetingRoom } from '@/components/meetings/livekit-room';
import { SignOut, Warning } from '@phosphor-icons/react';

interface UnifiedMeetingRoomProps {
  meeting: {
    _id: string;
    title: string;
    meetingId: string;
    provider?: 'zoom' | 'videosdk' | 'livekit';
    livekitRoomName?: string;
    host: any;
  };
  isHost: boolean;
  userName: string;
  onClose: () => void;
  onError?: (error: string) => void;
}

export function UnifiedMeetingRoom({ 
  meeting, 
  isHost, 
  userName, 
  onClose, 
  onError 
}: UnifiedMeetingRoomProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meetingToken, setMeetingToken] = useState<string | null>(null);
  const [livekitToken, setLivekitToken] = useState<string | null>(null);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [permissionError, setPermissionError] = useState<string>('');
  const { authToken, isLoading: authLoading, user } = useClientAuth();
  const router = useRouter();
  
  console.log('[UnifiedMeetingRoom] Component mounted with meeting:', meeting);

  // Use WebSocket for real-time meeting status updates
  useMeetingSocket({
    meetingId: meeting._id,
    onMeetingEnded: () => {
      console.log('[UnifiedMeetingRoom] WebSocket: Meeting ended event received');
      onClose();
    },
    onMeetingStatusUpdate: (status) => {
      console.log('[UnifiedMeetingRoom] WebSocket: Meeting status updated to:', status);
      if (status === 'completed' || status === 'cancelled') {
        console.log('[UnifiedMeetingRoom] WebSocket: Closing due to status:', status);
        onClose();
      }
    },
  });

  // Validate user permissions
  const validatePermissions = useCallback(async () => {
    if (!authToken) {
      setPermissionError('Please sign in to join meetings');
      setShowPermissionDialog(true);
      return false;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/meetings/${meeting._id}/can-join`,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      if (!response.data.canJoin) {
        setPermissionError(response.data.reason || 'You do not have permission to join this meeting');
        setShowPermissionDialog(true);
        return false;
      }

      return true;
    } catch (err: any) {
      console.error('[UnifiedMeetingRoom] Permission validation failed:', err);
      if (err.response?.status === 404 || err.response?.status === 405) {
        // If endpoint doesn't exist or method not allowed, skip validation
        console.log('[UnifiedMeetingRoom] Can-join endpoint not available, skipping validation');
        return true;
      }
      if (err.response?.status === 401) {
        // Auth error
        setPermissionError('Your session has expired. Please sign in again.');
        setShowPermissionDialog(true);
        return false;
      }
      // For other errors, allow access but log the error
      console.error('[UnifiedMeetingRoom] Permission check error, allowing access:', err.message);
      return true;
    }
  }, [authToken, meeting._id]);

  // Fetch meeting token based on provider
  const fetchMeetingToken = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Validate permissions first
      const hasPermission = await validatePermissions();
      if (!hasPermission) {
        setLoading(false);
        return;
      }

      const provider = meeting.provider || 'videosdk';
      console.log('[UnifiedMeetingRoom] Provider:', provider, 'Meeting:', meeting);

      switch (provider) {
        case 'livekit': {
          // Option to use branded experience - redirect to general meeting page
          const useBrandedExperience = true; // Can be configured based on requirements
          
          if (useBrandedExperience) {
            // Redirect to general meeting page which will route to correct provider
            router.push(`/meeting/${meeting._id}`);
            return;
          }
          
          // Otherwise fetch token for inline experience
          const livekitResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/livekit/rooms/${meeting._id}/token`,
            {
              identity: user?._id || `guest-${Date.now()}`,
              name: userName,
              metadata: JSON.stringify({
                isHost,
                userId: user?._id || null,
              }),
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('[UnifiedMeetingRoom] LiveKit token response:', livekitResponse.data);
          setLivekitToken(livekitResponse.data.token);
          break;
        }

        case 'zoom': {
          // Redirect to general meeting page which will route to Zoom page
          router.push(`/meeting/${meeting._id}`);
          return;
          break;
        }

        case 'videosdk':
        default: {
          // Redirect to general meeting page which will route to correct provider
          router.push(`/meeting/${meeting._id}`);
          return;
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch meeting token:', err);
      setError(err.response?.data?.message || 'Failed to join meeting');
      if (onError) {
        onError(err.response?.data?.message || 'Failed to join meeting');
      }
    } finally {
      setLoading(false);
    }
  }, [authToken, meeting._id, meeting, meeting.provider, userName, user, isHost, onError, validatePermissions]);

  useEffect(() => {
    if (!authLoading && authToken) {
      console.log('[UnifiedMeetingRoom] Starting token fetch, authToken:', Boolean(authToken));
      fetchMeetingToken();
    } else if (!authLoading && !authToken) {
      console.log('[UnifiedMeetingRoom] No auth token available');
      setPermissionError('Please sign in to join meetings');
      setShowPermissionDialog(true);
      setLoading(false);
    } else {
      console.log('[UnifiedMeetingRoom] Still loading auth - authLoading:', authLoading, 'authToken:', Boolean(authToken));
    }
  }, [authToken, authLoading, fetchMeetingToken]);

  // Handle permission dialog actions
  const handleSignIn = () => {
    router.push(`/auth/sign-in?redirect=/live`);
  };

  const handleUpgrade = () => {
    router.push('/academy/subscription/plans?view=monthly');
  };

  if (loading || authLoading) {
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
            Joining meeting...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error && !showPermissionDialog) {
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
          <Button variant="contained" onClick={onClose} fullWidth>
            Back to Meetings
          </Button>
        </Paper>
      </Box>
    );
  }

  // Render meeting room based on provider
  const provider = meeting.provider || 'videosdk';

  if (provider === 'livekit' && livekitToken) {
    return (
      <LiveKitMeetingRoom
        meetingId={meeting._id}
        roomName={meeting.livekitRoomName || meeting._id}
        userName={userName}
        token={livekitToken}
        onDisconnect={onClose}
      />
    );
  }

  if (provider === 'zoom' && zoomUrl) {
    // Open Zoom in a new window/tab
    const zoomWindow = window.open(zoomUrl, '_blank', 'noopener,noreferrer');
    
    // Check if popup was blocked
    if (!zoomWindow) {
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
            <Stack spacing={2} alignItems="center">
              <Typography variant="h6" gutterBottom>
                Zoom Meeting Ready
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Your browser may have blocked the popup. Please click the button below to join the Zoom meeting.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => window.open(zoomUrl, '_blank')}
                fullWidth
              >
                Open Zoom Meeting
              </Button>
              <Button 
                variant="outlined" 
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
    
    // Successfully opened in new window, close this modal
    setTimeout(() => {
      onClose();
    }, 2000);
    
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
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={40} />
            <Typography variant="h6">
              Opening Zoom Meeting...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The meeting is opening in a new window
            </Typography>
          </Stack>
        </Paper>
      </Box>
    );
  }

  if (provider === 'videosdk' && meetingToken) {
    return (
      <VideoSDKProvider 
        meetingId={meeting.meetingId} 
        authToken={meetingToken}
        participantId={user?._id || `participant-${Date.now()}`}
        participantName={userName}
        micEnabled
        webcamEnabled
        isHost={isHost}
      >
        <MeetingRoom onLeave={onClose} />
      </VideoSDKProvider>
    );
  }

  // Permission Dialog or No Token State
  console.log('[UnifiedMeetingRoom] Falling through to end. Provider:', provider, 'Tokens:', {
    meetingToken: Boolean(meetingToken),
    livekitToken: Boolean(livekitToken),
    zoomUrl: Boolean(zoomUrl),
    showPermissionDialog
  });
  
  // If we have no tokens and no permission dialog, show loading or error
  if (!showPermissionDialog) {
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
          <Alert severity="warning" sx={{ mb: 2 }}>
            Unable to join meeting. No valid token received.
          </Alert>
          <Button variant="contained" onClick={onClose} fullWidth>
            Back to Meetings
          </Button>
        </Paper>
      </Box>
    );
  }
  
  return (
    <Dialog
      open={showPermissionDialog}
      onClose={() => {
        setShowPermissionDialog(false);
        onClose();
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Warning size={24} color="orange" />
          <Typography variant="h6">Access Required</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          {permissionError}
        </Typography>
        {!authToken ? (
          <Typography variant="body2" color="text.secondary">
            Please sign in to join live trading sessions.
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Upgrade your subscription to access live trading sessions with our expert traders.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setShowPermissionDialog(false);
          onClose();
        }}>
          Cancel
        </Button>
        {!authToken ? (
          <Button 
            variant="contained" 
            onClick={handleSignIn}
            startIcon={<SignOut />}
          >
            Sign In
          </Button>
        ) : (
          <Button 
            variant="contained" 
            onClick={handleUpgrade}
            color="primary"
          >
            View Plans
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}