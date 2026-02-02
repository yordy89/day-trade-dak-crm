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
} from '@mui/material';
import { 
  TrendingUp, 
  School, 
  MenuBook, 
  Groups,
  EmojiEvents,
  Psychology,
  Visibility,
  Favorite,
} from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { MainNavbar } from '@/components/landing/main-navbar';
import { ProfessionalFooter } from '@/components/landing/professional-footer';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/theme/theme-provider';

const values = [
  {
    icon: <Psychology sx={{ fontSize: 40 }} />,
    titleKey: 'about.values.transformation.title',
    descriptionKey: 'about.values.transformation.description',
  },
  {
    icon: <School sx={{ fontSize: 40 }} />,
    titleKey: 'about.values.education.title',
    descriptionKey: 'about.values.education.description',
  },
  {
    icon: <Groups sx={{ fontSize: 40 }} />,
    titleKey: 'about.values.community.title',
    descriptionKey: 'about.values.community.description',
  },
  {
    icon: <EmojiEvents sx={{ fontSize: 40 }} />,
    titleKey: 'about.values.success.title',
    descriptionKey: 'about.values.success.description',
  },
];

// Trading Chart SVG Component
const TradingChartBackground = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 400 300"
    style={{
      position: 'absolute',
      right: 0,
      top: 0,
      opacity: isDarkMode ? 0.05 : 0.03,
      pointerEvents: 'none',
    }}
  >
    {/* Candlestick Chart */}
    {[...Array(20)].map((_, i) => {
      const x = i * 20;
      const height = Math.random() * 80 + 20;
      const y = 150 - height / 2 + (Math.random() - 0.5) * 100;
      const wickHeight = height + Math.random() * 20;
      const isGreen = Math.random() > 0.5;
      
      return (
        <g key={`candlestick-x${x}-y${y.toFixed(0)}`}>
          {/* Wick */}
          <line
            x1={x + 10}
            y1={y - (wickHeight - height) / 2}
            x2={x + 10}
            y2={y + height + (wickHeight - height) / 2}
            stroke={isGreen ? '#16a34a' : '#ef4444'}
            strokeWidth="1"
          />
          {/* Body */}
          <rect
            x={x + 5}
            y={y}
            width="10"
            height={height}
            fill={isGreen ? '#16a34a' : '#ef4444'}
          />
        </g>
      );
    })}
    {/* Trend Line */}
    <path
      d="M 0 200 Q 100 150 200 100 T 400 50"
      stroke="#16a34a"
      strokeWidth="2"
      fill="none"
      strokeDasharray="5,5"
    />
  </svg>
);

// Bull and Bear Pattern
const MarketPattern = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <Box
    sx={{
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '300px',
      height: '300px',
      opacity: isDarkMode ? 0.03 : 0.02,
      pointerEvents: 'none',
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: `
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            ${isDarkMode ? 'rgba(22, 163, 74, 0.1)' : 'rgba(22, 163, 74, 0.05)'} 10px,
            ${isDarkMode ? 'rgba(22, 163, 74, 0.1)' : 'rgba(22, 163, 74, 0.05)'} 20px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 10px,
            ${isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'} 10px,
            ${isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'} 20px
          )
        `,
      }}
    />
  </Box>
);

export default function AboutPage() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0d1117' }}>
      <MainNavbar />
      <Box sx={{ pt: 0, pb: 10, minHeight: '100vh' }}>
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 0,
          }}
        >
          {/* Floating Chart Elements */}
          {[...Array(5)].map((_, i) => (
            <Box
              key={`bg-chart-${Math.random().toString(36).substr(2, 9)}`}
              sx={{
                position: 'absolute',
                width: '200px',
                height: '150px',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.02,
                animation: `float ${20 + i * 5}s linear infinite`,
                '@keyframes float': {
                  '0%': { transform: 'translateY(0) rotate(0deg)' },
                  '50%': { transform: 'translateY(-20px) rotate(180deg)' },
                  '100%': { transform: 'translateY(0) rotate(360deg)' },
                },
              }}
            >
              <svg viewBox="0 0 200 150" width="100%" height="100%">
                <polyline
                  points="10,100 30,80 50,90 70,60 90,70 110,40 130,50 150,30 170,40 190,20"
                  fill="none"
                  stroke={isDarkMode ? '#16a34a' : '#15803d'}
                  strokeWidth="2"
                />
                <polyline
                  points="10,120 30,110 50,115 70,100 90,105 110,90 130,95 150,85 170,90 190,80"
                  fill="none"
                  stroke={isDarkMode ? '#ef4444' : '#dc2626'}
                  strokeWidth="2"
                />
              </svg>
            </Box>
          ))}
        </Box>

        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(180deg, rgba(22, 163, 74, 0.08) 0%, transparent 100%)',
            pt: { xs: 12, md: 14 },
            pb: 8,
            mb: 8,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #ffffff 0%, #16a34a 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {t('about.hero.title')}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ mb: 4, lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  {t('about.hero.subtitle')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    component={Link}
                    href="/events/680fe27154c9b64e54e2424f"
                    variant="contained"
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      color: 'white',
                      textTransform: 'none',
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        boxShadow: '0 6px 20px rgba(22, 163, 74, 0.5)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {t('about.hero.cta')}
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(180deg, transparent 60%, rgba(13, 17, 23, 0.8) 100%)',
                      pointerEvents: 'none',
                    },
                  }}
                >
                  <Image
                    src="/assets/images/mijail-profile.jpg?v=2"
                    alt="Mijail Medina - CEO"
                    width={600}
                    height={600}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                    }}
                    priority
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Mission & Vision */}
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  backgroundColor: '#161b22',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'rgba(22, 163, 74, 0.3)',
                    boxShadow: '0 8px 30px rgba(22, 163, 74, 0.15)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%)',
                        border: '1px solid rgba(22, 163, 74, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <Visibility sx={{ fontSize: 28, color: '#22c55e' }} />
                    </Box>
                    <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
                      {t('about.mission.title')}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.7)' }}>
                    {t('about.mission.content')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  backgroundColor: '#161b22',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    boxShadow: '0 8px 30px rgba(239, 68, 68, 0.15)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <Favorite sx={{ fontSize: 28, color: '#f87171' }} />
                    </Box>
                    <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
                      {t('about.vision.title')}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.7)' }}>
                    {t('about.vision.content')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* CEO Biography Section */}
        <Box
          sx={{
            backgroundColor: 'rgba(22, 27, 34, 0.5)',
            py: 8,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="lg">
            <TradingChartBackground isDarkMode={isDarkMode} />
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{
                mb: 6,
                fontWeight: 700,
                position: 'relative',
                zIndex: 1,
                background: 'linear-gradient(135deg, #ffffff 0%, #16a34a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('about.ceo.title')}
            </Typography>

            <Grid container spacing={6}>
              <Grid item xs={12} md={8}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: '#22c55e',
                  }}
                >
                  Mijail Medina
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ lineHeight: 1.8, mb: 3, color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  {t('about.ceo.bio1')}
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ lineHeight: 1.8, mb: 3, color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  {t('about.ceo.bio2')}
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ lineHeight: 1.8, mb: 3, color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  {t('about.ceo.bio3')}
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  {t('about.ceo.bio4')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ position: 'sticky', top: 120 }}>
                  <Card
                    elevation={0}
                    sx={{
                      backgroundColor: '#161b22',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 3,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600, color: 'white', mb: 3 }}
                      >
                        {t('about.ceo.highlights.title')}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2.5,
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: 'rgba(22, 163, 74, 0.1)',
                          border: '1px solid rgba(22, 163, 74, 0.2)',
                        }}
                      >
                        <TrendingUp sx={{ mr: 1.5, color: '#22c55e' }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                          {t('about.ceo.highlights.trader')}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2.5,
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                        }}
                      >
                        <School sx={{ mr: 1.5, color: '#60a5fa' }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                          {t('about.ceo.highlights.engineer')}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2.5,
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                        }}
                      >
                        <MenuBook sx={{ mr: 1.5, color: '#a78bfa' }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                          {t('about.ceo.highlights.author')}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                        }}
                      >
                        <Groups sx={{ mr: 1.5, color: '#fbbf24' }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                          {t('about.ceo.highlights.mentor')}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Values Section */}
        <Box sx={{ py: 8, position: 'relative', backgroundColor: '#0d1117' }}>
          <Container maxWidth="lg" sx={{ position: 'relative' }}>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{
                mb: 6,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ffffff 0%, #16a34a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('about.values.title')}
            </Typography>
            <Grid container spacing={3}>
              {values.map((value, index) => {
                const colors = [
                  { bg: 'rgba(22, 163, 74, 0.1)', border: 'rgba(22, 163, 74, 0.3)', icon: '#22c55e' },
                  { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', icon: '#60a5fa' },
                  { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.3)', icon: '#a78bfa' },
                  { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', icon: '#fbbf24' },
                ];
                const colorScheme = colors[index % colors.length];

                return (
                  <Grid item xs={12} sm={6} md={3} key={value.titleKey}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        textAlign: 'center',
                        backgroundColor: '#161b22',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          borderColor: colorScheme.border,
                          boxShadow: `0 12px 40px ${colorScheme.bg}`,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            backgroundColor: colorScheme.bg,
                            border: `1px solid ${colorScheme.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                          }}
                        >
                          {React.cloneElement(value.icon, { sx: { fontSize: 36, color: colorScheme.icon } })}
                        </Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
                          {t(value.titleKey)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          {t(value.descriptionKey)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        </Box>

        {/* Journey Image Section */}
        <Box sx={{ py: 8, position: 'relative', overflow: 'hidden', backgroundColor: '#0d1117' }}>
          <MarketPattern isDarkMode={isDarkMode} />
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #ffffff 0%, #16a34a 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {t('about.journey.title')}
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ lineHeight: 1.8, mb: 3, color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  {t('about.journey.content1')}
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  {t('about.journey.content2')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                {/* Image temporarily hidden - will be replaced */}
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, rgba(22, 163, 74, 0.05) 100%)',
            py: 8,
            borderRadius: 4,
            mx: { xs: 2, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(22, 163, 74, 0.2)',
          }}
        >
          {/* Grid Pattern Background */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              pointerEvents: 'none',
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
          <Container maxWidth="md" sx={{ position: 'relative' }}>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ffffff 0%, #22c55e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('about.cta.title')}
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.7)' }}
            >
              {t('about.cta.subtitle')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                component={Link}
                href="/contact"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: 'white',
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    boxShadow: '0 6px 20px rgba(22, 163, 74, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {t('about.cta.contact')}
              </Button>
              <Button
                component={Link}
                href="/auth/sign-up"
                variant="outlined"
                size="large"
                sx={{
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(22, 163, 74, 0.1)',
                  },
                }}
              >
                {t('about.cta.getStarted')}
              </Button>
            </Box>
          </Container>
        </Box>
        {/* Footer Spacer */}
        <Box sx={{ height: { xs: 40, md: 60 }, backgroundColor: '#0d1117' }} />
      </Box>
      <ProfessionalFooter />
    </Box>
  );
}