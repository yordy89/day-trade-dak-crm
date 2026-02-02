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
  Users,
  VideoCamera,
  Lightning,
  ChartLine,
  Clock,
  CalendarCheck,
  Target,
  TrendUp,
  Sparkle,
  CheckCircle,
  Certificate,
  Globe,
  BookOpen,
} from '@phosphor-icons/react';

interface ClassIntroProps {
  onStart: () => void;
  ctaText: string;
}

export default function ClassIntro({ onStart, ctaText }: ClassIntroProps) {
  const theme = useTheme();
  const { t } = useTranslation('academy');
  const isDarkMode = theme.palette.mode === 'dark';

  const benefits = [
    {
      icon: <VideoCamera size={32} weight="duotone" />,
      title: t('liveRecorded.completeLibrary.title'),
      description: t('liveRecorded.completeLibrary.description')
    },
    {
      icon: <Clock size={32} weight="duotone" />,
      title: t('liveRecorded.learnAtYourPace.title'),
      description: t('liveRecorded.learnAtYourPace.description')
    },
    {
      icon: <ChartLine size={32} weight="duotone" />,
      title: t('liveRecorded.detailedAnalysis.title'),
      description: t('liveRecorded.detailedAnalysis.description')
    },
    {
      icon: <Target size={32} weight="duotone" />,
      title: t('liveRecorded.realOperations.title'),
      description: t('liveRecorded.realOperations.description')
    }
  ];

  const features = [
    t('liveRecorded.features.newRecordings'),
    t('liveRecorded.features.prePostMarket'),
    t('liveRecorded.features.detailedExplanations'),
    t('liveRecorded.features.differentMarkets'),
    t('liveRecorded.features.riskManagement'),
    t('liveRecorded.features.patternIdentification'),
    t('liveRecorded.features.practicalPsychology'),
    t('liveRecorded.features.unlimitedAccess'),
  ];

  const _schedule = [
    { time: '8:00 AM', title: 'Pre-Market Analysis', description: 'Preparación para la apertura del mercado' },
    { time: '9:30 AM', title: 'Trading en Vivo', description: 'Operaciones en tiempo real con explicaciones' },
    { time: '3:00 PM', title: 'Wrap-Up & Q&A', description: 'Revisión del día y preguntas de la comunidad' },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Hero Section */}
      <Paper
        sx={{
          p: 6,
          mb: 6,
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 50%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`
            : `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 50%, ${alpha('#ffffff', 0.95)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.light, 0.5)})`,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={3}>
            <VideoCamera size={48} weight="duotone" color={theme.palette.primary.main} />
            <Box>
              <Typography variant="h3" fontWeight={800} mb={1}>
                {t('liveRecorded.title')}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {t('liveRecorded.subtitle')}
              </Typography>
            </Box>
          </Stack>

          <Typography variant="h5" paragraph sx={{ mb: 3, fontWeight: 300 }}>
            {t('liveRecorded.description')}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4}>
            <Chip 
              icon={<Clock size={16} />} 
              label={t('liveRecorded.mondayToFriday')} 
              color="primary" 
              variant="filled"
            />
            <Chip 
              icon={<Users size={16} />} 
              label={t('liveRecorded.activeCommunity')} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              icon={<Globe size={16} />} 
              label={t('liveRecorded.globalAccess')} 
              color="primary" 
              variant="outlined"
            />
          </Stack>

          {/* Updated Indicator */}
          <Stack direction="row" spacing={2} alignItems="center" mb={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                }}
              />
              <Typography variant="body2" fontWeight={600} color="success.main">
                {t('liveRecorded.updatedDaily')}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {t('liveRecorded.growingLibrary')}
            </Typography>
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
            background: alpha(theme.palette.primary.main, 0.05),
          }}
        />
      </Paper>

      {/* Benefits Section */}
      <Typography variant="h4" fontWeight={700} mb={4} textAlign="center">
        {t('liveRecorded.whyJoinLiveClasses')}
      </Typography>
      
      <Grid container spacing={3} mb={6}>
        {benefits.map((benefit) => (
          <Grid item xs={12} sm={6} md={3} key={benefit.title}>
            <Card
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: isDarkMode
                  ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
                  : `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                  transform: 'translateY(-4px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                },
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
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    color: 'primary.main',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
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

      {/* Content Section */}
      <Paper
        sx={{
          p: 4,
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`
            : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.light, 0.5)})`,
          },
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={3}>
          <CalendarCheck size={28} weight="duotone" style={{ verticalAlign: 'middle', marginRight: 8 }} />
          {t('liveRecorded.whatIncludesEachClass')}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: isDarkMode
                  ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
                  : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 28px ${alpha(theme.palette.primary.main, 0.18)}`,
                  transform: 'translateY(-4px)',
                },
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
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
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
                <Clock size={28} weight="duotone" />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {t('liveRecorded.2HoursContent.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('liveRecorded.2HoursContent.description')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: isDarkMode
                  ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
                  : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 28px ${alpha(theme.palette.primary.main, 0.18)}`,
                  transform: 'translateY(-4px)',
                },
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
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
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
                <ChartLine size={28} weight="duotone" />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {t('liveRecorded.technicalAnalysis.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('liveRecorded.technicalAnalysis.description')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: isDarkMode
                  ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
                  : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 28px ${alpha(theme.palette.primary.main, 0.18)}`,
                  transform: 'translateY(-4px)',
                },
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
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
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
                <Target size={28} weight="duotone" />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {t('liveRecorded.realTrades.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('liveRecorded.realTrades.description')}
              </Typography>
            </Paper>
          </Grid>
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
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
              boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.06)}`,
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
            <Typography variant="h6" fontWeight={700} mb={2} color="primary.main">
              <Lightning size={24} weight="duotone" style={{ verticalAlign: 'middle', marginRight: 8 }} />
              {t('liveRecorded.whatIncludes')}
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
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
              boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.06)}`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${alpha(theme.palette.primary.light, 0.5)}, ${theme.palette.primary.main})`,
              },
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2} color="primary.main">
              <TrendUp size={24} weight="duotone" style={{ verticalAlign: 'middle', marginRight: 8 }} />
              {t('liveRecorded.whatYouLearn')}
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography fontWeight={600} gutterBottom>
                  {t('liveRecorded.advancedTechnicalAnalysis')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('liveRecorded.advancedTechnicalAnalysisDesc')}
                </Typography>
              </Box>
              <Box>
                <Typography fontWeight={600} gutterBottom>
                  {t('liveRecorded.riskManagement')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('liveRecorded.riskManagementDesc')}
                </Typography>
              </Box>
              <Box>
                <Typography fontWeight={600} gutterBottom>
                  {t('liveRecorded.tradingPsychology')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('liveRecorded.tradingPsychologyDesc')}
                </Typography>
              </Box>
              <Box>
                <Typography fontWeight={600} gutterBottom>
                  {t('liveRecorded.multipleApproaches')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('liveRecorded.multipleApproachesDesc')}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Instructors Section */}
      <Paper
        sx={{
          p: 4,
          mb: 6,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`
            : `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.08)}`,
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
        <Typography variant="h5" fontWeight={700} mb={3}>
          <Certificate size={28} weight="duotone" style={{ verticalAlign: 'middle', marginRight: 8 }} />
          {t('liveRecorded.learnFromMijailAndCommunity')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('liveRecorded.learnFromMijailAndCommunityDesc')}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" flexWrap="wrap">
          <Chip
            icon={<BookOpen size={16} />}
            label={t('liveRecorded.expertMentor')}
            variant="outlined"
            sx={{ borderColor: alpha(theme.palette.primary.main, 0.3), color: 'primary.main' }}
          />
          <Chip
            icon={<ChartLine size={16} />}
            label={t('liveRecorded.realExperience')}
            variant="outlined"
            sx={{ borderColor: alpha(theme.palette.primary.main, 0.3), color: 'primary.main' }}
          />
          <Chip
            icon={<Users size={16} />}
            label={t('liveRecorded.activeCommunitySupport')}
            variant="outlined"
            sx={{ borderColor: alpha(theme.palette.primary.main, 0.3), color: 'primary.main' }}
          />
        </Stack>
      </Paper>

      {/* Recorded Classes Section */}
      <Paper
        sx={{
          p: 4,
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
            : `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`,
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
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            <BookOpen size={32} weight="duotone" />
          </Box>
          <Typography variant="h5" fontWeight={700}>
            {t('liveRecorded.knowledgeLibrary')}
          </Typography>
        </Stack>
        <Typography variant="body1" paragraph>
          {t('liveRecorded.knowledgeLibraryDesc')}
        </Typography>
        <Typography variant="body1" fontWeight={500} color="primary.main">
          {t('liveRecorded.newRecordingsAddedDaily')}
        </Typography>
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
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 50%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha('#ffffff', 0.95)} 50%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`,
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
          {t('liveRecorded.readyToImprove')}
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          {t('liveRecorded.accessEntireLibrary')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={onStart}
          startIcon={<VideoCamera size={24} weight="bold" />}
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