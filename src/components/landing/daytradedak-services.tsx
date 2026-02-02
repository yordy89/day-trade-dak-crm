'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme as useMuiTheme,
  Stack,
  Chip,
  alpha,
} from '@mui/material';
import {
  LiveTv,
  School,
  Groups,
  Psychology,
  VideoLibrary,
  EventAvailable,
  ArrowForward,
  Timer,
  TrendingUp,
  Language,
  CheckCircle,
} from '@mui/icons-material';
import Link from 'next/link';
import { useTheme } from '@/components/theme/theme-provider';
import { useTranslation } from 'react-i18next';

const getServices = (t: any) => [
  {
    icon: LiveTv,
    title: t('services.items.liveClasses.title'),
    description: t('services.items.liveClasses.description'),
    features: t('services.items.liveClasses.features', { returnObjects: true }),
    color: '#ef4444',
    href: '/live',
    badge: t('services.items.liveClasses.badge'),
  },
  {
    icon: VideoLibrary,
    title: t('services.items.videoCourses.title'),
    description: t('services.items.videoCourses.description'),
    features: t('services.items.videoCourses.features', { returnObjects: true }),
    color: '#3b82f6',
    href: '/academy/classes',
  },
  {
    icon: Groups,
    title: t('services.items.mentorships.title'),
    description: t('services.items.mentorships.description'),
    features: t('services.items.mentorships.features', { returnObjects: true }),
    color: '#16a34a',
    href: '/academy/masterclass',
  },
  {
    icon: School,
    title: t('services.items.masterCourse.title'),
    description: t('services.items.masterCourse.description'),
    features: t('services.items.masterCourse.features', { returnObjects: true }),
    color: '#8b5cf6',
    href: '/master-course',
    badge: t('services.items.masterCourse.badge'),
  },
  {
    icon: EventAvailable,
    title: t('services.items.communityEvents.title'),
    description: t('services.items.communityEvents.description'),
    features: t('services.items.communityEvents.features', { returnObjects: true }),
    color: '#f59e0b',
    href: '/community-event',
    badge: t('services.items.communityEvents.badge'),
  },
  {
    icon: Psychology,
    title: t('services.items.psychology.title'),
    description: t('services.items.psychology.description'),
    features: t('services.items.psychology.features', { returnObjects: true }),
    color: '#14b8a6',
    href: '/academy/psicotrading',
  },
];

export function DayTradeDakServices() {
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation('landing');
  // Filter out Master Course temporarily
  const services = getServices(t).filter(service => service.href !== '/master-course');

  return (
    <Box
      sx={{
        py: 12,
        position: 'relative',
        overflow: 'hidden',
        background: isDarkMode
          ? `linear-gradient(180deg, ${alpha('#0d1117', 1)} 0%, ${alpha('#161b22', 1)} 30%, ${alpha('#161b22', 1)} 70%, ${alpha('#0d1117', 1)} 100%)`
          : `linear-gradient(180deg, #ffffff 0%, ${alpha('#f8fafc', 1)} 30%, ${alpha('#f8fafc', 1)} 70%, #ffffff 100%)`,
      }}
    >
      {/* Decorative color accents */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: isDarkMode
            ? `radial-gradient(circle at 20% 30%, ${alpha('#16a34a', 0.08)} 0%, transparent 40%),
               radial-gradient(circle at 80% 70%, ${alpha('#3b82f6', 0.06)} 0%, transparent 40%)`
            : `radial-gradient(circle at 20% 30%, ${alpha('#16a34a', 0.05)} 0%, transparent 40%),
               radial-gradient(circle at 80% 70%, ${alpha('#3b82f6', 0.04)} 0%, transparent 40%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header - Asymmetric */}
        <Box sx={{ mb: 10, maxWidth: 800 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#16a34a',
              fontWeight: 600,
              letterSpacing: 1.5,
              mb: 2,
              display: 'block',
              ml: { xs: 0, md: 3 },
            }}
          >
            {t('services.label')}
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              color: muiTheme.palette.text.primary,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
            }}
          >
            {t('services.title')}{' '}
            <span style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {t('services.titleHighlight')}
            </span>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: muiTheme.palette.text.secondary,
              lineHeight: 1.8,
              ml: { xs: 0, md: 2 },
            }}
          >
            {t('services.subtitle')}
          </Typography>
        </Box>

        {/* Premium Zigzag Layout */}
        <Stack spacing={8}>
          {services.map((service, index) => {
            const Icon = service.icon;
            const isEven = index % 2 === 0;

            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: isEven ? 'row' : 'row-reverse' },
                  gap: { xs: 4, md: 6 },
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {/* Icon/Visual Side - Premium floating design */}
                <Box
                  sx={{
                    flex: '0 0 auto',
                    width: { xs: '100%', md: '35%' },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  {/* Large circular background with glass effect */}
                  <Box
                    sx={{
                      width: { xs: 200, md: 280 },
                      height: { xs: 200, md: 280 },
                      borderRadius: '50%',
                      background: isDarkMode
                        ? `linear-gradient(145deg, ${alpha(service.color, 0.15)} 0%, ${alpha(service.color, 0.05)} 100%)`
                        : `linear-gradient(145deg, ${alpha(service.color, 0.12)} 0%, ${alpha(service.color, 0.03)} 100%)`,
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      border: '2px solid',
                      borderColor: alpha(service.color, 0.25),
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: `0 20px 60px ${alpha(service.color, 0.15)}, inset 0 1px 0 ${alpha('#ffffff', 0.1)}`,
                      '&:hover': {
                        transform: 'scale(1.05)',
                        borderColor: service.color,
                        boxShadow: `0 30px 80px ${alpha(service.color, 0.3)}, inset 0 1px 0 ${alpha('#ffffff', 0.15)}`,
                      },
                    }}
                  >
                    {/* Icon container */}
                    <Box
                      sx={{
                        width: { xs: 100, md: 140 },
                        height: { xs: 100, md: 140 },
                        borderRadius: '28px',
                        background: `linear-gradient(135deg, ${service.color} 0%, ${alpha(service.color, 0.7)} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 20px 60px ${alpha(service.color, 0.4)}`,
                        border: '3px solid',
                        borderColor: alpha('#ffffff', 0.2),
                      }}
                    >
                      <Icon sx={{ fontSize: { xs: 50, md: 70 }, color: 'white' }} />
                    </Box>

                    {/* Badge if exists */}
                    {service.badge && (
                      <Chip
                        label={service.badge}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: { xs: 5, md: 15 },
                          right: { xs: 5, md: 15 },
                          background: `linear-gradient(135deg, ${service.color} 0%, ${alpha(service.color, 0.8)} 100%)`,
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          px: 1.5,
                          boxShadow: `0 4px 12px ${alpha(service.color, 0.4)}`,
                          border: '1px solid',
                          borderColor: alpha('#ffffff', 0.2),
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Content Side */}
                <Box sx={{ flex: 1 }}>
                  <Card
                    elevation={0}
                    sx={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      p: { xs: 0, md: 2 },
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      {/* Title */}
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          color: muiTheme.palette.text.primary,
                          fontSize: { xs: '1.8rem', md: '2.2rem' },
                        }}
                      >
                        {service.title}
                      </Typography>

                      {/* Description */}
                      <Typography
                        variant="body1"
                        sx={{
                          color: muiTheme.palette.text.secondary,
                          mb: 3,
                          lineHeight: 1.8,
                          fontSize: '1.1rem',
                        }}
                      >
                        {service.description}
                      </Typography>

                      {/* Features - Checkmark list */}
                      <Stack spacing={1.5} sx={{ mb: 4 }}>
                        {service.features.map((feature: string, idx: number) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <CheckCircle
                              sx={{
                                fontSize: 20,
                                color: service.color,
                                mt: 0.3,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              sx={{ lineHeight: 1.6 }}
                            >
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>

                      {/* CTA Button */}
                      <Button
                        component={Link}
                        href={service.href}
                        variant="outlined"
                        endIcon={<ArrowForward />}
                        sx={{
                          borderColor: service.color,
                          color: service.color,
                          borderWidth: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '1rem',
                          px: 4,
                          py: 1.5,
                          borderRadius: '12px',
                          '&:hover': {
                            borderColor: service.color,
                            borderWidth: 2,
                            backgroundColor: `${service.color}15`,
                            transform: 'translateX(8px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {t('services.cta.learnMore')}
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            );
          })}
        </Stack>

        {/* Platform Features - Premium Cards at Bottom */}
        <Box sx={{ mt: 12 }}>
          <Grid container spacing={3}>
            {[
              {
                icon: Timer,
                color: '#16a34a',
                title: t('services.platformFeatures.flexibleSchedule.title'),
                description: t('services.platformFeatures.flexibleSchedule.description'),
                offset: -10,
              },
              {
                icon: TrendingUp,
                color: '#3b82f6',
                title: 'Live Market Analysis',
                description: 'Access to professional real-time analysis',
                offset: 10,
              },
              {
                icon: Language,
                color: '#f59e0b',
                title: t('services.platformFeatures.spanishContent.title'),
                description: t('services.platformFeatures.spanishContent.description'),
                offset: -5,
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      background: isDarkMode
                        ? `linear-gradient(145deg, ${alpha(feature.color, 0.1)} 0%, ${alpha('#0d1117', 0.95)} 100%)`
                        : `linear-gradient(145deg, ${alpha(feature.color, 0.08)} 0%, #ffffff 100%)`,
                      border: '1px solid',
                      borderColor: alpha(feature.color, 0.25),
                      borderRadius: '20px',
                      transform: { xs: 'none', md: `translateY(${feature.offset}px)` },
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: `0 10px 30px ${alpha(feature.color, 0.1)}`,
                      '&:hover': {
                        transform: { md: `translateY(${feature.offset - 8}px) scale(1.02)` },
                        borderColor: feature.color,
                        boxShadow: `0 20px 50px ${alpha(feature.color, 0.25)}`,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`,
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2.5} alignItems="center">
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '16px',
                          background: `linear-gradient(135deg, ${feature.color} 0%, ${alpha(feature.color, 0.7)} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 8px 24px ${alpha(feature.color, 0.35)}`,
                          flexShrink: 0,
                        }}
                      >
                        <Icon sx={{ fontSize: 28, color: 'white' }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5, color: muiTheme.palette.text.primary }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {feature.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}