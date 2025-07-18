'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  ArrowForward,
  CheckCircle,
  TrendingUp,
  Timer,
  School,
} from '@mui/icons-material';
import Link from 'next/link';
import { useTheme } from '@/components/theme/theme-provider';
import { useTranslation } from 'react-i18next';

export function CallToAction() {
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation('landing');

  const benefits = [
    t('cta.badges.0'),
    t('cta.badges.1'),
    t('cta.badges.2'),
    t('cta.badges.3'),
  ];

  return (
    <Box
      sx={{
        py: 10,
        backgroundColor: muiTheme.palette.background.paper,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Gradient */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: isDarkMode
            ? 'radial-gradient(circle at 20% 50%, rgba(22, 163, 74, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 50%, rgba(22, 163, 74, 0.05) 0%, transparent 50%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: isDarkMode
            ? 'radial-gradient(circle at 80% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 80% 50%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} lg={6}>
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  color: muiTheme.palette.text.primary,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
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
                variant="h5"
                sx={{
                  mb: 4,
                  color: muiTheme.palette.text.secondary,
                  fontWeight: 400,
                  lineHeight: 1.8,
                }}
              >
                {t('cta.subtitle')}
              </Typography>

              {/* Benefits */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {benefits.map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle sx={{ color: '#16a34a', fontSize: 20 }} />
                      <Typography variant="body1">{benefit}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* CTA Buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href="/auth/sign-up"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
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
                  {t('cta.buttons.startTrial')}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
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
                  {t('cta.buttons.viewPricing')}
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right Content - Stats */}
          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                backgroundColor: isDarkMode ? 'rgba(22, 163, 74, 0.1)' : 'rgba(22, 163, 74, 0.05)',
                borderRadius: 3,
                p: 4,
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(22, 163, 74, 0.3)' : 'rgba(22, 163, 74, 0.2)',
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <TrendingUp sx={{ fontSize: 40, color: '#16a34a', mb: 2 }} />
                    <Typography variant="h3" fontWeight="800" sx={{ color: '#16a34a' }}>
                      {t('cta.stats.successRate.value')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {t('cta.stats.successRate.label')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Timer sx={{ fontSize: 40, color: '#16a34a', mb: 2 }} />
                    <Typography variant="h3" fontWeight="800" sx={{ color: '#16a34a' }}>
                      {t('cta.stats.support.value')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {t('cta.stats.support.label')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <School sx={{ fontSize: 40, color: '#16a34a', mb: 2 }} />
                    <Typography variant="h3" fontWeight="800" sx={{ color: '#16a34a' }}>
                      {t('cta.stats.lessons.value')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {t('cta.stats.lessons.label')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CheckCircle sx={{ fontSize: 40, color: '#16a34a', mb: 2 }} />
                    <Typography variant="h3" fontWeight="800" sx={{ color: '#16a34a' }}>
                      {t('cta.stats.traders.value')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {t('cta.stats.traders.label')}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Testimonial */}
            <Box
              sx={{
                mt: 3,
                p: 3,
                backgroundColor: muiTheme.palette.background.default,
                borderRadius: 2,
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontStyle: 'italic',
                  mb: 2,
                  color: muiTheme.palette.text.secondary,
                }}
              >
                &quot;{t('cta.testimonial.quote')}&quot;
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {t('cta.testimonial.author')}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Newsletter Signup */}
        <Box
          sx={{
            mt: 8,
            p: 4,
            backgroundColor: muiTheme.palette.background.default,
            borderRadius: 3,
            textAlign: 'center',
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography variant="h5" fontWeight="700" sx={{ mb: 2 }}>
            {t('cta.newsletter.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t('cta.newsletter.subtitle')}
          </Typography>
          <Box
            component="form"
            sx={{
              display: 'flex',
              gap: 2,
              maxWidth: 500,
              mx: 'auto',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <TextField
              fullWidth
              placeholder={t('cta.newsletter.placeholder')}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: muiTheme.palette.background.paper,
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: 'white',
                px: 4,
                whiteSpace: 'nowrap',
                '&:hover': {
                  background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                },
              }}
            >
              {t('cta.newsletter.button')}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}