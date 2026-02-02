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
  Crown,
  Lightning,
  ChartLine,
  Brain,
  Target,
  TrendUp,
  Sparkle,
  CheckCircle,
  Certificate,
  BookOpen,
  Diamond,
} from '@phosphor-icons/react';

interface MasterClasesIntroProps {
  onStart: () => void;
  ctaText: string;
}

export default function MasterClasesIntro({ onStart, ctaText }: MasterClasesIntroProps) {
  const theme = useTheme();
  const { t } = useTranslation('academy');
  const isDarkMode = theme.palette.mode === 'dark';

  const benefits = [
    {
      icon: <Crown size={32} weight="duotone" />,
      title: t('masterclass.exclusiveContent.title'),
      description: t('masterclass.exclusiveContent.description')
    },
    {
      icon: <Brain size={32} weight="duotone" />,
      title: t('masterclass.professionalLevel.title'),
      description: t('masterclass.professionalLevel.description')
    },
    {
      icon: <Diamond size={32} weight="duotone" />,
      title: t('masterclass.highValue.title'),
      description: t('masterclass.highValue.description')
    },
    {
      icon: <Target size={32} weight="duotone" />,
      title: t('masterclass.realCases.title'),
      description: t('masterclass.realCases.description')
    }
  ];

  const features = [
    t('masterclass.features.institutionalTrading'),
    t('masterclass.features.marketStructure'),
    t('masterclass.features.professionalRisk'),
    t('masterclass.features.advancedPsychology'),
    t('masterclass.features.orderFlow'),
    t('masterclass.features.algorithms'),
    t('masterclass.features.portfolioManagement'),
    t('masterclass.features.unlimitedAccess'),
  ];

  const topics = [
    { 
      title: t('masterclass.topics.institutional.title'), 
      description: t('masterclass.topics.institutional.description'),
      icon: <ChartLine size={24} weight="duotone" />
    },
    { 
      title: t('masterclass.topics.advancedManagement.title'), 
      description: t('masterclass.topics.advancedManagement.description'),
      icon: <Target size={24} weight="duotone" />
    },
    { 
      title: t('masterclass.topics.deepAnalysis.title'), 
      description: t('masterclass.topics.deepAnalysis.description'),
      icon: <Brain size={24} weight="duotone" />
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
            <Crown size={48} weight="duotone" color={theme.palette.primary.main} />
            <Box>
              <Typography variant="h3" fontWeight={800} mb={1}>
                {t('masterclass.title')}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {t('masterclass.subtitle')}
              </Typography>
            </Box>
          </Stack>

          <Typography variant="h5" paragraph sx={{ mb: 3, fontWeight: 300 }}>
            {t('masterclass.description')}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4}>
            <Chip 
              icon={<Crown size={16} />} 
              label={t('masterclass.premiumContent')} 
              color="primary" 
              variant="filled"
            />
            <Chip 
              icon={<Certificate size={16} />} 
              label={t('masterclass.advancedLevel')} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              icon={<Diamond size={16} />} 
              label={t('masterclass.exclusiveAccess')} 
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
            background: alpha(theme.palette.primary.main, 0.05),
          }}
        />
      </Paper>

      {/* Benefits Section */}
      <Typography variant="h4" fontWeight={700} mb={4} textAlign="center">
        {t('masterclass.whyMasterClasses')}
      </Typography>
      
      <Grid container spacing={3} mb={6}>
        {benefits.map((benefit, index) => (
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

      {/* Topics Section */}
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
          <BookOpen size={28} weight="duotone" style={{ verticalAlign: 'middle', marginRight: 8 }} />
          {t('masterclass.topics.title')}
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
                    ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
                    : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 8px 28px ${alpha(theme.palette.primary.main, 0.18)}`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
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
              {t('masterclass.includedContent')}
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
              {t('masterclass.expectedResults')}
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography fontWeight={600} gutterBottom>
                  {t('masterclass.professionalTrading')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('masterclass.professionalTradingDesc')}
                </Typography>
              </Box>
              <Box>
                <Typography fontWeight={600} gutterBottom>
                  {t('masterclass.advancedManagement')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('masterclass.advancedManagementDesc')}
                </Typography>
              </Box>
              <Box>
                <Typography fontWeight={600} gutterBottom>
                  {t('masterclass.deepAnalysis')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('masterclass.deepAnalysisDesc')}
                </Typography>
              </Box>
              <Box>
                <Typography fontWeight={600} gutterBottom>
                  {t('masterclass.consistency')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('masterclass.consistencyDesc')}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Exclusive Content Section */}
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
            <Diamond size={32} weight="duotone" />
          </Box>
          <Typography variant="h5" fontWeight={700}>
            {t('masterclass.exclusiveUpdated')}
          </Typography>
        </Stack>
        <Typography variant="body1" paragraph>
          {t('masterclass.exclusiveUpdatedDesc')}
        </Typography>
        <Typography variant="body1" fontWeight={500} color="primary.main">
          {t('masterclass.newClassesAdded')}
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
          {t('masterclass.elevateYourTrading')}
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          {t('masterclass.accessExclusiveKnowledge')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={onStart}
          startIcon={<Crown size={24} weight="bold" />}
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