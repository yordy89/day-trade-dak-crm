'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme as useMuiTheme,
  Button,
  Chip,
  Stack,
  Avatar,
  Divider,
  alpha,
} from '@mui/material';
import {
  LiveTv,
  Circle,
  Schedule,
  Groups,
  TrendingUp,
  ArrowForward,
  CalendarMonth,
  AccessTime,
} from '@mui/icons-material';
import Link from 'next/link';
import { useTheme } from '@/components/theme/theme-provider';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useClientAuth } from '@/hooks/use-client-auth';
import { SubscriptionPlan } from '@/types/user';

const getClassFeatures = (t: any) => [
  {
    icon: LiveTv,
    title: t('liveClasses.features.liveMarketAnalysis.title'),
    description: t('liveClasses.features.liveMarketAnalysis.description'),
  },
  {
    icon: Groups,
    title: t('liveClasses.features.interactiveSessions.title'),
    description: t('liveClasses.features.interactiveSessions.description'),
  },
  {
    icon: TrendingUp,
    title: t('liveClasses.features.tradeAlong.title'),
    description: t('liveClasses.features.tradeAlong.description'),
  },
  {
    icon: CalendarMonth,
    title: t('liveClasses.features.consistentSchedule.title'),
    description: t('liveClasses.features.consistentSchedule.description'),
  },
];

export function DayTradeDakLiveClasses() {
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation('landing');
  const router = useRouter();
  const { isAuthenticated } = useClientAuth();

  const classFeatures = getClassFeatures(t);
  
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const currentHour = new Date().getHours();
  const isLiveNow = currentHour >= 9 && currentHour < 11 && !['Saturday', 'Sunday'].includes(currentDay);

  const handleSubscribeClick = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL that includes the highlight parameter
      const returnUrl = `/academy/subscription/plans?highlight=${SubscriptionPlan.LiveWeeklyRecurring}`;
      router.push(`/auth/sign-in?returnUrl=${encodeURIComponent(returnUrl)}`);
    } else {
      // Redirect directly to subscription plans with highlight parameter
      router.push(`/academy/subscription/plans?highlight=${SubscriptionPlan.LiveWeeklyRecurring}`);
    }
  };

  const handleViewLiveClasses = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL to live classes
      router.push(`/auth/sign-in?returnUrl=${encodeURIComponent('/live')}`);
    } else {
      // Redirect directly to live classes
      router.push('/live');
    }
  };

  return (
    <Box
      sx={{
        py: 10,
        position: 'relative',
        overflow: 'hidden',
        background: isDarkMode
          ? `linear-gradient(180deg, #0d1117 0%, ${alpha('#161b22', 1)} 30%, ${alpha('#161b22', 1)} 70%, #0d1117 100%)`
          : `linear-gradient(180deg, #ffffff 0%, #f8fafc 30%, #f8fafc 70%, #ffffff 100%)`,
      }}
    >
      {/* Decorative accent */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: isDarkMode
            ? `radial-gradient(ellipse at 30% 40%, ${alpha('#ef4444', 0.08)} 0%, transparent 50%),
               radial-gradient(ellipse at 70% 60%, ${alpha('#f59e0b', 0.06)} 0%, transparent 50%)`
            : `radial-gradient(ellipse at 30% 40%, ${alpha('#ef4444', 0.05)} 0%, transparent 50%),
               radial-gradient(ellipse at 70% 60%, ${alpha('#f59e0b', 0.04)} 0%, transparent 50%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip
            icon={<Circle sx={{ fontSize: '12px !important', color: '#ef4444' }} />}
            label={isLiveNow ? t('liveClasses.badgeLive') : t('liveClasses.badge')}
            sx={{
              mb: 3,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontWeight: 600,
              animation: isLiveNow ? 'pulse 2s infinite' : 'none',
            }}
          />
          
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 3,
              color: muiTheme.palette.text.primary,
            }}
          >
            {t('liveClasses.title')}{' '}
            <span style={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {t('liveClasses.titleHighlight')}
            </span>
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: muiTheme.palette.text.secondary,
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.8,
            }}
          >
            {t('liveClasses.subtitle')}
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {classFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    }}
                  >
                    <Icon sx={{ fontSize: 40, color: '#ef4444' }} />
                  </Box>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {/* Weekly Schedule - Professional Design */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <Schedule sx={{ fontSize: 36, color: '#ef4444' }} />
              <Typography variant="h4" fontWeight="700">
                {t('liveClasses.weeklySchedule.title')}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {t('liveClasses.weeklySchedule.subtitle')}
            </Typography>
          </Box>

          {/* Daily Trading Sessions */}
          <Card
            elevation={0}
            sx={{
              backgroundColor: muiTheme.palette.background.paper,
              border: '2px solid',
              borderColor: '#ef4444',
              borderRadius: 3,
              overflow: 'hidden',
              mb: 4,
              position: 'relative',
            }}
          >
            {/* Live Badge */}
            {isLiveNow && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 10,
                }}
              >
                <Chip
                  icon={<Circle sx={{ fontSize: '12px !important', color: '#ef4444' }} />}
                  label="EN VIVO AHORA"
                  sx={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontWeight: 600,
                    animation: 'pulse 2s infinite',
                  }}
                />
              </Box>
            )}
            
            <Box sx={{ p: 4 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" fontWeight="700" sx={{ mb: 2, color: '#ef4444' }}>
                      {t('liveClasses.weeklySchedule.dailySession.title')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<CalendarMonth sx={{ fontSize: 18 }} />}
                        label={t('liveClasses.weeklySchedule.dailySession.days')}
                        sx={{
                          backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        icon={<AccessTime sx={{ fontSize: 18 }} />}
                        label={t('liveClasses.weeklySchedule.morningTime')}
                        sx={{
                          backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#16a34a',
                          mt: 0.8,
                          flexShrink: 0,
                        }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="600">
                          8:45 AM - {t('liveClasses.weeklySchedule.dailySession.preMarket')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('liveClasses.weeklySchedule.dailySession.preMarketDesc')}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#ef4444',
                          mt: 0.8,
                          flexShrink: 0,
                        }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="600">
                          9:30 AM - {t('liveClasses.weeklySchedule.dailySession.marketOpen')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('liveClasses.weeklySchedule.dailySession.marketOpenDesc')}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#3b82f6',
                          mt: 0.8,
                          flexShrink: 0,
                        }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="600">
                          10:00 AM - {t('liveClasses.weeklySchedule.dailySession.qa')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('liveClasses.weeklySchedule.dailySession.qaDesc')}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LiveTv sx={{ fontSize: 120, color: '#ef4444', opacity: 0.1 }} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Card>

          {/* Special Sessions */}
          <Typography variant="h5" fontWeight="700" sx={{ mb: 3, textAlign: 'center' }}>
            {t('liveClasses.weeklySchedule.specialSessions.title')}
          </Typography>
          
          <Grid container spacing={3}>
            {/* Monday Mentorship */}
            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  backgroundColor: muiTheme.palette.background.paper,
                  border: '1px solid',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#8b5cf6',
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px ${alpha('#8b5cf6', 0.15)}`,
                  },
                }}
              >
                <Box sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: alpha('#8b5cf6', 0.1),
                      }}
                    >
                      <Groups sx={{ fontSize: 32, color: '#8b5cf6' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="700">
                        {t('liveClasses.weeklySchedule.sessions.mentorship.title')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('liveClasses.weeklySchedule.days.monday')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">•</Typography>
                        <Typography variant="body2" fontWeight="600" color="#8b5cf6">
                          {t('liveClasses.weeklySchedule.afternoonTime')}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('liveClasses.weeklySchedule.sessions.mentorship.description')}
                  </Typography>
                </Box>
              </Card>
            </Grid>

            {/* Friday YouTube Live */}
            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  backgroundColor: muiTheme.palette.background.paper,
                  border: '1px solid',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#dc2626',
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px ${alpha('#dc2626', 0.15)}`,
                  },
                }}
              >
                <Box sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: alpha('#dc2626', 0.1),
                      }}
                    >
                      <LiveTv sx={{ fontSize: 32, color: '#dc2626' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="700">
                        {t('liveClasses.weeklySchedule.sessions.youtubeLive.title')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('liveClasses.weeklySchedule.days.friday')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">•</Typography>
                        <Typography variant="body2" fontWeight="600" color="#dc2626">
                          {t('liveClasses.weeklySchedule.youtubeTime')}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('liveClasses.weeklySchedule.sessions.youtubeLive.description')}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center">
            <Button
              onClick={handleViewLiveClasses}
              variant="contained"
              size="large"
              startIcon={<LiveTv />}
              sx={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                },
              }}
            >
              {isLiveNow ? t('liveClasses.cta.joinLiveClassNow') : t('liveClasses.cta.viewLiveClasses')}
            </Button>
            <Button
              onClick={handleSubscribeClick}
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                borderColor: '#ef4444',
                color: '#ef4444',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#dc2626',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                },
              }}
            >
              {t('liveClasses.cta.subscribe')}
            </Button>
          </Stack>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            {t('liveClasses.footer')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}