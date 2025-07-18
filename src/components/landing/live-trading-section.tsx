'use client';

import React, { useState, useEffect } from 'react';
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
  Avatar,
  AvatarGroup,
  LinearProgress,
} from '@mui/material';
import {
  LiveTv,
  Circle,
  TrendingUp,
  Timer,
  Groups,
} from '@mui/icons-material';
import Link from 'next/link';
import { useTheme } from '@/components/theme/theme-provider';
import { useTranslation } from 'react-i18next';

interface LiveSession {
  id: string;
  title: string;
  trader: string;
  avatar: string;
  viewers: number;
  profit: number;
  status: 'live' | 'upcoming' | 'ended';
  time: string;
  description: string;
}

const getLiveSessions = (t: any): LiveSession[] => [
  {
    id: '1',
    title: t('liveTrading.sessions.morning.title'),
    trader: 'Michael Chen',
    avatar: '/assets/avatar-1.png',
    viewers: 1247,
    profit: 12.5,
    status: 'live',
    time: 'Live Now',
    description: t('liveTrading.sessions.morning.description'),
  },
  {
    id: '2',
    title: t('liveTrading.sessions.options.title'),
    trader: 'Sarah Williams',
    avatar: '/assets/avatar-2.png',
    viewers: 856,
    profit: 8.3,
    status: 'upcoming',
    time: 'Starts in 2 hours',
    description: t('liveTrading.sessions.options.description'),
  },
  {
    id: '3',
    title: t('liveTrading.sessions.crypto.title'),
    trader: 'Alex Rodriguez',
    avatar: '/assets/avatar-3.png',
    viewers: 2103,
    profit: 15.7,
    status: 'ended',
    time: 'Ended 1 hour ago',
    description: t('liveTrading.sessions.crypto.description'),
  },
];

export function LiveTradingSection() {
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation('landing');
  const [currentViewers, setCurrentViewers] = useState(3542);
  const liveSessions = getLiveSessions(t);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentViewers((prev) => prev + Math.floor(Math.random() * 10 - 5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        py: 10,
        backgroundColor: muiTheme.palette.background.default,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          opacity: isDarkMode ? 0.05 : 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 L50 0 L100 50 L50 100 Z' fill='%2316a34a' /%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} lg={5}>
            <Box>
              <Chip
                icon={<Circle sx={{ fontSize: '12px !important', color: '#ef4444' }} />}
                label={t('liveTrading.label')}
                sx={{
                  mb: 3,
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  fontWeight: 600,
                  animation: 'pulse 2s infinite',
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
                {t('liveTrading.title')}{' '}
                <span style={{ 
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {t('liveTrading.titleHighlight')}
                </span>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  color: muiTheme.palette.text.secondary,
                  lineHeight: 1.8,
                }}
              >
                {t('liveTrading.subtitle')}
              </Typography>

              {/* Stats */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#16a34a' }}>
                      {currentViewers.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('liveTrading.stats.viewers')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#16a34a' }}>
                      92%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('liveTrading.stats.profitableSessions')}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Button
                component={Link}
                href="/live"
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
                {t('liveTrading.cta')}
              </Button>
            </Box>
          </Grid>

          {/* Right Content - Live Sessions */}
          <Grid item xs={12} lg={7}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {liveSessions.map((session) => (
                <Card
                  key={session.id}
                  elevation={0}
                  sx={{
                    backgroundColor: muiTheme.palette.background.paper,
                    border: '1px solid',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#16a34a',
                      transform: 'translateX(8px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      {/* Avatar */}
                      <Avatar
                        src={session.avatar}
                        sx={{ width: 64, height: 64 }}
                      />

                      {/* Content */}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Typography variant="h6" fontWeight="600">
                            {session.title}
                          </Typography>
                          {session.status === 'live' && (
                            <Chip
                              label={t('liveTrading.status.live').replace(' Ahora', '')}
                              size="small"
                              sx={{
                                backgroundColor: '#ef4444',
                                color: 'white',
                                fontWeight: 600,
                                animation: 'pulse 2s infinite',
                              }}
                            />
                          )}
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {session.description}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Groups fontSize="small" color="action" />
                            <Typography variant="body2">
                              {session.viewers.toLocaleString()} {t('liveTrading.status.viewers')}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUp fontSize="small" sx={{ color: '#16a34a' }} />
                            <Typography variant="body2" sx={{ color: '#16a34a' }}>
                              +{session.profit}% {t('liveTrading.status.profit')}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Timer fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {session.time}
                            </Typography>
                          </Box>
                        </Box>

                        {session.status === 'live' && (
                          <LinearProgress
                            variant="indeterminate"
                            sx={{
                              mt: 2,
                              height: 2,
                              backgroundColor: 'rgba(239, 68, 68, 0.2)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#ef4444',
                              },
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Active Traders */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <AvatarGroup max={4}>
                  <Avatar src="/assets/avatar-4.png" />
                  <Avatar src="/assets/avatar-5.png" />
                  <Avatar src="/assets/avatar-6.png" />
                  <Avatar src="/assets/avatar-7.png" />
                  <Avatar>+50</Avatar>
                </AvatarGroup>
                <Typography variant="body2" color="text.secondary">
                  {t('liveTrading.joinMessage', { count: 50 })}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}