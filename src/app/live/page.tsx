'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
  Tooltip,
  Chip,
  Skeleton,
  useMediaQuery,
  Paper,
  Divider,
  AvatarGroup,
  Avatar,
  Alert,
  AlertTitle,
  CircularProgress,
} from '@mui/material';
import {
  VideoCamera,
  Clock,
  Users,
  Calendar,
  Warning,
  Lock,
  CheckCircle,
  Star,
  Envelope,
  Desktop,
  Television,
  SignIn,
  Crown,
  Timer,
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { features } from '@/config/features';
import { useTranslation } from 'react-i18next';
import { MeetingsDisabled } from '@/components/meetings/meetings-disabled';
import { useClientAuth } from '@/hooks/use-client-auth';
import { useStableWebSocket } from '@/hooks/use-stable-websocket';
import { useModuleAccess } from '@/hooks/use-module-access';
import { ModuleType } from '@/types/module-permission';
import { formatDistanceToNow, isAfter, isBefore, addMinutes } from 'date-fns';
import { MainNavbar } from '@/components/landing/main-navbar';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const UnifiedMeetingRoom = dynamic(
  () => import('@/components/meetings/unified-meeting-room').then(mod => mod.UnifiedMeetingRoom),
  { 
    ssr: false,
    loading: () => (
      <Box sx={{ 
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
      }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={60} />
          <Typography variant="h6" color="white">Loading meeting room...</Typography>
        </Stack>
      </Box>
    ),
  }
);

interface LiveMeetingsResponse {
  hasAccess: boolean;
  user: {
    hasLiveSubscription: boolean;
    hasLiveWeeklyModuleAccess: boolean;
    allowLiveMeetingAccess: boolean;
    role: string;
  };
  dailyLiveMeeting?: ScheduledSession;
  otherMeetings: ScheduledSession[];
  supportInfo: {
    email: string;
    phone: string;
    whatsapp: string;
  };
}

interface PublicLiveMeetingsResponse {
  dailyLiveMeeting?: ScheduledSession;
  otherMeetings: ScheduledSession[];
}

interface ScheduledSession {
  _id: string;
  title: string;
  description?: string;
  meetingId: string;
  roomUrl: string;
  scheduledAt: string;
  duration: number;
  host: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  participants: any[];
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  provider?: 'zoom' | 'videosdk' | 'livekit';
  livekitRoomName?: string;
  isRecurring: boolean;
  maxParticipants: number;
  enableRecording: boolean;
  enableChat: boolean;
  enableScreenShare: boolean;
  meetingType: string;
  attendees?: any[];
  whiteboardEnabled?: boolean;
}

export default function LivePage() {
  const theme = useTheme();
  const router = useRouter();
  const { user, authToken, isLoading: authLoading } = useClientAuth();
  const { t: _t } = useTranslation();
  const { hasAccess: hasModuleAccess, loading: _moduleLoading } = useModuleAccess(ModuleType.LiveWeekly);
  
  const [liveMeetingsData, setLiveMeetingsData] = useState<LiveMeetingsResponse | null>(null);
  const [publicMeetingsData, setPublicMeetingsData] = useState<PublicLiveMeetingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [timeUntilStart, setTimeUntilStart] = useState<string>('');
  const [activeMeeting, setActiveMeeting] = useState<(ScheduledSession & { isHost: boolean }) | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<ScheduledSession | null>(null);
  const [_previousLiveMeetings, _setPreviousLiveMeetings] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<any>(null);
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const fetchMeetingsRef = useRef<any>(null);
  
  // Set up stable WebSocket connection for real-time updates
  const { socket, connected: _connected, on, off } = useStableWebSocket({
    namespace: '/meetings',
    onConnect: () => {
      console.log('Connected to meetings WebSocket');
      setIsConnected(true);
    },
    onDisconnect: () => {
      console.log('Disconnected from meetings WebSocket');
      setIsConnected(false);
    },
  });
  
  // Media query hook
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      void Notification.requestPermission();
    }
  }, []);

  // Fetch meetings from API with authentication fallback
  const fetchMeetings = useCallback(async () => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      console.log('[DEBUG] Skipping fetch - already fetching');
      return;
    }
    
    // Debounce - don't fetch more than once every 2 seconds
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 2000) {
      console.log('[DEBUG] Skipping fetch - too soon since last fetch');
      return;
    }
    
    lastFetchTimeRef.current = now;
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Try authenticated endpoint first if user is logged in
      if (authToken && !authLoading) {
        try {
          const meetingsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/meetings/live-meetings`, {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          });
          setLiveMeetingsData(meetingsResponse.data);
          setTokenExpired(false);
          
          // Track live meetings and show notifications for new ones
          const currentLiveMeetings = [
            ...(meetingsResponse.data.dailyLiveMeeting?.status === 'live' ? [meetingsResponse.data.dailyLiveMeeting._id] : []),
            ...(meetingsResponse.data.otherMeetings?.filter((m: any) => m.status === 'live').map((m: any) => m._id) || [])
          ];
          
          // Check for new live meetings
          _setPreviousLiveMeetings(prev => {
            const newLiveMeetings = currentLiveMeetings.filter(id => !prev.includes(id));
            if (newLiveMeetings.length > 0 && prev.length > 0) {
              // Find the meeting details
              const allMeetings = [
                ...(meetingsResponse.data.dailyLiveMeeting ? [meetingsResponse.data.dailyLiveMeeting] : []),
                ...(meetingsResponse.data.otherMeetings || [])
              ];
              
              newLiveMeetings.forEach(meetingId => {
                const meeting = allMeetings.find((m: any) => m._id === meetingId);
                if (meeting && 'Notification' in window && Notification.permission === 'granted') {
                  const notification = new Notification('Live Meeting Started!', {
                    body: `${meeting.title} is now live. Join now!`,
                    icon: '/favicon.ico',
                    tag: meetingId, // Prevent duplicate notifications
                  });
                  // Clean up notification after 5 seconds
                  setTimeout(() => notification.close(), 5000);
                }
              });
            }
            return currentLiveMeetings;
          });
          
        } catch (err: any) {
          if (err.response?.status === 401) {
            // Token expired
            setTokenExpired(true);
            // Fall back to public endpoint
            throw err;
          } else {
            throw err;
          }
        }
      }

      // Always fetch public meetings as fallback or for non-authenticated users  
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/meetings/public/live-meetings`);
      setPublicMeetingsData(response.data);

    } catch (err: any) {
      console.error('Failed to fetch meetings:', err);
      setError(err.response?.data?.message || 'Failed to load meetings');
      // Still try to get public meetings even if authenticated request fails
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/meetings/public/live-meetings`);
        setPublicMeetingsData(response.data);
      } catch (publicErr) {
        console.error('Failed to fetch public meetings:', publicErr);
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [authToken, authLoading]); // Remove previousLiveMeetings from dependencies

  // Compute hasAccess based on all available data
  const hasAccess = liveMeetingsData?.hasAccess || hasModuleAccess || false;

  // Select appropriate meeting on data change
  useEffect(() => {
    const allMeetings = liveMeetingsData 
      ? [...(liveMeetingsData.dailyLiveMeeting ? [liveMeetingsData.dailyLiveMeeting] : []), ...(liveMeetingsData.otherMeetings || [])]
      : publicMeetingsData 
        ? [...(publicMeetingsData.dailyLiveMeeting ? [publicMeetingsData.dailyLiveMeeting] : []), ...(publicMeetingsData.otherMeetings || [])]
        : [];
    
    if (!selectedMeeting && allMeetings.length > 0) {
      // Auto-select first meeting or live meeting
      const liveMeeting = allMeetings.find(m => m.status === 'live');
      
      // First priority: Select a live meeting if any
      if (liveMeeting) {
        setSelectedMeeting(liveMeeting);
      } else if (allMeetings.length > 0) {
        // Second priority: First available meeting
        setSelectedMeeting(allMeetings[0]);
      }
    }
    
    // Update selectedMeeting if its status has changed
    if (selectedMeeting) {
      const updatedMeeting = allMeetings.find(m => m._id === selectedMeeting._id);
      if (updatedMeeting && updatedMeeting.status !== selectedMeeting.status) {
        // Only update if status actually changed
        setSelectedMeeting(updatedMeeting);
      } else if (!updatedMeeting && allMeetings.length > 0) {
        // Meeting no longer exists, select another one
        setSelectedMeeting(allMeetings[0]);
      }
    }
  }, [liveMeetingsData, publicMeetingsData]); // Remove selectedMeeting from dependencies

  // Update fetchMeetingsRef when fetchMeetings changes
  useEffect(() => {
    fetchMeetingsRef.current = fetchMeetings;
  }, [fetchMeetings]);

  // WebSocket event handlers
  useEffect(() => {
    socketRef.current = socket;

    // Listen for live meeting updates
    on('live-meeting-update', (data: any) => {
      console.log('[WEBSOCKET] Live meeting update received:', data);
      // Refetch meetings when there's an update
      void fetchMeetingsRef.current();
    });
    
    // Listen for meeting started events
    on('meeting-started', (data: { meetingId: string; title: string; host: any }) => {
      console.log('[WEBSOCKET] Meeting started:', data);
      
      // Show notification if not the host
      const hostId = typeof data.host === 'string' ? data.host : data.host._id;
      if (user && user._id !== hostId) {
        if ('Notification' in window && Notification.permission === 'granted') {
          const notification = new Notification('Meeting Started!', {
            body: `${data.title} is now live. Click to join!`,
            icon: '/favicon.ico',
            tag: data.meetingId,
          });
          
          notification.onclick = () => {
            // Find the meeting and join
            const meeting = [...(liveMeetingsData?.otherMeetings || []), liveMeetingsData?.dailyLiveMeeting].find(
              m => m && m._id === data.meetingId
            );
            if (meeting) {
              handleJoinSession(meeting);
            }
            notification.close();
          };
        }
      }
      
      // Refetch to update UI
      void fetchMeetingsRef.current();
    });

    on('meeting-status-updated', (data: { meetingId: string; status: string }) => {
      console.log('[WEBSOCKET] Meeting status updated:', data);
      
      // Update the specific meeting status in state without refetching
      if (data.status === 'completed' || data.status === 'cancelled') {
        // Update authenticated data
        setLiveMeetingsData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            dailyLiveMeeting: prev.dailyLiveMeeting?._id === data.meetingId 
              ? { ...prev.dailyLiveMeeting, status: data.status as 'scheduled' | 'live' | 'completed' | 'cancelled' }
              : prev.dailyLiveMeeting,
            otherMeetings: prev.otherMeetings.map(m => 
              m._id === data.meetingId ? { ...m, status: data.status as 'scheduled' | 'live' | 'completed' | 'cancelled' } : m
            )
          };
        });
        
        // Update public data
        setPublicMeetingsData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            dailyLiveMeeting: prev.dailyLiveMeeting?._id === data.meetingId 
              ? { ...prev.dailyLiveMeeting, status: data.status as 'scheduled' | 'live' | 'completed' | 'cancelled' }
              : prev.dailyLiveMeeting,
            otherMeetings: prev.otherMeetings.map(m => 
              m._id === data.meetingId ? { ...m, status: data.status as 'scheduled' | 'live' | 'completed' | 'cancelled' } : m
            )
          };
        });
        
        // Update selected meeting if it matches (check inside setState to avoid closure issues)
        setSelectedMeeting(prev => {
          if (prev && prev._id === data.meetingId) {
            console.log('[DEBUG] Updating selected meeting status via meeting-status-updated. ID:', prev._id, 'New status:', data.status);
            return { ...prev, status: data.status as any };
          }
          return prev;
        });
      } else {
        // For other status changes, refetch to get latest data
        void fetchMeetingsRef.current();
      }
    });
    
    // Listen for meeting ended event
    on('meeting-ended', (data: { meetingId: string; timestamp: Date }) => {
      console.log('[WEBSOCKET] Meeting ended event received:', data);
      
      // Update UI to show meeting has ended
      setLiveMeetingsData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          dailyLiveMeeting: prev.dailyLiveMeeting?._id === data.meetingId 
            ? { ...prev.dailyLiveMeeting, status: 'completed' }
            : prev.dailyLiveMeeting,
          otherMeetings: prev.otherMeetings.map(m => 
            m._id === data.meetingId ? { ...m, status: 'completed' } : m
          )
        };
      });
      
      setPublicMeetingsData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          dailyLiveMeeting: prev.dailyLiveMeeting?._id === data.meetingId 
            ? { ...prev.dailyLiveMeeting, status: 'completed' }
            : prev.dailyLiveMeeting,
          otherMeetings: prev.otherMeetings.map(m => 
            m._id === data.meetingId ? { ...m, status: 'completed' } : m
          )
        };
      });
      
      // Update selected meeting (check inside setState to avoid closure issues)
      setSelectedMeeting(prev => {
        if (prev && prev._id === data.meetingId) {
          console.log('[DEBUG] Updating selected meeting to completed. ID:', prev._id);
          console.log('[DEBUG] Previous status:', prev.status);
          const updated = { ...prev, status: 'completed' as any };
          console.log('[DEBUG] New status:', updated.status);
          return updated;
        }
        return prev;
      });
      
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('Meeting Ended', {
          body: 'The live trading session has ended.',
          icon: '/favicon.ico',
        });
        // Clean up notification after 5 seconds
        setTimeout(() => notification.close(), 5000);
      }
    });

    return () => {
      // Clean up event listeners
      off('live-meeting-update');
      off('meeting-status-updated');
      off('meeting-ended');
    };
  }, [on, off]); // Remove fetchMeetings from dependencies

  // Initial fetch - only run once when component mounts or auth changes significantly
  useEffect(() => {
    // Skip if we're still loading auth
    if (authLoading) return;
    
    void fetchMeetings();
  }, [authToken, authLoading]); // Use specific dependencies instead of fetchMeetings


  // Update countdown timer for selected meeting
  useEffect(() => {
    if (!selectedMeeting) return;

    const updateTimer = () => {
      const meetingTime = new Date(selectedMeeting.scheduledAt);
      const now = new Date();
      
      if (isBefore(now, meetingTime)) {
        setTimeUntilStart(formatDistanceToNow(meetingTime, { includeSeconds: true }));
      } else {
        setTimeUntilStart('');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [selectedMeeting]);

  const handleJoinSession = async (session: ScheduledSession) => {
    // Basic access check - detailed validation will happen in UnifiedMeetingRoom
    if (!user) {
      setError('Please log in to join meetings');
      return;
    }

    // Set active meeting for all providers
    const hostId = typeof session.host === 'string' ? session.host : session.host._id;
    console.log('[Live Page] Joining meeting:', session);
    setActiveMeeting({
      ...session,
      isHost: user?._id === hostId,
    });
  };

  const handleStartMeeting = async (session: ScheduledSession) => {
    if (!authToken) {
      setError('Please log in to start a meeting');
      return;
    }

    try {
      // Call API to start the meeting
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/admin/meetings/${session._id}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      
      // Update the session with live status
      const liveSession = { ...session, status: 'live' as const };
      
      // Immediately update the local state
      if (selectedMeeting?._id === session._id) {
        setSelectedMeeting(liveSession);
      }
      
      // Notify all users via WebSocket that meeting has started
      if (socket) {
        socket.emit('meeting-started', {
          meetingId: session._id,
          title: session.title,
          host: session.host,
        });
      }
      
      // Automatically join the meeting as host
      console.log('[Live Page] Starting meeting - setting active meeting:', liveSession);
      setActiveMeeting({
        ...liveSession,
        isHost: true, // Host is always true when starting
      });
      
    } catch (err: any) {
      console.error('Failed to start meeting:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Failed to start meeting');
      }
    }
  };
  const getSessionStatus = (session: ScheduledSession) => {
    // Always respect the actual status from the database first
    if (session.status === 'live') return 'live';
    if (session.status === 'completed') return 'ended';
    if (session.status === 'cancelled') return 'cancelled';
    
    const now = new Date();
    const startTime = new Date(session.scheduledAt);
    const endTime = addMinutes(startTime, session.duration);
    
    if (isAfter(now, endTime)) return 'ended';
    if (isAfter(now, startTime) && isBefore(now, endTime)) return 'should_be_live';
    if (isBefore(now, startTime)) return 'upcoming';
    
    return 'scheduled';
  };
  const renderMeetingButton = (session: ScheduledSession, isPrimary = false) => {
    const status = getSessionStatus(session);
    const hostId = typeof session.host === 'string' ? session.host : session.host._id;
    const isHost = user?._id === hostId;
    
    // Show Start button for hosts on scheduled meetings
    if (isHost && hasAccess && (status === 'scheduled' || status === 'upcoming' || status === 'should_be_live')) {
      return (
        <Button
          fullWidth={!isPrimary}
          variant="contained"
          color="primary"
          size={isPrimary ? "large" : "medium"}
          startIcon={<VideoCamera size={isPrimary ? 24 : 20} weight="fill" />}
          onClick={() => handleStartMeeting(session)}
          sx={{
            fontWeight: 600,
          }}
        >
          Start Meeting
        </Button>
      );
    }
    
    switch (status) {
      case 'live':
        // For guest users or users without access
        if (!user || !hasAccess) {
          return (
            <Button
              fullWidth={!isPrimary}
              variant="contained"
              color="primary"
              size={isPrimary ? "large" : "medium"}
              startIcon={<SignIn size={isPrimary ? 24 : 20} />}
              onClick={() => router.push('/auth/sign-in')}
              sx={{
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.7)}` },
                  '70%': { boxShadow: `0 0 0 10px ${alpha(theme.palette.primary.main, 0)}` },
                  '100%': { boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0)}` },
                },
              }}
            >
              {!user ? 'Sign In to Join' : 'Upgrade to Join'}
            </Button>
          );
        }
        
        // For authorized users
        return (
          <Button
            fullWidth={!isPrimary}
            variant="contained"
            color="error"
            size={isPrimary ? "large" : "medium"}
            startIcon={<VideoCamera size={isPrimary ? 24 : 20} weight="fill" />}
            onClick={() => handleJoinSession(session)}
            sx={{
              fontWeight: 600,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { boxShadow: `0 0 0 0 ${alpha(theme.palette.error.main, 0.7)}` },
                '70%': { boxShadow: `0 0 0 10px ${alpha(theme.palette.error.main, 0)}` },
                '100%': { boxShadow: `0 0 0 0 ${alpha(theme.palette.error.main, 0)}` },
              },
            }}
          >
            Join Live Now
          </Button>
        );
      case 'should_be_live':
        return (
          <Chip
            label="Starting Soon..."
            color="warning"
            icon={<Clock size={16} />}
            size={isPrimary ? "medium" : "small"}
          />
        );
      case 'upcoming':
        return (
          <Button
            fullWidth={!isPrimary}
            variant="outlined"
            size={isPrimary ? "large" : "medium"}
            startIcon={<Clock size={isPrimary ? 20 : 16} />}
            disabled
          >
            {timeUntilStart ? `Starts in ${timeUntilStart}` : 'Starting Soon'}
          </Button>
        );
      case 'ended':
        return (
          <Button
            fullWidth={!isPrimary}
            variant="outlined"
            size={isPrimary ? "large" : "medium"}
            disabled
          >
            Session Ended
          </Button>
        );
      default:
        return null;
    }
  };
  // Mobile session card
  const renderMobileSessionCard = (session: ScheduledSession) => {
    const status = getSessionStatus(session);
    const hostId = typeof session.host === 'string' ? session.host : session.host._id;
    const hostName = typeof session.host === 'string' ? 'Host' : `${session.host.firstName} ${session.host.lastName}`;
    const isHost = user?._id === hostId;
    const isSelected = selectedMeeting?._id === session._id;
    
    return (
      <Card 
        key={session._id} 
        onClick={() => setSelectedMeeting(session)}
        sx={{ 
          cursor: 'pointer',
          transition: 'all 0.2s',
          border: isSelected ? `2px solid ${theme.palette.primary.main}` : '1px solid',
          borderColor: isSelected ? 'primary.main' : 'divider',
          ...(isSelected && {
            boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
          }),
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Box flex={1}>
              <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                {status === 'live' && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'error.main',
                      animation: 'pulse 2s infinite',
                    }}
                  />
                )}
                <Typography variant="subtitle1" fontWeight={600} noWrap>
                  {session.title}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Host: {hostName}
              </Typography>
            </Box>
            {isHost && <Chip label="Host" size="small" color="primary" icon={<Crown size={14} />} />}
          </Stack>
          
          <Stack direction="row" gap={1} mb={2} flexWrap="wrap">
            <Chip 
              size="small" 
              icon={<Calendar size={14} />} 
              label={new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            />
            <Chip 
              size="small" 
              icon={<Clock size={14} />} 
              label={`${session.duration} min`}
            />
            {session.isRecurring && <Chip size="small" label="Recurring" variant="outlined" />}
          </Stack>
          
          {renderMeetingButton(session)}
        </CardContent>
      </Card>
    );
  };
  
  // Debug logging
  useEffect(() => {
    if (selectedMeeting) {
      console.log('[DEBUG] Selected meeting status:', selectedMeeting.status, selectedMeeting._id);
    }
  }, [selectedMeeting]);
  
  // Check if meetings feature is disabled - AFTER all hooks
  if (!features.meetings.enabled) {
    return (
      <>
        <MainNavbar />
        <MeetingsDisabled />
      </>
    );
  }
  
  // Render active meeting room
  if (activeMeeting) {
    return (
      <UnifiedMeetingRoom
        meeting={activeMeeting}
        isHost={activeMeeting.isHost}
        userName={user ? `${user.firstName} ${user.lastName}` : 'Guest'}
        onClose={() => {
          setActiveMeeting(null);
          void fetchMeetings(); // Refresh meetings after leaving
        }}
        onError={(errorMessage) => {
          setError(errorMessage);
          setActiveMeeting(null);
        }}
      />
    );
  }
  
  // Get all meetings in a unified array
  let allMeetings: ScheduledSession[] = [];
  if (liveMeetingsData) {
    allMeetings = [
      ...(liveMeetingsData.dailyLiveMeeting ? [liveMeetingsData.dailyLiveMeeting] : []),
      ...(liveMeetingsData.otherMeetings || [])
    ];
  } else if (publicMeetingsData) {
    allMeetings = [
      ...(publicMeetingsData.dailyLiveMeeting ? [publicMeetingsData.dailyLiveMeeting] : []),
      ...(publicMeetingsData.otherMeetings || [])
    ];
  }
  
  const currentMeeting = selectedMeeting;

  return (
    <>
      <MainNavbar />
      <Container 
        maxWidth="xl" 
        sx={{ 
          mt: { xs: 9, md: 11 }, 
          mb: 4,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Page Header */}
        <Stack 
          direction="row" 
          alignItems="center" 
          justifyContent="space-between" 
          mb={4}
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Live Trading Sessions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join live trading sessions with expert traders
            </Typography>
          </Box>
          
          <Stack direction="row" alignItems="center" gap={2}>
            <Chip
              icon={isConnected ? <CheckCircle size={16} weight="fill" /> : <Warning size={16} />}
              label={isConnected ? 'Connected' : 'Connecting...'}
              color={isConnected ? 'success' : 'warning'}
              variant="outlined"
              size="small"
            />
          </Stack>
        </Stack>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {/* Token Expired Alert */}
        {tokenExpired && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle>Session Expired</AlertTitle>
            Your session has expired. Please refresh the page or sign in again to see your subscription benefits.
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack gap={2}>
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
              </Stack>
            </Grid>
          </Grid>
        ) : allMeetings.length === 0 ? (
          // No meetings available
          <Card sx={{ p: 6, textAlign: 'center' }}>
            <VideoCamera size={64} weight="thin" style={{ marginBottom: 16, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom>
              No Live Sessions Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check back later for upcoming trading sessions
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {/* Desktop Layout */}
            {isDesktop ? (
              <>
                {/* Main Content - Selected Meeting */}
                <Grid item xs={12} md={8}>
                  <Card sx={{ height: '100%', minHeight: 500 }}>
                    <CardContent sx={{ height: '100%', p: 0 }}>
                      {currentMeeting ? (
                        <Stack height="100%">
                          {/* Meeting Header */}
                          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Stack direction="row" spacing={2} alignItems="center">
                                {currentMeeting.status === 'live' && (
                                  <Box
                                    sx={{
                                      width: 12,
                                      height: 12,
                                      borderRadius: '50%',
                                      bgcolor: 'error.main',
                                      animation: 'pulse 2s infinite',
                                    }}
                                  />
                                )}
                                <Typography variant="h5" fontWeight={600}>
                                  {currentMeeting.title}
                                </Typography>
                              </Stack>
                              
                              {/* Action Button */}
                              {renderMeetingButton(currentMeeting, true)}
                            </Stack>
                            
                            {currentMeeting.description ? <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {currentMeeting.description}
                              </Typography> : null}
                          </Box>
                          
                          {/* Meeting Details */}
                          <Box sx={{ p: 3, flex: 1 }}>
                            <Grid container spacing={3}>
                              <Grid item xs={12} sm={6}>
                                <Stack spacing={2}>
                                  <Box>
                                    <Typography variant="overline" color="text.secondary" gutterBottom>
                                      Host
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Avatar sx={{ width: 32, height: 32 }}>
                                        {typeof currentMeeting.host === 'string' ? 'H' : currentMeeting.host.firstName.charAt(0)}
                                      </Avatar>
                                      <Typography variant="body1">
                                        {typeof currentMeeting.host === 'string' ? 'Host' : `${currentMeeting.host.firstName} ${currentMeeting.host.lastName}`}
                                      </Typography>
                                    </Stack>
                                  </Box>
                                  
                                  <Box>
                                    <Typography variant="overline" color="text.secondary" gutterBottom>
                                      Schedule
                                    </Typography>
                                    <Stack spacing={0.5}>
                                      <Typography variant="body2">
                                        <Calendar size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                        {new Date(currentMeeting.scheduledAt).toLocaleDateString()}
                                      </Typography>
                                      <Typography variant="body2">
                                        <Clock size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                        {new Date(currentMeeting.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </Typography>
                                      <Typography variant="body2">
                                        <Timer size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                        {currentMeeting.duration} minutes
                                      </Typography>
                                    </Stack>
                                  </Box>
                                </Stack>
                              </Grid>
                              
                              <Grid item xs={12} sm={6}>
                                <Stack spacing={2}>
                                  <Box>
                                    <Typography variant="overline" color="text.secondary" gutterBottom>
                                      Meeting Type
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Chip 
                                        size="small" 
                                        label={currentMeeting.meetingType.replace(/_/g, ' ').toUpperCase()} 
                                        color={currentMeeting.meetingType === 'daily_live' ? 'primary' : 'default'}
                                      />
                                      {currentMeeting.meetingType === 'daily_live' && (
                                        <Tooltip title="Daily live trading sessions">
                                          <Star size={16} weight="fill" color={theme.palette.warning.main} />
                                        </Tooltip>
                                      )}
                                    </Stack>
                                  </Box>
                                  
                                  <Box>
                                    <Typography variant="overline" color="text.secondary" gutterBottom>
                                      Participants
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Users size={20} />
                                      <Typography variant="body2">
                                        {currentMeeting.attendees?.length || 0} / {currentMeeting.maxParticipants}
                                      </Typography>
                                      {currentMeeting.attendees && currentMeeting.attendees.length > 0 ? <AvatarGroup max={3} sx={{ ml: 1 }}>
                                          {currentMeeting.attendees.map((attendee: any, idx: number) => (
                                            <Avatar key={idx} sx={{ width: 24, height: 24 }}>
                                              {attendee.firstName?.charAt(0) || '?'}
                                            </Avatar>
                                          ))}
                                        </AvatarGroup> : null}
                                    </Stack>
                                  </Box>
                                </Stack>
                              </Grid>
                            </Grid>
                          </Box>
                          
                          {/* Meeting Features */}
                          <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
                            <Typography variant="overline" color="text.secondary" gutterBottom>
                              Meeting Features
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                              {currentMeeting.enableScreenShare ? <Chip icon={<Desktop size={14} />} label="Screen Share" size="small" /> : null}
                              {currentMeeting.enableRecording ? <Chip icon={<Television size={14} />} label="Recording" size="small" /> : null}
                              {currentMeeting.enableChat ? <Chip icon={<Envelope size={14} />} label="Chat" size="small" /> : null}
                              {currentMeeting.whiteboardEnabled ? <Chip icon={<CheckCircle size={14} />} label="Whiteboard" size="small" /> : null}
                            </Stack>
                          </Box>
                          {/* Countdown or Status */}
                          {getSessionStatus(currentMeeting) === 'upcoming' && timeUntilStart ? <Box 
                              sx={{ 
                                p: 2, 
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                borderRadius: 1,
                                textAlign: 'center'
                              }}
                            >
                              <Typography variant="body2" color="primary" fontWeight={600}>
                                Starting in {timeUntilStart}
                              </Typography>
                            </Box> : null}
                        </Stack>
                      ) : (
                        <Box 
                          display="flex" 
                          flexDirection="column"
                          alignItems="center" 
                          justifyContent="center" 
                          height="100%"
                          gap={3}
                        >
                          <Box
                            sx={{
                              width: 120,
                              height: 120,
                              borderRadius: '50%',
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <VideoCamera size={64} weight="thin" color={theme.palette.primary.main} />
                          </Box>
                          <Typography variant="h6" color="text.secondary">
                            Select a meeting to view details
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Sidebar - Meeting List */}
                <Grid item xs={12} md={4}>
                  <Stack spacing={2}>
                    {/* Access Status Card */}
                    {!loading && (
                      <Card>
                        <CardContent>
                          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Your Access
                            </Typography>
                            {hasAccess ? (
                              <Chip 
                                icon={<CheckCircle size={16} weight="fill" />} 
                                label="Active" 
                                color="success" 
                                size="small" 
                              />
                            ) : (
                              <Chip 
                                icon={<Lock size={16} />} 
                                label="Limited" 
                                color="warning" 
                                size="small" 
                              />
                            )}
                          </Stack>
                          
                          {!hasAccess && (
                            <Stack spacing={1}>
                              <Typography variant="body2" color="text.secondary">
                                Upgrade your subscription to join live trading sessions
                              </Typography>
                              <Button
                                variant="contained"
                                fullWidth
                                startIcon={<Crown size={20} />}
                                onClick={() => router.push('/products')}
                                sx={{ mt: 1 }}
                              >
                                View Subscriptions
                              </Button>
                            </Stack>
                          )}
                          
                          {hasAccess && liveMeetingsData?.user && (
                            <Stack spacing={0.5}>
                              {liveMeetingsData.user.hasLiveSubscription && (
                                <Typography variant="caption" color="success.main">
                                  ✓ Live Subscription Active
                                </Typography>
                              )}
                              {liveMeetingsData.user.hasLiveWeeklyModuleAccess && (
                                <Typography variant="caption" color="success.main">
                                  ✓ Live Weekly Module Access
                                </Typography>
                              )}
                              {liveMeetingsData.user.allowLiveMeetingAccess && (
                                <Typography variant="caption" color="success.main">
                                  ✓ Special Access Granted
                                </Typography>
                              )}
                            </Stack>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Meeting List */}
                    <Card>
                      <CardHeader 
                        title="Available Sessions" 
                        titleTypographyProps={{ variant: 'h6' }}
                        sx={{ pb: 1 }}
                      />
                      <Divider />
                      <CardContent sx={{ p: 0 }}>
                        <Stack>
                          {allMeetings.map((session) => {
                            const status = getSessionStatus(session);
                            const hostId = typeof session.host === 'string' ? session.host : session.host._id;
                            const hostName = typeof session.host === 'string' ? 'Host' : `${session.host.firstName} ${session.host.lastName}`;
                            const isHost = user?._id === hostId;
                            const isSelected = selectedMeeting?._id === session._id;
                            
                            return (
                              <Paper
                                key={session._id}
                                onClick={() => setSelectedMeeting(session)}
                                sx={{
                                  p: 2,
                                  cursor: 'pointer',
                                  borderRadius: 0,
                                  borderBottom: 1,
                                  borderColor: 'divider',
                                  transition: 'all 0.2s',
                                  ...(isSelected && {
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                                  }),
                                  '&:hover': {
                                    bgcolor: 'action.hover',
                                  },
                                  '&:last-child': {
                                    borderBottom: 0,
                                  },
                                }}
                              >
                                <Stack spacing={1}>
                                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                      {status === 'live' && (
                                        <Box
                                          sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: 'error.main',
                                            animation: 'pulse 2s infinite',
                                          }}
                                        />
                                      )}
                                      <Typography variant="subtitle2" fontWeight={600}>
                                        {session.title}
                                      </Typography>
                                    </Stack>
                                    {isHost && (
                                      <Chip 
                                        label="Host" 
                                        size="small" 
                                        color="primary" 
                                        sx={{ height: 20 }}
                                        icon={<Crown size={12} />}
                                      />
                                    )}
                                  </Stack>
                                  
                                  <Stack direction="row" alignItems="center" spacing={2}>
                                    <Typography variant="caption" color="text.secondary">
                                      <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                      {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      Host: {hostName}
                                    </Typography>
                                  </Stack>
                                  
                                  <Box sx={{ mt: 1 }}>
                                    {renderMeetingButton(session)}
                                  </Box>
                                </Stack>
                              </Paper>
                            );
                          })}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Stack>
                </Grid>
              </>
            ) : (
              /* Mobile Layout */
              <Grid item xs={12}>
                <Stack spacing={2}>
                  {/* Access Status for Mobile */}
                  {!loading && !hasAccess && (
                    <Alert severity="info" action={
                      <Button color="inherit" size="small" onClick={() => router.push('/products')}>
                        Upgrade
                      </Button>
                    }>
                      Upgrade to join live trading sessions
                    </Alert>
                  )}
                  
                  {/* Mobile Meeting Cards */}
                  {allMeetings.map(renderMobileSessionCard)}
                </Stack>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </>
  );
}