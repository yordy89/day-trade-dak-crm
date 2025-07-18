'use client';

import React from 'react';
import {
  Box,
  Card,
  Stack,
  Typography,
  Chip,
  Avatar,
  Tooltip,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';
import { Clock, Users, Lock, Crown, Info } from '@phosphor-icons/react';
import { SubscriptionPlan } from '@/types/user';

interface MeetingCardEnhancedProps {
  meeting: {
    _id: string;
    title: string;
    description?: string;
    scheduledAt: Date | string;
    duration: number;
    status: 'scheduled' | 'live' | 'completed' | 'cancelled';
    host: {
      _id: string;
      firstName?: string;
      lastName?: string;
      email: string;
      profileImage?: string;
    };
    participants: any[];
    maxParticipants: number;
    isPublic: boolean;
    meetingType: string;
    // New subscription fields
    allowedSubscriptions?: string[];
    restrictedToSubscriptions?: boolean;
  };
  selected?: boolean;
  onClick?: () => void;
  showSubscriptionInfo?: boolean;
  userSubscriptions?: string[];
  isHost?: boolean;
  isAdmin?: boolean;
}

// Map subscription IDs to display names
const subscriptionDisplayNames: Record<string, string> = {
  LiveWeeklyManual: 'Live Weekly Manual',
  LiveWeeklyRecurring: 'Live Weekly Recurring',
  MasterClases: 'Master Classes',
  LiveRecorded: 'Live Recorded',
  Psicotrading: 'Psicotrading',
  Classes: 'Classes',
  PeaceWithMoney: 'Peace with Money',
  MasterCourse: 'Master Course',
  CommunityEvent: 'Community Event',
  VipEvent: 'VIP Event',
};

export function MeetingCardEnhanced({
  meeting,
  selected,
  onClick,
  showSubscriptionInfo = true,
  userSubscriptions = [],
  isHost = false,
  isAdmin = false,
}: MeetingCardEnhancedProps) {
  const theme = useTheme();
  
  // Check if user has access based on subscriptions
  const hasSubscriptionAccess = React.useMemo(() => {
    if (!meeting.restrictedToSubscriptions || !meeting.allowedSubscriptions?.length) {
      return true; // No restrictions
    }
    if (isHost || isAdmin) {
      return true; // Host and admin always have access
    }
    // Check if user has any of the required subscriptions
    return meeting.allowedSubscriptions.some(sub => userSubscriptions.includes(sub));
  }, [meeting, userSubscriptions, isHost, isAdmin]);

  const meetingTime = new Date(meeting.scheduledAt);
  const isLive = meeting.status === 'live';
  const isPast = meetingTime < new Date() && !isLive;

  return (
    <Card
      onClick={onClick}
      sx={{
        p: 2,
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: selected ? alpha(theme.palette.primary.main, 0.08) : 'background.paper',
        transition: 'all 0.2s',
        opacity: isPast ? 0.7 : 1,
        '&:hover': onClick ? {
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          borderColor: theme.palette.primary.main,
          transform: 'translateY(-2px)',
          boxShadow: 2,
        } : {},
      }}
    >
      <Stack spacing={2}>
        {/* Header */}
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box flex={1}>
            <Typography variant="body1" fontWeight={600} gutterBottom>
              {meeting.title}
            </Typography>
            
            {/* Time and Status */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Clock size={16} color={theme.palette.text.secondary} />
              <Typography variant="caption" color="text.secondary">
                {meetingTime.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({meeting.duration} min)
              </Typography>
              
              {isLive && (
                <Chip 
                  label="LIVE" 
                  size="small" 
                  color="error" 
                  sx={{ 
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.7 },
                      '100%': { opacity: 1 },
                    },
                  }}
                />
              )}
            </Stack>
          </Box>

          {/* Meeting Type Badge */}
          {meeting.meetingType && (
            <Chip 
              label={meeting.meetingType.replace('_', ' ').toUpperCase()} 
              size="small" 
              variant="outlined"
              color={meeting.meetingType === 'daily_live' ? 'primary' : 'default'}
            />
          )}
        </Stack>

        {/* Host Info */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar 
            src={meeting.host.profileImage} 
            sx={{ width: 24, height: 24 }}
          >
            {meeting.host.firstName?.charAt(0) || meeting.host.email.charAt(0)}
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            Host: {meeting.host.firstName} {meeting.host.lastName}
          </Typography>
        </Stack>

        {/* Subscription Requirements */}
        {showSubscriptionInfo && meeting.restrictedToSubscriptions && meeting.allowedSubscriptions?.length > 0 && (
          <Box 
            sx={{ 
              p: 1.5, 
              bgcolor: hasSubscriptionAccess 
                ? alpha(theme.palette.success.main, 0.1) 
                : alpha(theme.palette.warning.main, 0.1),
              borderRadius: 1,
              border: `1px solid ${hasSubscriptionAccess 
                ? alpha(theme.palette.success.main, 0.3) 
                : alpha(theme.palette.warning.main, 0.3)}`,
            }}
          >
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Lock size={16} color={hasSubscriptionAccess ? theme.palette.success.main : theme.palette.warning.main} />
                <Typography variant="caption" fontWeight={600}>
                  {hasSubscriptionAccess ? 'You have access' : 'Subscription required'}
                </Typography>
                {(isHost || isAdmin) && (
                  <Tooltip title={isHost ? 'You are the host' : 'Admin access'}>
                    <Crown size={16} color={theme.palette.primary.main} />
                  </Tooltip>
                )}
              </Stack>
              
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Required subscriptions:
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {meeting.allowedSubscriptions.map((sub) => (
                    <Chip
                      key={sub}
                      label={subscriptionDisplayNames[sub] || sub}
                      size="small"
                      color={userSubscriptions.includes(sub) ? 'success' : 'default'}
                      variant={userSubscriptions.includes(sub) ? 'filled' : 'outlined'}
                      sx={{ 
                        fontSize: '0.65rem',
                        height: 22,
                        mb: 0.5,
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Box>
        )}

        {/* Participants Info */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Users size={16} color={theme.palette.text.secondary} />
            <Typography variant="caption" color="text.secondary">
              {meeting.participants.length} / {meeting.maxParticipants} participants
            </Typography>
          </Stack>
          
          {meeting.isPublic && (
            <Chip label="Public" size="small" color="info" variant="outlined" />
          )}
        </Stack>

        {/* Access Warning */}
        {!hasSubscriptionAccess && !isPast && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Info size={16} color={theme.palette.warning.main} />
            <Typography variant="caption" color="warning.main">
              You need a subscription to join this meeting
            </Typography>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}