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
  useTheme,
  alpha,
} from '@mui/material';
import { 
  Brain, 
  Target, 
  TrendUp, 
  Lightning, 
  Heart,
  ChartLine,
  MedalMilitary,
  Sparkle,
  CheckCircle,
  Users,
  Clock,
  Certificate,
} from '@phosphor-icons/react';

interface PsicoTradingIntroProps {
  onStart: () => void;
  ctaText: string;
}

export default function PsicoTradingIntro({ onStart, ctaText }: PsicoTradingIntroProps) {
  const theme = useTheme();
  const { t } = useTranslation('academy');
  const isDarkMode = theme.palette.mode === 'dark';

  const benefits = [
    {
      icon: <Brain size={32} weight="duotone" />,
      title: t('psicotrading.mentalMastery.title'),
      description: t('psicotrading.mentalMastery.description')
    },
    {
      icon: <Target size={32} weight="duotone" />,
      title: t('psicotrading.laserFocus.title'),
      description: t('psicotrading.laserFocus.description')
    },
    {
      icon: <Heart size={32} weight="duotone" />,
      title: t('psicotrading.emotionalManagement.title'),
      description: t('psicotrading.emotionalManagement.description')
    },
    {
      icon: <ChartLine size={32} weight="duotone" />,
      title: t('psicotrading.consistentPerformance.title'),
      description: t('psicotrading.consistentPerformance.description')
    }
  ];

  const features = [
    t('psicotrading.features.oneOnOne'),
    t('psicotrading.features.personalizedEvaluation'),
    t('psicotrading.features.adaptedPlan'),
    t('psicotrading.features.advancedEmotional'),
    t('psicotrading.features.mindfulness'),
    t('psicotrading.features.fearGreedTools'),
    t('psicotrading.features.disciplinePatience'),
    t('psicotrading.features.lossManagement'),
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
          <Stack direction="row" spacing={2} alignItems="center" mb={3}>
            <Brain size={48} weight="duotone" color={theme.palette.primary.main} />
            <Box>
              <Typography variant="h3" fontWeight={800} mb={1}>
                {t('psicotrading.title')}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {t('psicotrading.subtitle')}
              </Typography>
            </Box>
          </Stack>

          <Typography variant="h5" paragraph sx={{ mb: 3, fontWeight: 300 }}>
            {t('psicotrading.description')}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4}>
            <Chip 
              icon={<Users size={16} />} 
              label={t('psicotrading.sessions1to1')} 
              color="primary" 
              variant="filled"
            />
            <Chip 
              icon={<Clock size={16} />} 
              label={t('psicotrading.personalizedPlan')} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              icon={<Certificate size={16} />} 
              label={t('psicotrading.certifiedPsychologist')} 
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
        {t('psicotrading.whatYouAchieve')}
      </Typography>
      
      <Grid container spacing={3} mb={6}>
        {benefits.map((benefit, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
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

      {/* Features Section */}
      <Paper sx={{ p: 4, mb: 6, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          <MedalMilitary size={28} weight="duotone" style={{ verticalAlign: 'middle', marginRight: 8 }} />
          {t('psicotrading.whatIncludesPsicoTradingElite')}
        </Typography>
        
        <Grid container spacing={2}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1 }}>
                <CheckCircle size={24} weight="fill" color={theme.palette.success.main} />
                <Typography>{feature}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Target Audience */}
      <Grid container spacing={4} mb={6}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, height: '100%', bgcolor: alpha(theme.palette.success.main, 0.05) }}>
            <Typography variant="h6" fontWeight={700} mb={2} color="success.main">
              <CheckCircle size={24} weight="duotone" style={{ verticalAlign: 'middle', marginRight: 8 }} />
              {t('psicotrading.thisProgramIsForYou')}
            </Typography>
            <Stack spacing={2}>
              <Typography>• {t('psicotrading.forYou.emotionsControl')}</Typography>
              <Typography>• {t('psicotrading.forYou.lostMoneyFear')}</Typography>
              <Typography>• {t('psicotrading.forYou.developDiscipline')}</Typography>
              <Typography>• {t('psicotrading.forYou.seekConsistency')}</Typography>
              <Typography>• {t('psicotrading.forYou.readyToWork')}</Typography>
              <Typography>• {t('psicotrading.forYou.maximizePotential')}</Typography>
            </Stack>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, height: '100%', bgcolor: alpha(theme.palette.error.main, 0.05) }}>
            <Typography variant="h6" fontWeight={700} mb={2} color="error.main">
              <Lightning size={24} weight="duotone" style={{ verticalAlign: 'middle', marginRight: 8 }} />
              {t('psicotrading.notForYou')}
            </Typography>
            <Stack spacing={2}>
              <Typography>• {t('psicotrading.notForYou.magicSolution')}</Typography>
              <Typography>• {t('psicotrading.notForYou.notWillingToWork')}</Typography>
              <Typography>• {t('psicotrading.notForYou.onlyTechnicalAnalysis')}</Typography>
              <Typography>• {t('psicotrading.notForYou.noTimeForSessions')}</Typography>
              <Typography>• {t('psicotrading.notForYou.immediateResults')}</Typography>
              <Typography>• {t('psicotrading.notForYou.notOpenToChange')}</Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Process Section */}
      <Paper 
        sx={{ 
          p: 4, 
          mb: 6,
          background: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
          {t('psicotrading.howItWorks')}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Box 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                }}
              >
                1
              </Box>
              <Typography variant="h6">{t('psicotrading.steps.initialEvaluation')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('psicotrading.steps.initialEvaluationDesc')}
              </Typography>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Box 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                }}
              >
                2
              </Box>
              <Typography variant="h6">{t('psicotrading.steps.personalizedPlan')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('psicotrading.steps.personalizedPlanDesc')}
              </Typography>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Box 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                }}
              >
                3
              </Box>
              <Typography variant="h6">{t('psicotrading.steps.sessions1to1')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('psicotrading.steps.sessions1to1Desc')}
              </Typography>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Box 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                }}
              >
                4
              </Box>
              <Typography variant="h6">{t('psicotrading.steps.results')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('psicotrading.steps.resultsDesc')}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Testimonial */}
      <Paper
        sx={{
          p: 4,
          mb: 6,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 100%)`,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.2),
        }}
      >
        <TrendUp size={48} weight="duotone" color={theme.palette.primary.main} />
        <Typography variant="h5" fontWeight={700} my={2}>
          {t('psicotrading.transformYourTrading')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('psicotrading.successfulTradingDescription')}
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {t('psicotrading.improveAsPersonAndTrader')}
        </Typography>
      </Paper>

      {/* CTA Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={700} mb={2}>
          {t('psicotrading.readyToMasterYourMind')}
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          {t('psicotrading.startYourTransformation')}
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          onClick={onStart}
          startIcon={<Brain size={24} weight="bold" />}
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