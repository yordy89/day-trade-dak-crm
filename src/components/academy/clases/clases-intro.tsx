import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Stack,
  Chip,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { PlayCircle } from '@phosphor-icons/react/dist/ssr/PlayCircle';
import { Calendar } from '@phosphor-icons/react/dist/ssr/Calendar';
import { ChartLineUp } from '@phosphor-icons/react/dist/ssr/ChartLineUp';
import { Trophy } from '@phosphor-icons/react/dist/ssr/Trophy';
import { BookOpen } from '@phosphor-icons/react/dist/ssr/BookOpen';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ClasesIntroProps {
  onStart: () => void;
  ctaText: string;
  hasAccess?: boolean;
  daysRemaining?: number | null;
}

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function ClasesIntro({ onStart, ctaText, hasAccess, daysRemaining }: ClasesIntroProps) {
  const theme = useTheme();
  const { t } = useTranslation('academy');

  const features = [
    {
      icon: <Calendar size={32} weight="fill" />,
      title: t('classes.features.access15Days'),
      description: t('classes.features.access15DaysDesc'),
    },
    {
      icon: <BookOpen size={32} weight="fill" />,
      title: t('classes.features.structuredLessons'),
      description: t('classes.features.structuredLessonsDesc'),
    },
    {
      icon: <ChartLineUp size={32} weight="fill" />,
      title: t('classes.features.provenStrategies'),
      description: t('classes.features.provenStrategiesDesc'),
    },
    {
      icon: <Trophy size={32} weight="fill" />,
      title: t('classes.features.certificateIncluded'),
      description: t('classes.features.certificateIncludedDesc'),
    },
  ];

  const curriculum = [
    { module: t('common.module', { number: 1 }), title: t('classes.curriculum.module1'), lessons: 5 },
    { module: t('common.module', { number: 2 }), title: t('classes.curriculum.module2'), lessons: 8 },
    { module: t('common.module', { number: 3 }), title: t('classes.curriculum.module3'), lessons: 6 },
    { module: t('common.module', { number: 4 }), title: t('classes.curriculum.module4'), lessons: 4 },
    { module: t('common.module', { number: 5 }), title: t('classes.curriculum.module5'), lessons: 7 },
    { module: t('common.module', { number: 6 }), title: t('classes.curriculum.module6'), lessons: 10 },
  ];

  const totalLessons = curriculum.reduce((sum, module) => sum + module.lessons, 0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 100%)`,
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {hasAccess && daysRemaining !== null && daysRemaining !== undefined ? (
                  <Chip
                    label={t('classes.daysRemaining', { days: daysRemaining })}
                    color={daysRemaining <= 3 ? 'warning' : 'success'}
                    sx={{ mb: 2 }}
                  />
                ) : null}
                
                <Typography variant="h2" fontWeight={800} gutterBottom>
                  {t('classes.title')}
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph>
                  {t('classes.intensiveCourse')}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {t('classes.courseDescription')}
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayCircle size={24} />}
                    onClick={onStart}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                  >
                    {ctaText}
                  </Button>
                </Stack>

                {/* Course Stats */}
                <Stack direction="row" spacing={3} sx={{ mt: 4 }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700} color="primary.main">
                      {totalLessons}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('classes.lessons')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={700} color="primary.main">
                      15
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('classes.daysAccess')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={700} color="primary.main">
                      40+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('classes.hoursContent')}
                    </Typography>
                  </Box>
                </Stack>
              </MotionBox>
            </Grid>

            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: 400,
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: theme.shadows[10],
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PlayCircle size={120} color="white" weight="fill" />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 20,
                      left: 20,
                      right: 20,
                      color: 'white',
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      {t('classes.coursePresentation')}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {t('classes.discoverWhatYouLearn')}
                    </Typography>
                  </Box>
                </Box>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" fontWeight={700} textAlign="center" gutterBottom>
          {t('classes.whyChoose')}
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" paragraph sx={{ mb: 6 }}>
          {t('classes.whyChooseSubtitle')}
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    transform: 'translateY(-4px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    color: 'primary.main',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Curriculum Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={700} textAlign="center" gutterBottom>
            {t('classes.curriculum.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" paragraph sx={{ mb: 6 }}>
            {t('classes.curriculum.subtitle')}
          </Typography>

          <Grid container spacing={3}>
            {curriculum.map((module, index) => (
              <Grid item xs={12} md={6} key={module.title}>
                <Paper
                  sx={{
                    p: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '&:hover': {
                      boxShadow: theme.shadows[2],
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.main',
                        fontWeight: 700,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Box flex={1}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {module.module}
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {module.title}
                      </Typography>
                    </Box>
                    <Chip label={t('classes.lessonsCount', { count: module.lessons })} size="small" />
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            {hasAccess ? t('classes.continueYourLearning') : t('classes.startToday')}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            {hasAccess 
              ? t('classes.accessAllContent')
              : t('classes.getFullAccess')
            }
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={onStart}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.2rem',
              fontWeight: 600,
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            {ctaText}
          </Button>
          {!hasAccess ? (
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
              {t('classes.priceInfo')}
            </Typography>
          ) : null}
        </Container>
      </Box>
    </Box>
  );
}