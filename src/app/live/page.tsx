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
  const { hasAccess: hasModuleAccess, loading: _moduleLoading } = useModuleAccess(ModuleType.LIVE_WEEKLY);
  
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

    // Don't call the start API here - just navigate to the meeting page
    // The meeting router will determine the correct provider and redirect accordingly
    router.push(`/meeting/${session._id}`);
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
          size={isPrimary ? "large" : "medium"}
          startIcon={<VideoCamera size={isPrimary ? 24 : 20} weight="fill" />}
          onClick={() => handleStartMeeting(session)}
          sx={{
            fontWeight: 600,
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              boxShadow: '0 6px 20px rgba(22, 163, 74, 0.4)',
            },
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
              size={isPrimary ? "large" : "medium"}
              startIcon={<SignIn size={isPrimary ? 24 : 20} />}
              onClick={() => {
                // If user is not logged in, go to sign-in page
                if (!user) {
                  router.push('/auth/sign-in');
                } else {
                  // If user is logged in but doesn't have access, go to subscriptions page
                  router.push('/academy/subscription/plans');
                }
              }}
              sx={{
                fontWeight: 600,
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { boxShadow: '0 0 0 0 rgba(22, 163, 74, 0.7)' },
                  '70%': { boxShadow: '0 0 0 10px rgba(22, 163, 74, 0)' },
                  '100%': { boxShadow: '0 0 0 0 rgba(22, 163, 74, 0)' },
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
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
            size={isPrimary ? "large" : "medium"}
            startIcon={<VideoCamera size={isPrimary ? 24 : 20} weight="fill" />}
            onClick={() => handleJoinSession(session)}
            sx={{
              fontWeight: 600,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
                '70%': { boxShadow: '0 0 0 10px rgba(239, 68, 68, 0)' },
                '100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' },
              },
              '&:hover': {
                background: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
                boxShadow: '0 6px 20px rgba(239, 68, 68, 0.5)',
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
            icon={<Clock size={16} />}
            size={isPrimary ? "medium" : "small"}
            sx={{
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              fontWeight: 600,
              '& .MuiChip-icon': { color: '#fbbf24' },
            }}
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
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'rgba(255, 255, 255, 0.4)',
              '&.Mui-disabled': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
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
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'rgba(255, 255, 255, 0.4)',
              '&.Mui-disabled': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
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
        elevation={0}
        onClick={() => setSelectedMeeting(session)}
        sx={{
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: '#161b22',
          border: isSelected ? '2px solid #16a34a' : '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
          ...(isSelected && {
            boxShadow: '0 4px 20px rgba(22, 163, 74, 0.2)',
          }),
          '&:hover': {
            borderColor: isSelected ? '#16a34a' : 'rgba(255, 255, 255, 0.2)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
            <Box flex={1}>
              <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                {status === 'live' && (
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: '#ef4444',
                      boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
                      animation: 'pulse 2s infinite',
                    }}
                  />
                )}
                <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ color: 'white' }}>
                  {session.title}
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Host: {hostName}
              </Typography>
            </Box>
            {isHost && (
              <Chip
                label="Host"
                size="small"
                icon={<Crown size={14} />}
                sx={{
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  '& .MuiChip-icon': { color: '#fbbf24' },
                }}
              />
            )}
          </Stack>

          <Stack direction="row" gap={1} mb={2} flexWrap="wrap">
            <Chip
              size="small"
              icon={<Calendar size={14} />}
              label={new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              sx={{
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                '& .MuiChip-icon': { color: '#60a5fa' },
              }}
            />
            <Chip
              size="small"
              icon={<Clock size={14} />}
              label={`${session.duration} min`}
              sx={{
                backgroundColor: 'rgba(139, 92, 246, 0.15)',
                color: '#a78bfa',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                '& .MuiChip-icon': { color: '#a78bfa' },
              }}
            />
            {session.isRecurring && (
              <Chip
                size="small"
                label="Recurring"
                sx={{
                  backgroundColor: 'rgba(22, 163, 74, 0.15)',
                  color: '#22c55e',
                  border: '1px solid rgba(22, 163, 74, 0.3)',
                }}
              />
            )}
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0d1117' }}>
      <MainNavbar />
      <Container
        maxWidth="xl"
        sx={{
          mt: { xs: 12, md: 14 },
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
            <Typography
              variant="h4"
              fontWeight={700}
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #16a34a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Live Trading Sessions
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Join live trading sessions with expert traders
            </Typography>
          </Box>

          <Stack direction="row" alignItems="center" gap={2}>
            <Chip
              icon={isConnected ? <CheckCircle size={16} weight="fill" /> : <Warning size={16} />}
              label={isConnected ? 'Connected' : 'Connecting...'}
              size="small"
              sx={{
                backgroundColor: isConnected ? 'rgba(22, 163, 74, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: isConnected ? '#22c55e' : '#f59e0b',
                border: `1px solid ${isConnected ? 'rgba(22, 163, 74, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                '& .MuiChip-icon': {
                  color: isConnected ? '#22c55e' : '#f59e0b',
                },
              }}
            />
          </Stack>
        </Stack>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{
              mb: 3,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 2,
              '& .MuiAlert-icon': { color: '#ef4444' },
              '& .MuiAlertTitle-root': { color: '#f87171' },
              '& .MuiAlert-message': { color: 'rgba(255, 255, 255, 0.8)' },
            }}
          >
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {/* Token Expired Alert */}
        {tokenExpired && (
          <Alert
            severity="warning"
            sx={{
              mb: 3,
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 2,
              '& .MuiAlert-icon': { color: '#f59e0b' },
              '& .MuiAlertTitle-root': { color: '#fbbf24' },
              '& .MuiAlert-message': { color: 'rgba(255, 255, 255, 0.8)' },
            }}
          >
            <AlertTitle>Session Expired</AlertTitle>
            Your session has expired. Please refresh the page or sign in again to see your subscription benefits.
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack gap={2}>
                <Skeleton
                  variant="rectangular"
                  height={100}
                  sx={{ borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.05)' }}
                />
                <Skeleton
                  variant="rectangular"
                  height={200}
                  sx={{ borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.05)' }}
                />
              </Stack>
            </Grid>
          </Grid>
        ) : allMeetings.length === 0 ? (
          // No meetings available
          <Card
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              backgroundColor: '#161b22',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <VideoCamera size={48} weight="thin" color="#16a34a" />
            </Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              No Live Sessions Available
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
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
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      minHeight: 500,
                      backgroundColor: '#161b22',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 3,
                    }}
                  >
                    <CardContent sx={{ height: '100%', p: 0 }}>
                      {currentMeeting ? (
                        <Stack height="100%">
                          {/* Meeting Header */}
                          <Box
                            sx={{
                              p: 3,
                              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                              background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, transparent 100%)',
                            }}
                          >
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Stack direction="row" spacing={2} alignItems="center">
                                {currentMeeting.status === 'live' && (
                                  <Box
                                    sx={{
                                      width: 12,
                                      height: 12,
                                      borderRadius: '50%',
                                      bgcolor: '#ef4444',
                                      boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
                                      animation: 'pulse 2s infinite',
                                    }}
                                  />
                                )}
                                <Typography variant="h5" fontWeight={600} sx={{ color: 'white' }}>
                                  {currentMeeting.title}
                                </Typography>
                              </Stack>

                              {/* Action Button */}
                              {renderMeetingButton(currentMeeting, true)}
                            </Stack>

                            {currentMeeting.description ? <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                                {currentMeeting.description}
                              </Typography> : null}
                          </Box>
                          
                          {/* Meeting Details */}
                          <Box sx={{ p: 3, flex: 1 }}>
                            <Grid container spacing={3}>
                              <Grid item xs={12} sm={6}>
                                <Stack spacing={3}>
                                  <Box>
                                    <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.5)', letterSpacing: 1 }} gutterBottom>
                                      HOST
                                    </Typography>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                      <Avatar
                                        sx={{
                                          width: 40,
                                          height: 40,
                                          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                          boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                                        }}
                                      >
                                        {typeof currentMeeting.host === 'string' ? 'H' : currentMeeting.host.firstName.charAt(0)}
                                      </Avatar>
                                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                                        {typeof currentMeeting.host === 'string' ? 'Host' : `${currentMeeting.host.firstName} ${currentMeeting.host.lastName}`}
                                      </Typography>
                                    </Stack>
                                  </Box>

                                  <Box>
                                    <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.5)', letterSpacing: 1 }} gutterBottom>
                                      SCHEDULE
                                    </Typography>
                                    <Stack spacing={1}>
                                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                                        <Calendar size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: '#16a34a' }} />
                                        {new Date(currentMeeting.scheduledAt).toLocaleDateString()}
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                                        <Clock size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: '#3b82f6' }} />
                                        {new Date(currentMeeting.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                                        <Timer size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: '#8b5cf6' }} />
                                        {currentMeeting.duration} minutes
                                      </Typography>
                                    </Stack>
                                  </Box>
                                </Stack>
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <Stack spacing={3}>
                                  <Box>
                                    <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.5)', letterSpacing: 1 }} gutterBottom>
                                      MEETING TYPE
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Chip
                                        size="small"
                                        label={currentMeeting.meetingType.replace(/_/g, ' ').toUpperCase()}
                                        sx={{
                                          backgroundColor: currentMeeting.meetingType === 'daily_live' ? 'rgba(22, 163, 74, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                          color: currentMeeting.meetingType === 'daily_live' ? '#22c55e' : 'rgba(255, 255, 255, 0.8)',
                                          border: `1px solid ${currentMeeting.meetingType === 'daily_live' ? 'rgba(22, 163, 74, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`,
                                          fontWeight: 600,
                                        }}
                                      />
                                      {currentMeeting.meetingType === 'daily_live' && (
                                        <Tooltip title="Daily live trading sessions">
                                          <Star size={18} weight="fill" color="#f59e0b" />
                                        </Tooltip>
                                      )}
                                    </Stack>
                                  </Box>

                                  <Box>
                                    <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.5)', letterSpacing: 1 }} gutterBottom>
                                      PARTICIPANTS
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Users size={20} color="#06b6d4" />
                                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                                        {currentMeeting.attendees?.length || 0} / {currentMeeting.maxParticipants}
                                      </Typography>
                                      {currentMeeting.attendees && currentMeeting.attendees.length > 0 ? <AvatarGroup max={3} sx={{ ml: 1 }}>
                                          {currentMeeting.attendees.map((attendee: any, idx: number) => (
                                            <Avatar
                                              key={idx}
                                              sx={{
                                                width: 28,
                                                height: 28,
                                                fontSize: '0.75rem',
                                                backgroundColor: '#0d1117',
                                                border: '2px solid #161b22',
                                              }}
                                            >
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
                          <Box sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <Typography variant="overline" sx={{ color: 'rgba(255, 255, 255, 0.5)', letterSpacing: 1 }} gutterBottom>
                              MEETING FEATURES
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
                              {currentMeeting.enableScreenShare ? (
                                <Chip
                                  icon={<Desktop size={14} />}
                                  label="Screen Share"
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                                    color: '#60a5fa',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    '& .MuiChip-icon': { color: '#60a5fa' },
                                  }}
                                />
                              ) : null}
                              {currentMeeting.enableRecording ? (
                                <Chip
                                  icon={<Television size={14} />}
                                  label="Recording"
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                    color: '#f87171',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    '& .MuiChip-icon': { color: '#f87171' },
                                  }}
                                />
                              ) : null}
                              {currentMeeting.enableChat ? (
                                <Chip
                                  icon={<Envelope size={14} />}
                                  label="Chat"
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(139, 92, 246, 0.15)',
                                    color: '#a78bfa',
                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                    '& .MuiChip-icon': { color: '#a78bfa' },
                                  }}
                                />
                              ) : null}
                              {currentMeeting.whiteboardEnabled ? (
                                <Chip
                                  icon={<CheckCircle size={14} />}
                                  label="Whiteboard"
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                                    color: '#fbbf24',
                                    border: '1px solid rgba(245, 158, 11, 0.3)',
                                    '& .MuiChip-icon': { color: '#fbbf24' },
                                  }}
                                />
                              ) : null}
                            </Stack>
                          </Box>
                          {/* Countdown or Status */}
                          {getSessionStatus(currentMeeting) === 'upcoming' && timeUntilStart ? (
                            <Box
                              sx={{
                                p: 2,
                                background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, rgba(22, 163, 74, 0.05) 100%)',
                                borderTop: '1px solid rgba(22, 163, 74, 0.2)',
                                textAlign: 'center',
                              }}
                            >
                              <Typography variant="body2" sx={{ color: '#22c55e', fontWeight: 600 }}>
                                Starting in {timeUntilStart}
                              </Typography>
                            </Box>
                          ) : null}
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
                              background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, rgba(22, 163, 74, 0.05) 100%)',
                              border: '1px solid rgba(22, 163, 74, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <VideoCamera size={64} weight="thin" color="#16a34a" />
                          </Box>
                          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
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
                      <Card
                        elevation={0}
                        sx={{
                          backgroundColor: '#161b22',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 3,
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'white' }}>
                              Your Access
                            </Typography>
                            {hasAccess ? (
                              <Chip
                                icon={<CheckCircle size={16} weight="fill" />}
                                label="Active"
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(22, 163, 74, 0.15)',
                                  color: '#22c55e',
                                  border: '1px solid rgba(22, 163, 74, 0.3)',
                                  '& .MuiChip-icon': { color: '#22c55e' },
                                }}
                              />
                            ) : (
                              <Chip
                                icon={<Lock size={16} />}
                                label="Limited"
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                                  color: '#f59e0b',
                                  border: '1px solid rgba(245, 158, 11, 0.3)',
                                  '& .MuiChip-icon': { color: '#f59e0b' },
                                }}
                              />
                            )}
                          </Stack>

                          {!hasAccess && (
                            <Stack spacing={1.5}>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Upgrade your subscription to join live trading sessions
                              </Typography>
                              <Button
                                variant="contained"
                                fullWidth
                                startIcon={<Crown size={20} />}
                                onClick={() => router.push('/academy/subscription/plans?view=monthly')}
                                sx={{
                                  mt: 1,
                                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                    boxShadow: '0 6px 20px rgba(22, 163, 74, 0.4)',
                                  },
                                }}
                              >
                                View Subscriptions
                              </Button>
                            </Stack>
                          )}

                          {hasAccess && liveMeetingsData?.user && (
                            <Stack spacing={1}>
                              {liveMeetingsData.user.hasLiveSubscription && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CheckCircle size={14} weight="fill" color="#22c55e" />
                                  <Typography variant="caption" sx={{ color: '#22c55e' }}>
                                    Live Subscription Active
                                  </Typography>
                                </Box>
                              )}
                              {liveMeetingsData.user.hasLiveWeeklyModuleAccess && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CheckCircle size={14} weight="fill" color="#22c55e" />
                                  <Typography variant="caption" sx={{ color: '#22c55e' }}>
                                    Live Weekly Module Access
                                  </Typography>
                                </Box>
                              )}
                              {liveMeetingsData.user.allowLiveMeetingAccess && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CheckCircle size={14} weight="fill" color="#22c55e" />
                                  <Typography variant="caption" sx={{ color: '#22c55e' }}>
                                    Special Access Granted
                                  </Typography>
                                </Box>
                              )}
                            </Stack>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Meeting List */}
                    <Card
                      elevation={0}
                      sx={{
                        backgroundColor: '#161b22',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}
                    >
                      <CardHeader
                        title="Available Sessions"
                        titleTypographyProps={{
                          variant: 'h6',
                          sx: { color: 'white', fontWeight: 600 },
                        }}
                        sx={{
                          pb: 1,
                          background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.08) 0%, transparent 100%)',
                        }}
                      />
                      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                      <CardContent sx={{ p: 0 }}>
                        <Stack>
                          {allMeetings.map((session) => {
                            const status = getSessionStatus(session);
                            const hostId = typeof session.host === 'string' ? session.host : session.host._id;
                            const hostName = typeof session.host === 'string' ? 'Host' : `${session.host.firstName} ${session.host.lastName}`;
                            const isHost = user?._id === hostId;
                            const isSelected = selectedMeeting?._id === session._id;

                            return (
                              <Box
                                key={session._id}
                                onClick={() => setSelectedMeeting(session)}
                                sx={{
                                  p: 2,
                                  cursor: 'pointer',
                                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                                  backgroundColor: isSelected ? 'rgba(22, 163, 74, 0.1)' : 'transparent',
                                  borderLeft: isSelected ? '3px solid #16a34a' : '3px solid transparent',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    backgroundColor: isSelected ? 'rgba(22, 163, 74, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                  },
                                  '&:last-child': {
                                    borderBottom: 0,
                                  },
                                }}
                              >
                                <Stack spacing={1.5}>
                                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                      {status === 'live' && (
                                        <Box
                                          sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: '#ef4444',
                                            boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)',
                                            animation: 'pulse 2s infinite',
                                          }}
                                        />
                                      )}
                                      <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'white' }}>
                                        {session.title}
                                      </Typography>
                                    </Stack>
                                    {isHost && (
                                      <Chip
                                        label="Host"
                                        size="small"
                                        icon={<Crown size={12} />}
                                        sx={{
                                          height: 22,
                                          backgroundColor: 'rgba(245, 158, 11, 0.15)',
                                          color: '#fbbf24',
                                          border: '1px solid rgba(245, 158, 11, 0.3)',
                                          '& .MuiChip-icon': { color: '#fbbf24' },
                                        }}
                                      />
                                    )}
                                  </Stack>

                                  <Stack direction="row" alignItems="center" spacing={2}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                      <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle', color: '#3b82f6' }} />
                                      {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                      Host: {hostName}
                                    </Typography>
                                  </Stack>

                                  <Box sx={{ mt: 0.5 }}>
                                    {renderMeetingButton(session)}
                                  </Box>
                                </Stack>
                              </Box>
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
                    <Alert
                      severity="info"
                      action={
                        <Button
                          size="small"
                          onClick={() => router.push('/academy/subscription/plans?view=monthly')}
                          sx={{
                            color: '#60a5fa',
                            fontWeight: 600,
                            '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.1)' },
                          }}
                        >
                          Upgrade
                        </Button>
                      }
                      sx={{
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: 2,
                        '& .MuiAlert-icon': { color: '#3b82f6' },
                        '& .MuiAlert-message': { color: 'rgba(255, 255, 255, 0.8)' },
                      }}
                    >
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
    </Box>
  );
}