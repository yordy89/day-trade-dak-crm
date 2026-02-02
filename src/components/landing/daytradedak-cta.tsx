'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme as useMuiTheme,
  Stack,
  Grid,
  Card,
  alpha,
} from '@mui/material';
import {
  RocketLaunch,
  School,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';
import Link from 'next/link';
import { useTheme } from '@/components/theme/theme-provider';
import { useTranslation } from 'react-i18next';


export function DayTradeDakCTA() {
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation('landing');
  
  const benefits = t('cta.benefits', { returnObjects: true }) as string[];

  return (
    <Box
      sx={{
        pt: 10,
        pb: 0,
        position: 'relative',
        overflow: 'hidden',
        background: isDarkMode
          ? `linear-gradient(180deg, #0d1117 0%, ${alpha('#161b22', 1)} 40%, ${alpha('#161b22', 1)} 100%)`
          : `linear-gradient(180deg, #ffffff 0%, #f8fafc 40%, #f8fafc 100%)`,
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
            ? `radial-gradient(ellipse at 50% 50%, ${alpha('#16a34a', 0.1)} 0%, transparent 50%)`
            : `radial-gradient(ellipse at 50% 50%, ${alpha('#16a34a', 0.06)} 0%, transparent 50%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Card
          elevation={0}
          sx={{
            backgroundColor: muiTheme.palette.background.paper,
            border: '2px solid',
            borderColor: '#16a34a',
            borderRadius: 4,
            overflow: 'hidden',
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, rgba(21, 128, 61, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(22, 163, 74, 0.05) 0%, rgba(21, 128, 61, 0.02) 100%)',
          }}
        >
          <Box sx={{ p: { xs: 4, md: 8 } }}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} lg={6}>
                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      mb: 3,
                      fontSize: { xs: '2rem', md: '3rem' },
                      lineHeight: 1.2,
                    }}
                  >
                    {t('cta.title')}{' '}
                    <span style={{ 
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      {t('cta.titleHighlight')}
                    </span>
                  </Typography>
                  
                  <Typography
                    variant="h6"
                    sx={{
                      color: muiTheme.palette.text.secondary,
                      mb: 4,
                      lineHeight: 1.8,
                    }}
                  >
                    {t('cta.subtitle')}
                  </Typography>

                  <Stack spacing={2} sx={{ mb: 4 }}>
                    {benefits.map((benefit, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckCircle sx={{ color: '#16a34a', fontSize: 20 }} />
                        <Typography variant="body1">
                          {benefit}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                      component={Link}
                      href="/auth/sign-up"
                      variant="contained"
                      size="large"
                      startIcon={<RocketLaunch />}
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
                      {t('cta.buttons.getStartedToday')}
                    </Button>
                    <Button
                      component={Link}
                      href="/community-event"
                      variant="outlined"
                      size="large"
                      endIcon={<School />}
                      sx={{
                        borderColor: '#16a34a',
                        color: '#16a34a',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderWidth: 2,
                        '&:hover': {
                          borderColor: '#15803d',
                          backgroundColor: 'rgba(22, 163, 74, 0.1)',
                          borderWidth: 2,
                        },
                      }}
                    >
                      Ver Evento Comunidad
                    </Button>
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} lg={6}>
                <Box
                  sx={{
                    position: 'relative',
                    textAlign: 'center',
                  }}
                >
                  {/* Stats Cards */}
                  <Stack spacing={3}>
                    <Card
                      elevation={0}
                      sx={{
                        backgroundColor: muiTheme.palette.background.paper,
                        border: '1px solid',
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'left',
                      }}
                    >
                      <Typography variant="h4" fontWeight="800" sx={{ color: '#16a34a', mb: 1 }}>
                        {t('cta.statsCards.noHiddenFees.title')}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {t('cta.statsCards.noHiddenFees.description')}
                      </Typography>
                    </Card>

                    <Card
                      elevation={0}
                      sx={{
                        backgroundColor: muiTheme.palette.background.paper,
                        border: '1px solid',
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'left',
                      }}
                    >
                      <Typography variant="h4" fontWeight="800" sx={{ color: '#16a34a', mb: 1 }}>
                        {t('cta.statsCards.startToday.title')}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {t('cta.statsCards.startToday.description')}
                      </Typography>
                    </Card>

                    <Card
                      elevation={0}
                      sx={{
                        backgroundColor: muiTheme.palette.background.paper,
                        border: '1px solid',
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'left',
                      }}
                    >
                      <Typography variant="h4" fontWeight="800" sx={{ color: '#16a34a', mb: 1 }}>
                        {t('cta.statsCards.expertSupport.title')}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {t('cta.statsCards.expertSupport.description')}
                      </Typography>
                    </Card>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card>

        {/* Questions Section */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {t('cta.questions.text')}
          </Typography>
          <Button
            component={Link}
            href="/contact"
            variant="text"
            endIcon={<ArrowForward />}
            sx={{
              color: '#16a34a',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
              },
            }}
          >
            {t('cta.questions.contact')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}