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
} from '@mui/material';
import { 
  PlayCircleOutline,
  TrendingUp,
  Groups,
  Timer,
  VerifiedUser,
} from '@mui/icons-material';
import Link from 'next/link';
import CountUp from 'react-countup';
import { useTheme } from '@/components/theme/theme-provider';
import { useTranslation } from 'react-i18next';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const getMarketData = (t: any): MarketData[] => [
  { symbol: 'SPY', name: t('hero.liveMarket.sp500'), price: 543.72, change: 2.34, changePercent: 0.43 },
  { symbol: 'QQQ', name: t('hero.liveMarket.nasdaq'), price: 456.89, change: -1.23, changePercent: -0.27 },
  { symbol: 'DIA', name: t('hero.liveMarket.dowJones'), price: 389.45, change: 0.89, changePercent: 0.23 },
];

export function ProfessionalHero() {
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation('landing');
  const marketData = getMarketData(t);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: muiTheme.palette.background.default,
        pt: '116px', // 36px (TopBar) + 80px (Navbar)
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Candlestick Pattern Background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: isDarkMode ? 0.05 : 0.03,
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="candlesticks" x="0" y="0" width="120" height="200" patternUnits="userSpaceOnUse">
              {/* Green Candlestick */}
              <rect x="10" y="40" width="40" height="80" fill="#16a34a" />
              <rect x="28" y="20" width="4" height="20" fill="#16a34a" />
              <rect x="28" y="120" width="4" height="30" fill="#16a34a" />
              
              {/* Red Candlestick */}
              <rect x="70" y="60" width="40" height="60" fill="#ef4444" />
              <rect x="88" y="30" width="4" height="30" fill="#ef4444" />
              <rect x="88" y="120" width="4" height="40" fill="#ef4444" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#candlesticks)" />
        </svg>
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center" sx={{ minHeight: 'calc(100vh - 80px)' }}>
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
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 3,
                  color: muiTheme.palette.text.primary,
                }}
              >
                {t('hero.title')}
                <br />
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
              <Box sx={{ display: 'flex', gap: 2, mb: 6, flexWrap: 'wrap' }}>
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
                  {t('hero.cta.startTrial')}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayCircleOutline />}
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
                  {t('hero.cta.watchDemo')}
                </Button>
              </Box>

              {/* Trust Indicators */}
              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#16a34a' }}>
                      <CountUp end={50000} duration={2} separator="," />+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('hero.stats.activeStudents')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#16a34a' }}>
                      <CountUp end={95} duration={2} />%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('hero.stats.successRate')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#16a34a' }}>
                      <CountUp end={500} duration={2} />+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('hero.stats.videoLessons')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#16a34a' }}>
                      24/7
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('hero.stats.liveSupport')}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Right Content - Live Market Data */}
          <Grid item xs={12} lg={5}>
            <Card
              elevation={10}
              sx={{
                backgroundColor: muiTheme.palette.background.paper,
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* Card Header */}
              <Box
                sx={{
                  p: 3,
                  borderBottom: '1px solid',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp sx={{ color: '#16a34a' }} />
                  <Typography variant="h6" fontWeight="600">
                    {t('hero.liveMarket.title')}
                  </Typography>
                </Box>
                <Chip
                  label={t('hero.liveMarket.badge')}
                  size="small"
                  sx={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontWeight: 600,
                    animation: 'pulse 2s infinite',
                  }}
                />
              </Box>

              {/* Market Data */}
              <Box sx={{ p: 3 }}>
                {marketData.map((item, index) => (
                  <Box
                    key={item.symbol}
                    sx={{
                      py: 2,
                      borderBottom: index < marketData.length - 1 ? '1px solid' : 'none',
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="600">
                          {item.symbol}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.name}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" fontWeight="600">
                          ${item.price.toFixed(2)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: item.change >= 0 ? '#16a34a' : '#ef4444',
                            fontWeight: 600,
                          }}
                        >
                          {item.change >= 0 ? '+' : ''}{item.change} ({item.changePercent}%)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Features */}
              <Box
                sx={{
                  p: 3,
                  backgroundColor: isDarkMode ? 'rgba(22, 163, 74, 0.1)' : 'rgba(22, 163, 74, 0.05)',
                  borderTop: '1px solid',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Timer fontSize="small" sx={{ color: '#16a34a' }} />
                      <Typography variant="body2">{t('hero.liveMarket.features.realTimeData')}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Groups fontSize="small" sx={{ color: '#16a34a' }} />
                      <Typography variant="body2">{t('hero.liveMarket.features.expertAnalysis')}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VerifiedUser fontSize="small" sx={{ color: '#16a34a' }} />
                      <Typography variant="body2">{t('hero.liveMarket.features.verifiedSignals')}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp fontSize="small" sx={{ color: '#16a34a' }} />
                      <Typography variant="body2">{t('hero.liveMarket.features.accuracy')}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Animated Candlesticks */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          overflow: 'hidden',
          opacity: 0.1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            animation: 'scroll 60s linear infinite',
            height: '100%',
            alignItems: 'flex-end',
          }}
        >
          {[...Array(20)].map((_, i) => {
            // Use deterministic values based on index to avoid hydration mismatch
            const height = 50 + ((i * 37) % 100);
            const isGreen = i % 2 === 0;
            
            return (
              <Box
                key={i}
                sx={{
                  width: '60px',
                  mx: 1,
                  height: `${height}px`,
                  backgroundColor: isGreen ? '#16a34a' : '#ef4444',
                  borderRadius: '4px',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '2px',
                    height: '20px',
                    backgroundColor: 'inherit',
                    top: '-20px',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '2px',
                    height: '20px',
                    backgroundColor: 'inherit',
                    bottom: '-20px',
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}