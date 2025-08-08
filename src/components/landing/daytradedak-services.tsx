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
    href: '/academy/overview',
  },
  {
    icon: Groups,
    title: t('services.items.mentorships.title'),
    description: t('services.items.mentorships.description'),
    features: t('services.items.mentorships.features', { returnObjects: true }),
    color: '#16a34a',
    href: '/academy/mentorship',
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
  const services = getServices(t);

  return (
    <Box
      sx={{
        py: 10,
        backgroundColor: muiTheme.palette.background.paper,
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#16a34a',
              fontWeight: 600,
              letterSpacing: 1.5,
              mb: 2,
              display: 'block',
            }}
          >
            {t('services.label')}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 3,
              color: muiTheme.palette.text.primary,
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
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.8,
            }}
          >
            {t('services.subtitle')}
          </Typography>
        </Box>

        {/* Services Grid */}
        <Grid container spacing={4}>
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    backgroundColor: muiTheme.palette.background.paper,
                    border: '1px solid',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: isDarkMode
                        ? '0 20px 40px rgba(0, 0, 0, 0.5)'
                        : '0 20px 40px rgba(0, 0, 0, 0.1)',
                      borderColor: service.color,
                      '& .service-icon': {
                        backgroundColor: service.color,
                        color: 'white',
                      },
                    },
                  }}
                >
                  {service.badge && (
                    <Chip
                      label={service.badge}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: 20,
                        backgroundColor: service.color,
                        color: 'white',
                        fontWeight: 600,
                        zIndex: 1,
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 4 }}>
                    {/* Icon */}
                    <Box
                      className="service-icon"
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        backgroundColor: `${service.color}20`,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Icon sx={{ fontSize: 32, color: service.color }} />
                    </Box>

                    {/* Content */}
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: muiTheme.palette.text.primary,
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: muiTheme.palette.text.secondary,
                        mb: 3,
                        lineHeight: 1.8,
                      }}
                    >
                      {service.description}
                    </Typography>

                    {/* Features */}
                    <Stack spacing={1} sx={{ mb: 3 }}>
                      {service.features.map((feature: string, idx: number) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: service.color,
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    {/* Link */}
                    <Button
                      component={Link}
                      href={service.href}
                      endIcon={<ArrowForward />}
                      sx={{
                        color: service.color,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: `${service.color}10`,
                        },
                      }}
                    >
                      {t('services.cta.learnMore')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Platform Features */}
        <Box sx={{ mt: 8, p: 4, backgroundColor: isDarkMode ? 'rgba(22, 163, 74, 0.1)' : 'rgba(22, 163, 74, 0.05)', borderRadius: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Timer sx={{ fontSize: 40, color: '#16a34a' }} />
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    {t('services.platformFeatures.flexibleSchedule.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('services.platformFeatures.flexibleSchedule.description')}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: '#16a34a' }} />
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    Análisis de Mercado en Vivo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Acceso a análisis profesional en tiempo real
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Groups sx={{ fontSize: 40, color: '#16a34a' }} />
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    {t('services.platformFeatures.spanishContent.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('services.platformFeatures.spanishContent.description')}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}