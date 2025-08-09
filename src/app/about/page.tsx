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
    <>
      <MainNavbar />
      {/* Stock Ticker Animation - Already included in TopBar component */}
      {/* <Box
        sx={{
          position: 'fixed',
          top: 116,
          left: 0,
          right: 0,
          height: '40px',
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            animation: 'ticker 30s linear infinite',
            '@keyframes ticker': {
              '0%': { transform: 'translateX(0)' },
              '100%': { transform: 'translateX(-50%)' },
            },
          }}
        >
          {[...Array(2)].map((_, setIndex) => (
            <Box key={setIndex === 0 ? 'ticker-set-primary' : 'ticker-set-secondary'} sx={{ display: 'flex', alignItems: 'center' }}>
              {[
                { symbol: 'SPY', price: 512.45, change: 2.34, positive: true },
                { symbol: 'QQQ', price: 425.67, change: -1.23, positive: false },
                { symbol: 'DIA', price: 389.12, change: 0.89, positive: true },
                { symbol: 'IWM', price: 198.34, change: -0.45, positive: false },
                { symbol: 'VIX', price: 15.67, change: 0.12, positive: true },
              ].map((stock) => (
                <Box
                  key={`${stock.symbol}-${stock.price}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mx: 3,
                    minWidth: 'max-content',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                    {stock.symbol}
                  </Typography>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    ${stock.price}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: stock.positive ? '#16a34a' : '#ef4444',
                      fontWeight: 500,
                    }}
                  >
                    {stock.positive ? '+' : ''}{stock.change}%
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box> */}
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
            background: isDarkMode 
              ? 'linear-gradient(180deg, rgba(16,163,74,0.1) 0%, rgba(0,0,0,0) 100%)'
              : 'linear-gradient(180deg, rgba(16,163,74,0.05) 0%, rgba(255,255,255,0) 100%)',
            pt: { xs: 12, md: 14 }, // Account for TopBar on desktop
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
                  sx={{ fontWeight: 700 }}
                >
                  {t('about.hero.title')}
                </Typography>
                <Typography 
                  variant="h5" 
                  color="text.secondary" 
                  sx={{ mb: 4, lineHeight: 1.6 }}
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
                      '&:hover': {
                        background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                      },
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
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  }}
                >
                  <Image
                    src="/assets/images/mijail-profile.jpg"
                    alt="Mijail Medina - CEO"
                    width={600}
                    height={600}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                    }}
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
              <Card sx={{
                height: '100%',
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
                backdropFilter: 'blur(10px)',
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Visibility sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h4" fontWeight={700}>
                      {t('about.mission.title')}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    {t('about.mission.content')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{
                height: '100%',
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
                backdropFilter: 'blur(10px)',
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Favorite sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h4" fontWeight={700}>
                      {t('about.vision.title')}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    {t('about.vision.content')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* CEO Biography Section */}
        <Box sx={{ 
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Container maxWidth="lg">
            <TradingChartBackground isDarkMode={isDarkMode} />
            <Typography 
              variant="h3" 
              align="center" 
              gutterBottom 
              sx={{ mb: 6, fontWeight: 700, position: 'relative', zIndex: 1 }}
            >
              {t('about.ceo.title')}
            </Typography>
            
            <Grid container spacing={6}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                  Mijail Medina
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ lineHeight: 1.8, mb: 3 }}
                >
                  {t('about.ceo.bio1')}
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ lineHeight: 1.8, mb: 3 }}
                >
                  {t('about.ceo.bio2')}
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ lineHeight: 1.8, mb: 3 }}
                >
                  {t('about.ceo.bio3')}
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ lineHeight: 1.8 }}
                >
                  {t('about.ceo.bio4')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ position: 'sticky', top: 120 }}>
                  <Box
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      mb: 3,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Image
                      src="/assets/images/mijail-primer-millon.jpg"
                      alt="Mijail - First Million"
                      width={400}
                      height={300}
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                  <Card sx={{
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
                    backdropFilter: 'blur(10px)',
                  }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {t('about.ceo.highlights.title')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {t('about.ceo.highlights.trader')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <School sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {t('about.ceo.highlights.engineer')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <MenuBook sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {t('about.ceo.highlights.author')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Groups sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
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
        <Box sx={{ py: 8, position: 'relative', backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)' }}>
          <Container maxWidth="lg" sx={{ position: 'relative' }}>
            <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{ mb: 6, fontWeight: 700 }}
          >
            {t('about.values.title')}
          </Typography>
          <Grid container spacing={4}>
            {values.map((value) => (
              <Grid item xs={12} sm={6} md={3} key={value.titleKey}>
                <Card sx={{
                  height: '100%',
                  textAlign: 'center',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
                  backdropFilter: 'blur(10px)',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {value.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {t(value.titleKey)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(value.descriptionKey)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          </Container>
        </Box>

        {/* Journey Image Section */}
        <Box sx={{ py: 8, position: 'relative', overflow: 'hidden' }}>
          <MarketPattern isDarkMode={isDarkMode} />
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                  {t('about.journey.title')}
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mb: 3 }}>
                  {t('about.journey.content1')}
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  {t('about.journey.content2')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                  }}
                >
                  <Image
                    src="/assets/images/mijail-primer-millon-2.jpg"
                    alt="Trading Journey"
                    width={600}
                    height={400}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(16,163,74,0.2) 0%, rgba(21,128,61,0.2) 100%)'
              : 'linear-gradient(135deg, rgba(16,163,74,0.1) 0%, rgba(21,128,61,0.1) 100%)',
            py: 8,
            borderRadius: 4,
            mx: { xs: 2, md: 4 },
            position: 'relative',
            overflow: 'hidden',
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
                linear-gradient(to right, ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px),
                linear-gradient(to bottom, ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
          <Container maxWidth="md" sx={{ position: 'relative' }}>
            <Typography 
              variant="h3" 
              align="center" 
              gutterBottom 
              sx={{ fontWeight: 700 }}
            >
              {t('about.cta.title')}
            </Typography>
            <Typography 
              variant="h6" 
              align="center" 
              color="text.secondary" 
              sx={{ mb: 4 }}
            >
              {t('about.cta.subtitle')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
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
                  '&:hover': {
                    background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                  },
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
                }}
              >
                {t('about.cta.getStarted')}
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
      <ProfessionalFooter />
    </>
  );
}