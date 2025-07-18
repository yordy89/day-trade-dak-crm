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
  Chip,
  useTheme as useMuiTheme,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  School,
  PlayCircleOutline,
  Timer,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowForward,
} from '@mui/icons-material';
import Link from 'next/link';
import { useTheme } from '@/components/theme/theme-provider';
import { useTranslation } from 'react-i18next';

interface Course {
  id: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  price: number;
  originalPrice: number;
  progress?: number;
  color: string;
  features: string[];
}

const getCourses = (t: any): Course[] => [
  {
    id: '1',
    level: t('education.levels.beginner') as 'Beginner',
    title: t('education.programs.fundamentals.title'),
    description: t('education.programs.fundamentals.description'),
    instructor: 'Michael Chen',
    instructorAvatar: '/assets/avatar-1.png',
    duration: t('education.programs.fundamentals.duration'),
    lessons: 48,
    students: 12543,
    rating: 4.9,
    price: 199,
    originalPrice: 399,
    color: '#16a34a',
    features: t('education.programs.fundamentals.features', { returnObjects: true }),
  },
  {
    id: '2',
    level: t('education.levels.intermediate') as 'Intermediate',
    title: t('education.programs.technical.title'),
    description: t('education.programs.technical.description'),
    instructor: 'Sarah Williams',
    instructorAvatar: '/assets/avatar-2.png',
    duration: t('education.programs.technical.duration'),
    lessons: 72,
    students: 8234,
    rating: 4.8,
    price: 399,
    originalPrice: 799,
    color: '#3b82f6',
    progress: 65,
    features: t('education.programs.technical.features', { returnObjects: true }),
  },
  {
    id: '3',
    level: t('education.levels.advanced') as 'Advanced',
    title: t('education.programs.professional.title'),
    description: t('education.programs.professional.description'),
    instructor: 'Alex Rodriguez',
    instructorAvatar: '/assets/avatar-3.png',
    duration: t('education.programs.professional.duration'),
    lessons: 96,
    students: 3456,
    rating: 5.0,
    price: 999,
    originalPrice: 1999,
    color: '#8b5cf6',
    features: t('education.programs.professional.features', { returnObjects: true }),
  },
];

export function EducationPrograms() {
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation('landing');
  const courses = getCourses(t);

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
            {t('education.label')}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 3,
              color: muiTheme.palette.text.primary,
            }}
          >
            {t('education.title')}{' '}
            <span style={{ 
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {t('education.titleHighlight')}
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
            {t('education.subtitle')}
          </Typography>
        </Box>

        {/* Courses Grid */}
        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item xs={12} md={4} key={course.id}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: muiTheme.palette.background.paper,
                  border: '1px solid',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: isDarkMode
                      ? '0 20px 40px rgba(0, 0, 0, 0.5)'
                      : '0 20px 40px rgba(0, 0, 0, 0.1)',
                    borderColor: course.color,
                  },
                }}
              >
                <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Level Badge */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Chip
                      label={course.level}
                      size="small"
                      sx={{
                        backgroundColor: `${course.color}20`,
                        color: course.color,
                        fontWeight: 600,
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star sx={{ fontSize: 16, color: '#f59e0b' }} />
                      <Typography variant="body2" fontWeight="600">
                        {course.rating}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Title & Description */}
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: muiTheme.palette.text.primary,
                    }}
                  >
                    {course.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: muiTheme.palette.text.secondary,
                      mb: 3,
                      lineHeight: 1.8,
                    }}
                  >
                    {course.description}
                  </Typography>

                  {/* Instructor */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar src={course.instructorAvatar} sx={{ width: 40, height: 40 }} />
                    <Box>
                      <Typography variant="body2" fontWeight="600">
                        {course.instructor}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('education.badge')}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Features */}
                  <Box sx={{ mb: 3, flex: 1 }}>
                    {course.features.map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CheckCircle sx={{ fontSize: 16, color: '#16a34a' }} />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Progress (if enrolled) */}
                  {course.progress && (
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{t('education.progress')}</Typography>
                        <Typography variant="body2" fontWeight="600">
                          {course.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#16a34a',
                          },
                        }}
                      />
                    </Box>
                  )}

                  {/* Stats */}
                  <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Timer fontSize="small" color="action" />
                      <Typography variant="caption">{course.duration}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PlayCircleOutline fontSize="small" color="action" />
                      <Typography variant="caption">{course.lessons} {t('common.lessons').replace('{count} ', '')}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <School fontSize="small" color="action" />
                      <Typography variant="caption">{course.students.toLocaleString()} {t('common.students').replace('{count} ', '')}</Typography>
                    </Box>
                  </Box>

                  {/* Price & CTA */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography
                        variant="h5"
                        fontWeight="700"
                        sx={{ color: muiTheme.palette.text.primary }}
                      >
                        ${course.price}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: 'line-through',
                          color: muiTheme.palette.text.secondary,
                        }}
                      >
                        ${course.originalPrice}
                      </Typography>
                    </Box>
                    <Button
                      component={Link}
                      href={`/academy/live-sessions/${course.id}`}
                      variant="contained"
                      endIcon={<ArrowForward />}
                      sx={{
                        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                        },
                      }}
                    >
                      {course.progress ? t('education.cta.continue') : t('education.cta.enrollNow')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Bottom CTA */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" sx={{ mb: 3, color: muiTheme.palette.text.secondary }}>
            {t('education.cta.title')}
          </Typography>
          <Button
            variant="outlined"
            size="large"
            startIcon={<TrendingUp />}
            sx={{
              borderColor: '#16a34a',
              color: '#16a34a',
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#15803d',
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
              },
            }}
          >
            {t('education.cta.button')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}