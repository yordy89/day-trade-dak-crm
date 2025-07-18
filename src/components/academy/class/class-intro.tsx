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
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)} 0%, ${alpha(theme.palette.info.dark, 0.1)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.15)} 0%, ${alpha(theme.palette.info.light, 0.05)} 100%)`,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.2),
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
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
              {t('liveRecorded.moreThan100Classes')}
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
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box 
                  sx={{ 
                    mb: 2, 
                    color: 'primary.main',
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

      {/* Content Section */}
      <Paper sx={{ p: 4, mb: 6, border: '1px solid', borderColor: 'divider' }}>
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
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                height: '100%',
              }}
            >
              <Clock size={32} weight="duotone" color={theme.palette.primary.main} style={{ marginBottom: 16 }} />
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
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                height: '100%',
              }}
            >
              <ChartLine size={32} weight="duotone" color={theme.palette.primary.main} style={{ marginBottom: 16 }} />
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
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                height: '100%',
              }}
            >
              <Target size={32} weight="duotone" color={theme.palette.primary.main} style={{ marginBottom: 16 }} />
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
          <Paper sx={{ p: 4, height: '100%', bgcolor: alpha(theme.palette.success.main, 0.05) }}>
            <Typography variant="h6" fontWeight={700} mb={2} color="success.main">
              <Lightning size={24} weight="duotone" style={{ verticalAlign: 'middle', marginRight: 8 }} />
              {t('liveRecorded.whatIncludes')}
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
                  {t('liveRecorded.multipleStrategies')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('liveRecorded.multipleStrategiesDesc')}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Instructors Section */}
      <Paper sx={{ p: 4, mb: 6, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          <Certificate size={28} weight="duotone" style={{ verticalAlign: 'middle', marginRight: 8 }} />
          {t('liveRecorded.learnFromProfessionals')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('liveRecorded.learnFromProfessionalsDesc')}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
          <Chip icon={<BookOpen size={16} />} label={t('liveRecorded.10YearsExperience')} variant="outlined" />
          <Chip icon={<ChartLine size={16} />} label={t('liveRecorded.thousandsSuccessfulTrades')} variant="outlined" />
          <Chip icon={<Users size={16} />} label={t('liveRecorded.hundredsStudents')} variant="outlined" />
        </Stack>
      </Paper>

      {/* Recorded Classes Section */}
      <Paper
        sx={{
          p: 4,
          mb: 6,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 100%)`,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.2),
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <BookOpen size={32} weight="duotone" color={theme.palette.primary.main} />
          <Typography variant="h5" fontWeight={700}>
            {t('liveRecorded.knowledgeLibrary')}
          </Typography>
        </Stack>
        <Typography variant="body1" paragraph>
          {t('liveRecorded.knowledgeLibraryDesc')}
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {t('liveRecorded.newRecordingsAddedDaily')}
        </Typography>
      </Paper>

      {/* CTA Section */}
      <Box sx={{ textAlign: 'center' }}>
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