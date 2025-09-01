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
} from '@mui/material';
import { 
  PlayCircleOutline,
  School,
  CalendarMonth,
  VideoLibrary,
  LiveTv,
} from '@mui/icons-material';
import Link from 'next/link';
import CountUp from 'react-countup';
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
        pt: { xs: '120px', md: '130px' }, // Updated: Mobile (36px TopBar + 56px Navbar + 28px padding) | Desktop (36px TopBar + 80px Navbar + 14px padding)
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

              {/* Real Platform Stats */}
              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#16a34a' }}>
                      {t('hero.stats.videoCourses_value')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('hero.stats.videoCourses')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#16a34a' }}>
                      {t('hero.stats.liveClasses_value')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('hero.stats.liveClasses')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#16a34a' }}>
                      {t('hero.stats.mentorships_value')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('hero.stats.mentorships')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#16a34a' }}>
                      {t('hero.stats.courseLanguage_value')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('hero.stats.courseLanguage')}
                    </Typography>
                  </Box>
                </Grid>
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