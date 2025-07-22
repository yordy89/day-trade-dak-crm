'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  Avatar,
  AvatarGroup,
  Paper,
  Divider,
} from '@mui/material';
import {
  VideoCamera,
  Desktop,
  Users,
  Calendar,
  Clock,
  Play,
  Phone,
  Envelope,
  WhatsappLogo,
  Timer,
  CheckCircle,
  Television,
  CalendarCheck,
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useClientAuth } from '@/hooks/use-client-auth';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useModuleAccess } from '@/hooks/use-module-access';
import { ModuleType } from '@/types/module-permission';
import { formatDistanceToNow, isAfter, isBefore, addMinutes } from 'date-fns';
import { MainNavbar } from '@/components/landing/main-navbar';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with VideoSDK
const VideoMeetingRoom = dynamic(
  () => import('@/components/meetings/video-meeting-room').then(mod => mod.VideoMeetingRoom),
  { 
    ssr: false,
    loading: () => <CircularProgress />
  }
);

interface LiveMeetingsResponse {
  hasAccess: boolean;
  user: {
    hasLiveSubscription: boolean;
    allowLiveMeetingAccess: boolean;
    role: string;
  };
  dailyLiveMeeting: ScheduledSession | null;
  otherMeetings: ScheduledSession[];
  supportInfo: {
    email: string;
    phone: string;
    whatsapp: string;
  };
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
    firstName?: string;
    lastName?: string;
    email: string;
    profileImage?: string;
  };
  participants: any[];
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
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
  const { hasAccess: hasModuleAccess, loading: moduleLoading } = useModuleAccess(ModuleType.Live);
  
  const [liveMeetingsData, setLiveMeetingsData] = useState<LiveMeetingsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeUntilStart, setTimeUntilStart] = useState<string>('');
  const [activeMeeting, setActiveMeeting] = useState<{ meetingId: string; roomId: string; isHost: boolean } | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<ScheduledSession | null>(null);

  // Fetch meetings from API
  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user || !authToken) {
        console.log('No user or auth token available', { user: Boolean(user), authToken: Boolean(authToken) });
        setError('Please log in to view live sessions');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get('http://localhost:4000/api/v1/meetings/live-meetings', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        
        setLiveMeetingsData(response.data);
        
        // Auto-select a meeting if none is selected
        if (!selectedMeeting) {
          // First priority: Select a live meeting if any
          const liveMeeting = response.data.dailyLiveMeeting?.status === 'live' 
            ? response.data.dailyLiveMeeting 
            : response.data.otherMeetings?.find((m: any) => m.status === 'live');
          
          if (liveMeeting) {
            setSelectedMeeting(liveMeeting);
          } else if (response.data.dailyLiveMeeting) {
            // Second priority: Daily live meeting
            setSelectedMeeting(response.data.dailyLiveMeeting);
          } else if (response.data.otherMeetings && response.data.otherMeetings.length > 0) {
            // Third priority: First available meeting
            setSelectedMeeting(response.data.otherMeetings[0]);
          }
        }
        
        // Also update selectedMeeting if it no longer exists in the data
        if (selectedMeeting) {
          const allMeetings = [
            ...(response.data.dailyLiveMeeting ? [response.data.dailyLiveMeeting] : []),
            ...(response.data.otherMeetings || [])
          ];
          const stillExists = allMeetings.find((m: any) => m._id === selectedMeeting._id);
          if (!stillExists && allMeetings.length > 0) {
            setSelectedMeeting(allMeetings[0]);
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch meetings:', err);
        
        if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          // Optionally redirect to login
          // router.push('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to load meetings');
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchMeetings();
  }, [user, authToken]);

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
    if (!liveMeetingsData?.hasAccess) {
      return;
    }

    // Set active meeting to show embedded room
    const hostId = typeof session.host === 'string' ? session.host : session.host._id;
    setActiveMeeting({
      meetingId: session._id,  // MongoDB document ID for API calls
      roomId: session.meetingId,  // VideoSDK room ID
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
      const _response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/admin/meetings/${session._id}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      
      // Refresh meetings data
      const meetingsResponse = await axios.get('http://localhost:4000/api/v1/meetings/live-meetings', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      setLiveMeetingsData(meetingsResponse.data);
      
      // Then join the meeting
      await handleJoinSession(session);
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
    if (session.status === 'live') return 'live';
    
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
    if (isHost && (status === 'scheduled' || status === 'upcoming' || status === 'should_be_live')) {
      return (
        <Button
          fullWidth={!isPrimary}
          variant="contained"
          color="primary"
          size={isPrimary ? "large" : "medium"}
          startIcon={<VideoCamera size={isPrimary ? 24 : 20} weight="fill" />}
          onClick={() => void handleStartMeeting(session)}
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
        return (
          <Button
            fullWidth={!isPrimary}
            variant="contained"
            color="error"
            size={isPrimary ? "large" : "medium"}
            startIcon={<Play size={isPrimary ? 24 : 20} weight="fill" />}
            onClick={() => void handleJoinSession(session)}
            sx={{
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
            label="Waiting for Host to Start"
            icon={<Timer size={20} />}
            color="warning"
            size={isPrimary ? "medium" : "small"}
          />
        );
      case 'upcoming':
        return (
          <Button
            fullWidth={!isPrimary}
            variant="outlined"
            size={isPrimary ? "large" : "medium"}
            startIcon={<CalendarCheck size={isPrimary ? 24 : 20} />}
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

  if (authLoading || loading || moduleLoading) {
    return (
      <>
        <MainNavbar />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </>
    );
  }

  // Error view
  if (error) {
    return (
      <>
        <MainNavbar />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box textAlign="center" maxWidth={600} mx="auto">
            <Alert 
            severity="error" 
            sx={{ mb: 4 }}
            action={
              error.includes('session has expired') ? (
                <Button color="inherit" size="small" onClick={() => router.push('/login')}>
                  Login
                </Button>
              ) : (
                <Button color="inherit" size="small" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              )
            }
          >
            {error}
          </Alert>
          
          <Typography variant="h5" gutterBottom>
            Unable to Load Live Sessions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please try refreshing the page or logging in again.
          </Typography>
        </Box>
      </Container>
      </>
    );
  }

  // No access view - Check both API access and module permission
  if (!liveMeetingsData?.hasAccess || !hasModuleAccess) {
    return (
      <>
        <MainNavbar />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box textAlign="center" maxWidth={800} mx="auto">
            <Television size={120} color={theme.palette.primary.main} style={{ marginBottom: 32 }} />
          
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Join Our Live Trading Community
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
            Get exclusive access to daily live trading sessions, market analysis, and real-time mentorship
          </Typography>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              mb: 6, 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: 2,
            }}
          >
            <Typography variant="h5" fontWeight={600} gutterBottom>
              What You&apos;ll Get Access To:
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CheckCircle size={24} color={theme.palette.success.main} weight="fill" />
                    <Typography>Daily live trading sessions (Mon-Fri)</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CheckCircle size={24} color={theme.palette.success.main} weight="fill" />
                    <Typography>Real-time market analysis</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CheckCircle size={24} color={theme.palette.success.main} weight="fill" />
                    <Typography>Live Q&A with expert traders</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CheckCircle size={24} color={theme.palette.success.main} weight="fill" />
                    <Typography>Recorded sessions for replay</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CheckCircle size={24} color={theme.palette.success.main} weight="fill" />
                    <Typography>Exclusive trading strategies</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CheckCircle size={24} color={theme.palette.success.main} weight="fill" />
                    <Typography>Community support & mentorship</Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
          
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Contact Our Support Team
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Get in touch to learn more about joining our live trading community
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              startIcon={<Envelope size={20} />}
              href={`mailto:${liveMeetingsData?.supportInfo.email || 'support@daytradedak.com'}`}
            >
              Email Support
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Phone size={20} />}
              href={`tel:${liveMeetingsData?.supportInfo.phone || '+1 (555) 123-4567'}`}
            >
              Call Us
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<WhatsappLogo size={20} />}
              href={`https://wa.me/${liveMeetingsData?.supportInfo.whatsapp?.replace(/\D/g, '') || '15551234567'}`}
              sx={{ 
                color: '#25D366',
                borderColor: '#25D366',
                '&:hover': {
                  borderColor: '#128C7E',
                  bgcolor: alpha('#25D366', 0.05),
                }
              }}
            >
              WhatsApp
            </Button>
          </Stack>
        </Box>
      </Container>
      </>
    );
  }

  // Has access view
  const { dailyLiveMeeting, otherMeetings } = liveMeetingsData;
  const allMeetings = dailyLiveMeeting ? [dailyLiveMeeting, ...otherMeetings] : otherMeetings;
  const currentMeeting = selectedMeeting;

  return (
    <>
      <MainNavbar />
      
      {/* Show video meeting room if active */}
      {activeMeeting && user ? <VideoMeetingRoom
          meetingId={activeMeeting.meetingId}
          roomId={activeMeeting.roomId}
          isHost={activeMeeting.isHost}
          userName={`${user.firstName} ${user.lastName}`}
          onClose={() => setActiveMeeting(null)}
        /> : null}
      
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Live Trading Sessions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join live trading sessions, market analysis, and interactive Q&A with experts
          </Typography>
        </Box>

        {/* Two Column Layout */}
        <Grid container spacing={3}>
          {/* Left Column - Meeting Details */}
          <Grid item xs={12} lg={8}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                height: '100%',
                minHeight: 600,
              }}
            >
              {currentMeeting ? (
                <Stack spacing={3} height="100%">
                  {/* Meeting Header */}
                  <Box>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={2} alignItems="center">
                        {currentMeeting.status === 'live' && (
                          <Box
                            sx={{
                              px: 2,
                              py: 0.5,
                              bgcolor: 'error.main',
                              color: 'white',
                              borderRadius: 1,
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              animation: 'pulse 2s infinite',
                            }}
                          >
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: 'white',
                                animation: 'blink 1s infinite',
                              }}
                            />
                            LIVE NOW
                          </Box>
                        )}
                        <Typography variant="h5" fontWeight={700}>
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

                  <Divider />

                  {/* Meeting Info Grid */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={2}>
                        {/* Host Info */}
                        <Box>
                          <Typography variant="caption" color="text.secondary" gutterBottom>
                            HOST
                          </Typography>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar 
                              src={currentMeeting.host.profileImage} 
                              sx={{ width: 40, height: 40 }}
                            >
                              {currentMeeting.host.firstName?.charAt(0) || currentMeeting.host.email.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {currentMeeting.host.firstName} {currentMeeting.host.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {currentMeeting.host.email}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>

                        {/* Schedule */}
                        <Box>
                          <Typography variant="caption" color="text.secondary" gutterBottom>
                            SCHEDULE
                          </Typography>
                          <Stack spacing={0.5}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Calendar size={16} color={theme.palette.text.secondary} />
                              <Typography variant="body2">
                                {new Date(currentMeeting.scheduledAt).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Clock size={16} color={theme.palette.text.secondary} />
                              <Typography variant="body2">
                                {new Date(currentMeeting.scheduledAt).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} ({currentMeeting.duration} minutes)
                              </Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack spacing={2}>
                        {/* Meeting Type */}
                        <Box>
                          <Typography variant="caption" color="text.secondary" gutterBottom>
                            MEETING TYPE
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Television size={20} color={theme.palette.primary.main} />
                            <Typography variant="body2" fontWeight={500}>
                              {currentMeeting.meetingType.replace(/_/g, ' ').toUpperCase()}
                            </Typography>
                            {currentMeeting.isRecurring ? <Chip label="Recurring" size="small" variant="outlined" /> : null}
                          </Stack>
                        </Box>

                        {/* Participants */}
                        <Box>
                          <Typography variant="caption" color="text.secondary" gutterBottom>
                            PARTICIPANTS
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Users size={20} color={theme.palette.text.secondary} />
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

                  {/* Features */}
                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      MEETING FEATURES
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
                    <Television size={60} color={theme.palette.primary.main} weight="duotone" />
                  </Box>
                  
                  <Box textAlign="center" maxWidth={400}>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      No Meeting Selected
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {allMeetings.length > 0 
                        ? 'Select a meeting from the list to view details and join the session.'
                        : 'No meetings are currently scheduled. Check back later or contact support for assistance.'}
                    </Typography>
                    
                    {allMeetings.length === 0 && (
                      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Envelope size={16} />}
                          href={`mailto:${liveMeetingsData?.supportInfo.email || 'support@daytradedak.com'}`}
                        >
                          Contact Support
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<WhatsappLogo size={16} />}
                          href={`https://wa.me/${liveMeetingsData?.supportInfo.whatsapp?.replace(/\D/g, '') || '15551234567'}`}
                          sx={{ 
                            color: '#25D366',
                            borderColor: '#25D366',
                            '&:hover': {
                              borderColor: '#128C7E',
                              bgcolor: alpha('#25D366', 0.05),
                            }
                          }}
                        >
                          WhatsApp
                        </Button>
                      </Stack>
                    )}
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Column - Meeting List */}
          <Grid item xs={12} lg={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                overflow: 'hidden',
                height: '100%',
                maxHeight: 600,
              }}
            >
              <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h6" fontWeight={600}>
                  Today&apos;s Meetings
                </Typography>
              </Box>
              
              <Box sx={{ overflow: 'auto', maxHeight: 'calc(100% - 60px)' }}>
                {allMeetings.map((meeting) => (
                  <Box
                    key={meeting._id}
                    onClick={() => setSelectedMeeting(meeting)}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      bgcolor: selectedMeeting?._id === meeting._id ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box flex={1}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {meeting.title}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                            <Clock size={14} color={theme.palette.text.secondary} />
                            <Typography variant="caption" color="text.secondary">
                              {new Date(meeting.scheduledAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </Typography>
                            {meeting.status === 'live' && (
                              <Chip 
                                label="LIVE" 
                                size="small" 
                                color="error" 
                                sx={{ 
                                  height: 18,
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                }}
                              />
                            )}
                          </Stack>
                        </Box>
                        {meeting._id === dailyLiveMeeting?._id && (
                          <Chip 
                            label="Daily" 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Stack>
                      
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar 
                          src={meeting.host.profileImage} 
                          sx={{ width: 20, height: 20 }}
                        >
                          {meeting.host.firstName?.charAt(0) || meeting.host.email.charAt(0)}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {meeting.host.firstName} {meeting.host.lastName}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
                
                {allMeetings.length === 0 && (
                  <Box p={4} textAlign="center">
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.text.secondary, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <CalendarCheck size={30} color={theme.palette.text.secondary} weight="duotone" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      No meetings scheduled
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Check back later for updates
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}