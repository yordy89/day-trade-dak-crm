'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  FormatQuote,
  School,
  TrendingUp,
  Groups,
} from '@mui/icons-material';
import { useTheme } from '@/components/theme/theme-provider';
import { useTranslation } from 'react-i18next';

const testimonials = [
  {
    name: 'Carlos Rodriguez',
    role: 'Day Trader',
    avatar: '/assets/avatar-1.png',
    rating: 5,
    testimonial: 'The daily live classes transformed my trading. Being able to see real-time analysis and ask questions during market hours is invaluable.',
    course: 'Live Daily Classes',
    icon: TrendingUp,
  },
  {
    name: 'Maria Gonzalez',
    role: 'Options Trader',
    avatar: '/assets/avatar-2.png',
    rating: 5,
    testimonial: 'El curso maestro me dio las herramientas necesarias para operar con confianza. La combinación de teoría y práctica es perfecta.',
    course: 'Master Classes',
    icon: School,
  },
  {
    name: 'James Mitchell',
    role: 'Swing Trader',
    avatar: '/assets/avatar-3.png',
    rating: 5,
    testimonial: 'The mentorship videos are like having a personal coach. They cover scenarios I face daily in my trading.',
    course: 'Personal Mentorships',
    icon: Groups,
  },
];

const stats = [
  {
    value: '150+',
    label: 'Active Students',
    labelES: 'Estudiantes Activos',
    description: 'Growing every day',
    descriptionES: 'Creciendo cada día',
  },
  {
    value: 'Mon-Fri',
    label: 'Live Classes',
    labelES: 'Clases en Vivo',
    description: 'When markets are open',
    descriptionES: 'Cuando los mercados están abiertos',
  },
  {
    value: '25+',
    label: 'Courses & Mentorships',
    labelES: 'Cursos y Mentorías',
    description: 'All content in Spanish',
    descriptionES: 'Todo el contenido en español',
  },
  {
    value: 'ES',
    label: 'Content Language',
    labelES: 'Idioma del Contenido',
    description: 'Spanish educational material',
    descriptionES: 'Material educativo en español',
  },
];

export function DayTradeDakTestimonials() {
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t, i18n } = useTranslation('landing');
  const isSpanish = i18n.language === 'es';

  return (
    <Box
      sx={{
        py: 10,
        backgroundColor: muiTheme.palette.background.paper,
        position: 'relative',
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
            {t('testimonials.label')}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 3,
              color: muiTheme.palette.text.primary,
            }}
          >
            {t('testimonials.title')}{' '}
            <span style={{ 
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {t('testimonials.titleHighlight')}
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
            {t('testimonials.subtitle')}
          </Typography>
        </Box>

        {/* Testimonials Grid */}
        <Grid container spacing={4} sx={{ mb: 10 }}>
          {testimonials.map((testimonial, index) => {
            const Icon = testimonial.icon;
            return (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    backgroundColor: muiTheme.palette.background.paper,
                    border: '1px solid',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 3,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: isDarkMode
                        ? '0 20px 40px rgba(0, 0, 0, 0.5)'
                        : '0 20px 40px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    {/* Quote Icon */}
                    <FormatQuote
                      sx={{
                        fontSize: 48,
                        color: '#16a34a',
                        opacity: 0.2,
                        position: 'absolute',
                        top: 20,
                        right: 20,
                      }}
                    />

                    {/* Rating */}
                    <Rating
                      value={testimonial.rating}
                      readOnly
                      size="small"
                      sx={{ mb: 3 }}
                    />

                    {/* Testimonial Text */}
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 4,
                        fontStyle: 'italic',
                        lineHeight: 1.8,
                        minHeight: 100,
                      }}
                    >
                      &ldquo;{testimonial.testimonial}&rdquo;
                    </Typography>

                    {/* Author Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar src={testimonial.avatar} sx={{ width: 48, height: 48 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="600">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Course Tag */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon sx={{ fontSize: 16, color: '#16a34a' }} />
                      <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 600 }}>
                        {testimonial.course}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Stats Section */}
        <Box
          sx={{
            backgroundColor: isDarkMode ? 'rgba(22, 163, 74, 0.1)' : 'rgba(22, 163, 74, 0.05)',
            borderRadius: 3,
            p: 6,
          }}
        >
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    fontWeight="800"
                    sx={{
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                    {isSpanish ? stat.labelES : stat.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isSpanish ? stat.descriptionES : stat.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}