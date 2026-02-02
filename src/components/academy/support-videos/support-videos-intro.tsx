'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Chip,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Question,
  Wrench,
  VideoCamera,
  Lightbulb,
  CheckCircle,
  Sparkle,
  BookOpen,
  ChartLine,
  Gear,
  Desktop,
  PlayCircle,
} from '@phosphor-icons/react';

interface SupportVideosIntroProps {
  onStart: () => void;
  ctaText: string;
  hasAccess?: boolean;
}

export default function SupportVideosIntro({ onStart, ctaText, hasAccess }: SupportVideosIntroProps) {
  const theme = useTheme();
  const { t } = useTranslation('academy');
  const isDarkMode = theme.palette.mode === 'dark';

  const benefits = [
    {
      icon: <Wrench size={32} weight="duotone" />,
      title: t('supportVideos.benefits.stepByStep.title'),
      description: t('supportVideos.benefits.stepByStep.description')
    },
    {
      icon: <VideoCamera size={32} weight="duotone" />,
      title: t('supportVideos.benefits.visualLearning.title'),
      description: t('supportVideos.benefits.visualLearning.description')
    },
    {
      icon: <Lightbulb size={32} weight="duotone" />,
      title: t('supportVideos.benefits.quickReference.title'),
      description: t('supportVideos.benefits.quickReference.description')
    }
  ];

  const features = [
    t('supportVideos.features.list.platformSetup'),
    t('supportVideos.features.list.chartCustomization'),
    t('supportVideos.features.list.tradingTools'),
    t('supportVideos.features.list.accountManagement'),
    t('supportVideos.features.list.technicalIndicators'),
    t('supportVideos.features.list.hotkeys'),
    t('supportVideos.features.list.troubleshooting'),
    t('supportVideos.features.list.mobileApp'),
  ];

  const topics = [
    {
      title: t('supportVideos.topics.platformConfig.title'),
      description: t('supportVideos.topics.platformConfig.description'),
      icon: <Desktop size={24} weight="duotone" />
    },
    {
      title: t('supportVideos.topics.tradingTools.title'),
      description: t('supportVideos.topics.tradingTools.description'),
      icon: <ChartLine size={24} weight="duotone" />
    },
    {
      title: t('supportVideos.topics.accountSetup.title'),
      description: t('supportVideos.topics.accountSetup.description'),
      icon: <Gear size={24} weight="duotone" />
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
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 50%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
            : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 50%, ${alpha('#ffffff', 0.98)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.12)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={3}>
            <Question size={48} weight="duotone" color={theme.palette.primary.main} />
            <Box>
              <Typography variant="h3" fontWeight={800} mb={1}>
                {t('supportVideos.title')}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {t('supportVideos.subtitle')}
              </Typography>
            </Box>
          </Stack>

          <Typography variant="h5" paragraph sx={{ mb: 3, fontWeight: 300 }}>
            {t('supportVideos.description')}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4}>
            <Chip
              icon={<PlayCircle size={16} />}
              label={t('supportVideos.chips.stepByStepGuides')}
              color="primary"
              variant="filled"
            />
            <Chip
              icon={<VideoCamera size={16} />}
              label={t('supportVideos.chips.videoTutorials')}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<Wrench size={16} />}
              label={t('supportVideos.chips.platformSetup')}
              color="primary"
              variant="outlined"
            />
          </Stack>

          <Button
            variant="contained"
            size="large"
            onClick={onStart}
            startIcon={<Sparkle size={20} weight="bold" />}
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                boxShadow: '0 6px 20px rgba(22, 163, 74, 0.4)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {ctaText}
          </Button>
        </Box>

        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: alpha(theme.palette.primary.main, 0.08),
          }}
        />
      </Paper>

      {/* Benefits Section */}
      <Typography variant="h4" fontWeight={700} mb={4} textAlign="center">
        {t('supportVideos.subtitle')}
      </Typography>

      <Grid container spacing={3} mb={6}>
        {benefits.map((benefit) => (
          <Grid item xs={12} sm={6} md={4} key={benefit.title}>
            <Card
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: isDarkMode
                  ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.12)} 100%)`
                  : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.25)}`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.25)} 0%, ${alpha(theme.palette.primary.main, 0.12)} 100%)`,
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    color: 'primary.main',
                    boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                >
                  {benefit.icon}
                </Box>
                <Typography variant="h6" fontWeight={600} mb={1}>
                  {benefit.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {benefit.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Topics Section */}
      <Paper
        sx={{
          p: 4,
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
            : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          },
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={3}>
          <BookOpen size={28} weight="duotone" color={theme.palette.primary.main} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          {t('supportVideos.video.keyTopics')}
        </Typography>

        <Grid container spacing={3}>
          {topics.map((topic) => (
            <Grid item xs={12} md={4} key={topic.title}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  background: isDarkMode
                    ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
                    : `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.08)}`,
                  height: '100%',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.light, 0.5)})`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    color: 'primary.main',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                  }}
                >
                  {topic.icon}
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {topic.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {topic.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Features Section */}
      <Grid container spacing={4} mb={6}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              background: isDarkMode
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
              },
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2} color="primary.main">
              <CheckCircle size={24} weight="duotone" style={{ verticalAlign: 'middle', marginRight: 8 }} />
              {t('supportVideos.features.whatsIncluded')}
            </Typography>
            <List sx={{ '& .MuiListItem-root': { py: 0.5 } }}>
              {features.map((feature) => (
                <ListItem key={feature} disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircle size={20} weight="fill" color={theme.palette.primary.main} />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              background: isDarkMode
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
              },
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2} color="primary.main">
              <Lightbulb size={24} weight="duotone" style={{ verticalAlign: 'middle', marginRight: 8 }} />
              {t('supportVideos.features.howItHelps')}
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography fontWeight={600} gutterBottom>
                  {t('supportVideos.features.help.saveTime.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('supportVideos.features.help.saveTime.description')}
                </Typography>
              </Box>
              <Box>
                <Typography fontWeight={600} gutterBottom>
                  {t('supportVideos.features.help.avoidMistakes.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('supportVideos.features.help.avoidMistakes.description')}
                </Typography>
              </Box>
              <Box>
                <Typography fontWeight={600} gutterBottom>
                  {t('supportVideos.features.help.getSupport.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('supportVideos.features.help.getSupport.description')}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Access Info Section - Note/Advisory style with left border */}
      <Paper
        sx={{
          p: 4,
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          background: isDarkMode
            ? `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
            : `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha('#ffffff', 0.98)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.06)}`,
          borderRadius: '0 12px 12px 0',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: 'primary.main',
            }}
          >
            <Lightbulb size={20} weight="duotone" />
          </Box>
          <Box>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 1 }}>
              {t('supportVideos.accessDescription')}
            </Typography>
            {!hasAccess && (
              <Typography variant="body2" color="text.secondary">
                {t('supportVideos.contactSupportForAccess')}
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>

      {/* CTA Section */}
      <Box
        sx={{
          textAlign: 'center',
          p: 5,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 50%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha('#ffffff', 0.98)} 50%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`,
          },
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={2}>
          {t('supportVideos.cta.ready')}
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          {t('supportVideos.cta.access')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={onStart}
          startIcon={<Question size={24} weight="bold" />}
          sx={{
            py: 2.5,
            px: 5,
            fontSize: '1.2rem',
            fontWeight: 600,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              boxShadow: `0 6px 28px ${alpha(theme.palette.primary.main, 0.5)}`,
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {ctaText}
        </Button>
      </Box>
    </Box>
  );
}
