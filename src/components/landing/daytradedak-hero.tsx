'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Chip,
  useTheme as useMuiTheme,
  Stack,
  alpha,
} from '@mui/material';
import {
  PlayCircleOutline,
  School,
  CalendarMonth,
  VideoLibrary,
  LiveTv,
  Groups,
  Language,
} from '@mui/icons-material';
import Link from 'next/link';
import { useTheme } from '@/components/theme/theme-provider';
import { useTranslation } from 'react-i18next';
import { HeroStockTable } from './hero-stock-table';

export function DayTradeDakHero() {
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation('landing');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: muiTheme.palette.background.default,
        pt: { xs: '120px', md: '130px' },
        pb: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Trading Chart Pattern Background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: isDarkMode ? 0.05 : 0.03,
          backgroundImage: 'url("/assets/trading-pattern.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Bottom gradient fade for smooth transition to next section */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: isDarkMode
            ? `linear-gradient(to bottom, transparent 0%, #0d1117 100%)`
            : `linear-gradient(to bottom, transparent 0%, #ffffff 100%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center" sx={{ minHeight: { xs: 'calc(100vh - 70px)', md: 'calc(100vh - 80px)' } }}>
          {/* Left Content */}
          <Grid item xs={12} lg={7}>
            <Box>
              {/* Badge */}
              <Chip
                label={t('hero.badge')}
                sx={{
                  mb: 3,
                  backgroundColor: 'rgba(22, 163, 74, 0.1)',
                  color: '#16a34a',
                  border: '1px solid rgba(22, 163, 74, 0.3)',
                  fontWeight: 600,
                }}
              />

              {/* Main Heading */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  mb: 3,
                  color: muiTheme.palette.text.primary,
                }}
              >
                {t('hero.title')}{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {t('hero.titleHighlight')}
                </span>
              </Typography>

              {/* Subheading */}
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: muiTheme.palette.text.secondary,
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                {t('hero.subtitle')}
              </Typography>

              {/* CTA Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 6 }}>
                <Button
                  component={Link}
                  href="/auth/sign-up"
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 15px 0 rgba(22, 163, 74, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px 0 rgba(22, 163, 74, 0.6)',
                    },
                  }}
                >
                  {t('hero.cta.startLearning')}
                </Button>
                <Button
                  component={Link}
                  href="/community-event"
                  variant="outlined"
                  size="large"
                  startIcon={<School />}
                  sx={{
                    borderColor: '#16a34a',
                    color: '#16a34a',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#15803d',
                      backgroundColor: 'rgba(22, 163, 74, 0.1)',
                    },
                  }}
                >
                  Ver Evento Comunidad
                </Button>
              </Stack>

              {/* Premium Stats Cards with Icons */}
              <Grid container spacing={2}>
                {[
                  {
                    icon: VideoLibrary,
                    value: t('hero.stats.videoCourses_value'),
                    label: t('hero.stats.videoCourses'),
                    color: '#3b82f6',
                  },
                  {
                    icon: LiveTv,
                    value: t('hero.stats.liveClasses_value'),
                    label: t('hero.stats.liveClasses'),
                    color: '#ef4444',
                  },
                  {
                    icon: Groups,
                    value: t('hero.stats.mentorships_value'),
                    label: t('hero.stats.mentorships'),
                    color: '#8b5cf6',
                  },
                  {
                    icon: Language,
                    value: t('hero.stats.courseLanguage_value'),
                    label: t('hero.stats.courseLanguage'),
                    color: '#16a34a',
                  },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Grid item xs={6} sm={3} key={index}>
                      <Card
                        elevation={0}
                        sx={{
                          p: 2.5,
                          textAlign: 'center',
                          position: 'relative',
                          overflow: 'hidden',
                          background: isDarkMode
                            ? `linear-gradient(145deg, ${alpha(stat.color, 0.1)} 0%, ${alpha('#0d1117', 0.9)} 100%)`
                            : `linear-gradient(145deg, ${alpha(stat.color, 0.08)} 0%, #ffffff 100%)`,
                          border: '1px solid',
                          borderColor: alpha(stat.color, 0.2),
                          borderRadius: '20px',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: `0 8px 24px ${alpha(stat.color, 0.1)}`,
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: `0 16px 40px ${alpha(stat.color, 0.25)}`,
                            borderColor: stat.color,
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
                          },
                        }}
                      >
                        {/* Icon */}
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '12px',
                            background: `linear-gradient(135deg, ${stat.color} 0%, ${alpha(stat.color, 0.7)} 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 1.5,
                            boxShadow: `0 6px 16px ${alpha(stat.color, 0.35)}`,
                          }}
                        >
                          <Icon sx={{ fontSize: 24, color: 'white' }} />
                        </Box>
                        <Typography
                          variant="h4"
                          fontWeight="bold"
                          sx={{
                            background: `linear-gradient(135deg, ${stat.color} 0%, ${alpha(stat.color, 0.7)} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5,
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {stat.label}
                        </Typography>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Grid>

          {/* Right Content - Stock Table Only */}
          <Grid item xs={12} lg={5}>
            {/* Live Market Stock Table */}
            <HeroStockTable />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
