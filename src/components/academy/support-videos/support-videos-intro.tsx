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
            ? `linear-gradient(135deg, ${alpha(theme.palette.info.dark, 0.2)} 0%, ${alpha(theme.palette.info.dark, 0.1)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.info.light, 0.15)} 0%, ${alpha(theme.palette.info.light, 0.05)} 100%)`,
          border: '1px solid',
          borderColor: alpha(theme.palette.info.main, 0.2),
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={3}>
            <Question size={48} weight="duotone" color={theme.palette.info.main} />
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
              color="info"
              variant="filled"
            />
            <Chip
              icon={<VideoCamera size={16} />}
              label={t('supportVideos.chips.videoTutorials')}
              color="info"
              variant="outlined"
            />
            <Chip
              icon={<Wrench size={16} />}
              label={t('supportVideos.chips.platformSetup')}
              color="info"
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
            background: alpha(theme.palette.info.main, 0.05),
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
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'info.main',
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box
                  sx={{
                    mb: 2,
                    color: 'info.main',
                    display: 'flex',
                    justifyContent: 'center',
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
      <Paper sx={{ p: 4, mb: 6, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          <BookOpen size={28} weight="duotone" style={{ verticalAlign: 'middle', marginRight: 8 }} />
          {t('supportVideos.video.keyTopics')}
        </Typography>

        <Grid container spacing={3}>
          {topics.map((topic) => (
            <Grid item xs={12} md={4} key={topic.title}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: alpha(theme.palette.info.main, 0.02),
                  height: '100%',
                }}
              >
                <Box sx={{ color: 'info.main', mb: 2, display: 'flex', justifyContent: 'center' }}>
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
          <Paper sx={{ p: 4, height: '100%', bgcolor: alpha(theme.palette.success.main, 0.05) }}>
            <Typography variant="h6" fontWeight={700} mb={2} color="success.main">
              <CheckCircle size={24} weight="duotone" style={{ verticalAlign: 'middle', marginRight: 8 }} />
              {t('supportVideos.features.whatsIncluded')}
            </Typography>
            <List sx={{ '& .MuiListItem-root': { py: 0.5 } }}>
              {features.map((feature) => (
                <ListItem key={feature} disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircle size={20} weight="fill" color={theme.palette.success.main} />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, height: '100%', bgcolor: alpha(theme.palette.info.main, 0.05) }}>
            <Typography variant="h6" fontWeight={700} mb={2} color="info.main">
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

      {/* Access Info Section */}
      <Paper
        sx={{
          p: 4,
          mb: 6,
          background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, transparent 100%)`,
          border: '1px solid',
          borderColor: alpha(theme.palette.info.main, 0.2),
        }}
      >
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('supportVideos.accessDescription')}
        </Typography>
        {!hasAccess && (
          <Typography variant="body2" color="text.secondary">
            {t('supportVideos.contactSupportForAccess')}
          </Typography>
        )}
      </Paper>

      {/* CTA Section */}
      <Box sx={{ textAlign: 'center' }}>
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
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
              boxShadow: '0 6px 20px rgba(22, 163, 74, 0.4)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          {ctaText}
        </Button>
      </Box>
    </Box>
  );
}
