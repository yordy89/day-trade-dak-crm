'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Stack,
  Button,
  Chip,
  Alert,
  Card,
  CardContent,
  alpha,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Television,
  CheckCircle,
  Envelope,
  Phone,
  WhatsappLogo,
  Lock,
  Crown,
  Info,
  Calendar,
  Clock,
} from '@phosphor-icons/react';
import { MainNavbar } from '@/components/landing/main-navbar';
import { SubscriptionPlan } from '@/types/user';

interface Meeting {
  _id: string;
  title: string;
  scheduledAt: string;
  allowedSubscriptions?: string[];
  restrictedToSubscriptions?: boolean;
  meetingType: string;
}

interface NoAccessViewEnhancedProps {
  hasAccess: boolean;
  meetings: Meeting[];
  supportInfo: {
    email: string;
    phone: string;
    whatsapp: string;
  };
  userSubscriptions?: string[];
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

// Get required subscriptions for all meetings
const getRequiredSubscriptions = (meetings: Meeting[]): string[] => {
  const allSubscriptions = new Set<string>();
  
  meetings.forEach(meeting => {
    if (meeting.restrictedToSubscriptions && meeting.allowedSubscriptions) {
      meeting.allowedSubscriptions.forEach(sub => allSubscriptions.add(sub));
    }
  });
  
  // Also add default live subscriptions
  allSubscriptions.add('LiveWeeklyManual');
  allSubscriptions.add('LiveWeeklyRecurring');
  
  return Array.from(allSubscriptions);
};

export function NoAccessViewEnhanced({
  hasAccess,
  meetings,
  supportInfo,
  userSubscriptions = [],
}: NoAccessViewEnhancedProps) {
  const theme = useTheme();
  
  if (hasAccess) return null;
  
  const requiredSubscriptions = getRequiredSubscriptions(meetings);
  const upcomingMeetings = meetings
    .filter(m => new Date(m.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 3);

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

          {/* Required Subscriptions Alert */}
          <Alert 
            severity="info" 
            icon={<Lock size={24} />}
            sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            <Typography variant="body2" fontWeight={600} gutterBottom>
              To access live meetings, you need one of these subscriptions:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
              {requiredSubscriptions.map(sub => (
                <Chip
                  key={sub}
                  label={subscriptionDisplayNames[sub] || sub}
                  color="primary"
                  size="small"
                  sx={{ mb: 0.5 }}
                />
              ))}
            </Stack>
          </Alert>

          {/* Upcoming Meetings Preview */}
          {upcomingMeetings.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Upcoming Live Sessions You're Missing:
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {upcomingMeetings.map(meeting => (
                  <Grid item xs={12} md={4} key={meeting._id}>
                    <Card variant="outlined" sx={{ height: '100%', opacity: 0.8 }}>
                      <CardContent>
                        <Stack spacing={1}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {meeting.title}
                          </Typography>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Calendar size={14} />
                            <Typography variant="caption">
                              {new Date(meeting.scheduledAt).toLocaleDateString()}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Clock size={14} />
                            <Typography variant="caption">
                              {new Date(meeting.scheduledAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </Stack>
                          {meeting.restrictedToSubscriptions && meeting.allowedSubscriptions && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                Requires:
                              </Typography>
                              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                {meeting.allowedSubscriptions.map(sub => (
                                  <Chip
                                    key={sub}
                                    label={subscriptionDisplayNames[sub] || sub}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.65rem', height: 20 }}
                                  />
                                ))}
                              </Stack>
                            </Box>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        
          {/* Features */}
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
              What You'll Get Access To:
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

          {/* Subscription Options */}
          <Paper sx={{ p: 3, mb: 6, bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Choose Your Subscription Plan:
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Live Weekly Manual
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      $25<Typography component="span" variant="body2">/week</Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                      Manual renewal each week
                    </Typography>
                    <Button variant="outlined" fullWidth href="/academy/subscriptions/plans">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderColor: theme.palette.primary.main }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="h6" color="primary" gutterBottom>
                        Live Weekly Recurring
                      </Typography>
                      <Chip label="Save $5" size="small" color="success" />
                    </Stack>
                    <Typography variant="h4" fontWeight={700}>
                      $20<Typography component="span" variant="body2">/week</Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                      Auto-renewal with discount
                    </Typography>
                    <Button variant="contained" fullWidth href="/academy/subscriptions/plans">
                      Subscribe Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        
          {/* Contact Support */}
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
              href={`mailto:${supportInfo.email || 'support@daytradedak.com'}`}
            >
              Email Support
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Phone size={20} />}
              href={`tel:${supportInfo.phone || '+1 (555) 123-4567'}`}
            >
              Call Us
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<WhatsappLogo size={20} />}
              href={`https://wa.me/${supportInfo.whatsapp?.replace(/\D/g, '') || '15551234567'}`}
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