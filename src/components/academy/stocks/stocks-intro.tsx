'use client';

import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Paper, Container, Stack, Chip, useTheme, alpha } from '@mui/material';
import { TrendUp } from '@phosphor-icons/react/dist/ssr/TrendUp';
import { ChartLine } from '@phosphor-icons/react/dist/ssr/ChartLine';
import { BookOpen } from '@phosphor-icons/react/dist/ssr/BookOpen';
import { PlayCircle } from '@phosphor-icons/react/dist/ssr/PlayCircle';
import { CurrencyCircleDollar } from '@phosphor-icons/react/dist/ssr/CurrencyCircleDollar';
import { ChartBar } from '@phosphor-icons/react/dist/ssr/ChartBar';
import { Trophy } from '@phosphor-icons/react/dist/ssr/Trophy';
import { Calendar } from '@phosphor-icons/react/dist/ssr/Calendar';
import { Users } from '@phosphor-icons/react/dist/ssr/Users';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

interface StocksIntroProps {
  onStart: () => void;
  ctaText: string;
}

export default function StocksIntro({ onStart, ctaText }: StocksIntroProps) {
  const { t, i18n } = useTranslation('academy');
  const theme = useTheme();
  const isSpanish = i18n.language === 'es';
  const isDarkMode = theme.palette.mode === 'dark';

  const features = [
    {
      icon: <ChartLine size={24} />,
      title: isSpanish ? 'Análisis Fundamental' : 'Fundamental Analysis',
      description: isSpanish 
        ? 'Aprende a evaluar el valor real de las empresas'
        : 'Learn to evaluate the real value of companies',
    },
    {
      icon: <ChartBar size={24} />,
      title: isSpanish ? 'Análisis Técnico' : 'Technical Analysis',
      description: isSpanish
        ? 'Domina los patrones y indicadores del mercado'
        : 'Master market patterns and indicators',
    },
    {
      icon: <CurrencyCircleDollar size={24} />,
      title: isSpanish ? 'Gestión de Riesgo' : 'Risk Management',
      description: isSpanish
        ? 'Protege tu capital con estrategias probadas'
        : 'Protect your capital with proven strategies',
    },
    {
      icon: <TrendUp size={24} />,
      title: isSpanish ? 'Estrategias de Trading' : 'Trading Strategies',
      description: isSpanish
        ? 'Desarrolla tu propio sistema de trading'
        : 'Develop your own trading system',
    },
  ];

  const modules = [
    {
      number: '01',
      title: isSpanish ? 'Fundamentos del Mercado de Acciones' : 'Stock Market Fundamentals',
      duration: isSpanish ? '2 horas' : '2 hours',
    },
    {
      number: '02',
      title: isSpanish ? 'Análisis de Estados Financieros' : 'Financial Statement Analysis',
      duration: isSpanish ? '3 horas' : '3 hours',
    },
    {
      number: '03',
      title: isSpanish ? 'Valoración de Empresas' : 'Company Valuation',
      duration: isSpanish ? '2.5 horas' : '2.5 hours',
    },
    {
      number: '04',
      title: isSpanish ? 'Estrategias de Inversión' : 'Investment Strategies',
      duration: isSpanish ? '3 horas' : '3 hours',
    },
    {
      number: '05',
      title: isSpanish ? 'Trading con Opciones' : 'Options Trading',
      duration: isSpanish ? '4 horas' : '4 hours',
    },
    {
      number: '06',
      title: isSpanish ? 'Gestión de Portafolio' : 'Portfolio Management',
      duration: isSpanish ? '2 horas' : '2 hours',
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Hero Section */}
      <Paper
        sx={{
          p: 6,
          mb: 6,
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.2),
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} mb={3}>
            <TrendUp size={48} weight="duotone" color={theme.palette.primary.main} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="h3" 
                fontWeight={800} 
                mb={1}
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  lineHeight: 1.2,
                  wordBreak: 'break-word',
                  hyphens: 'auto',
                }}
              >
                {isSpanish ? 'Inversión en Acciones' : 'Stock Market Investing'}
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                {isSpanish 
                  ? 'Domina el arte de invertir en el mercado de valores con estrategias profesionales y análisis profundo'
                  : 'Master the art of stock market investing with professional strategies and deep analysis'}
              </Typography>
            </Box>
          </Stack>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={onStart}
              startIcon={<PlayCircle size={24} />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {ctaText}
            </Button>
          </Stack>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {[
            { value: '20+', label: isSpanish ? 'Videos HD' : 'HD Videos' },
            { value: '15+', label: isSpanish ? 'Horas de contenido' : 'Hours of content' },
            { value: '100+', label: isSpanish ? 'Estudiantes activos' : 'Active students' },
            { value: '4.9', label: isSpanish ? 'Calificación' : 'Rating' },
          ].map((stat, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Paper sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1),
              }}>
                <Typography variant="h4" fontWeight={700} color="primary">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h4" 
          fontWeight={700}
          mb={4}
          textAlign="center"
        >
          {isSpanish ? '¿Qué aprenderás?' : 'What will you learn?'}
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                height: '100%',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[8],
                },
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1),
              }}>
                <CardContent>
                  <Box sx={{ 
                    color: theme.palette.primary.main,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    {React.cloneElement(feature.icon, { weight: 'duotone' })}
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Modules Section */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h4" 
          fontWeight={700}
          mb={4}
          textAlign="center"
        >
          {isSpanish ? 'Contenido del Curso' : 'Course Content'}
        </Typography>
        <Grid container spacing={2}>
          {modules.map((module, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper sx={{ 
                p: 3,
                background: isDarkMode
                  ? alpha(theme.palette.background.paper, 0.6)
                  : theme.palette.background.paper,
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1),
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  transform: 'translateX(5px)',
                  boxShadow: theme.shadows[4],
                }
              }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: alpha(theme.palette.text.primary, 0.15),
                      fontWeight: 800
                    }}
                  >
                    {module.number}
                  </Typography>
                  <Box flex={1}>
                    <Typography 
                      variant="h6" 
                      fontWeight={600}
                      mb={0.5}
                    >
                      {module.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                    >
                      {module.duration}
                    </Typography>
                  </Box>
                  <PlayCircle size={32} color={theme.palette.text.secondary} weight="duotone" />
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Bottom CTA */}
      <Paper sx={{ 
        textAlign: 'center',
        p: 4,
        background: isDarkMode
          ? alpha(theme.palette.primary.dark, 0.1)
          : alpha(theme.palette.primary.light, 0.05),
        border: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.2),
        borderRadius: 3,
      }}>
        <Typography 
          variant="h5" 
          fontWeight={600}
          mb={3}
        >
          {isSpanish 
            ? '¿Listo para dominar el mercado de acciones?'
            : 'Ready to master the stock market?'}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={onStart}
          startIcon={<TrendUp size={24} />}
          sx={{
            px: 5,
            py: 2,
            fontSize: '1.2rem',
            fontWeight: 700,
            '&:hover': {
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {ctaText}
        </Button>
      </Paper>
    </Box>
  );
}