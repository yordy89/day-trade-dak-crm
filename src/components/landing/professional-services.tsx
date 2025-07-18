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
} from '@mui/material';
import {
  TrendingUp,
  School,
  Groups,
  Psychology,
  AutoGraph,
  MenuBook,
  ArrowForward,
} from '@mui/icons-material';
import Link from 'next/link';
import { useTheme } from '@/components/theme/theme-provider';
import { useTranslation } from 'react-i18next';

const getServices = (t: any) => [
  {
    icon: TrendingUp,
    title: t('services.items.signals.title'),
    description: t('services.items.signals.description'),
    color: '#16a34a',
    href: '/signals',
  },
  {
    icon: School,
    title: t('services.items.academy.title'),
    description: t('services.items.academy.description'),
    color: '#3b82f6',
    href: '/academy/live-sessions',
  },
  {
    icon: Groups,
    title: t('services.items.masterClasses.title'),
    description: t('services.items.masterClasses.description'),
    color: '#8b5cf6',
    href: '/academy/masterclass',
  },
  {
    icon: Psychology,
    title: t('services.items.psychology.title'),
    description: t('services.items.psychology.description'),
    color: '#f59e0b',
    href: '/academy/psicotrading',
  },
  {
    icon: AutoGraph,
    title: t('services.items.analysis.title'),
    description: t('services.items.analysis.description'),
    color: '#ef4444',
    href: '/analysis',
  },
  {
    icon: MenuBook,
    title: t('services.items.library.title'),
    description: t('services.items.library.description'),
    color: '#14b8a6',
    href: '/academy/books',
  },
];

export function ProfessionalServices() {
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

        {/* Bottom CTA */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" sx={{ mb: 3, color: muiTheme.palette.text.secondary }}>
            {t('services.cta.assessment')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: 'white',
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
              },
            }}
          >
            {t('services.cta.takeAssessment')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}