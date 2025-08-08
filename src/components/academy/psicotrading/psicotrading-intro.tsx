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
  Sparkle,
  CheckCircle,
  BookOpen,
  Video,
  HandHeart,
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
            <Brain size={48} weight="duotone" color={theme.palette.primary.main} />
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
                {t('psicotrading.title')}
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                {t('psicotrading.subtitle')}
              </Typography>
            </Box>
          </Stack>

          <Typography 
            variant="h5" 
            paragraph 
            sx={{ 
              mb: 3, 
              fontWeight: 300,
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              lineHeight: 1.6,
            }}
          >
            {t('psicotrading.description')}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4}>
            <Chip 
              icon={<Brain size={16} />} 
              label={t('psicotrading.psychologicalTechniques')} 
              color="primary" 
              variant="filled"
            />
            <Chip 
              icon={<Target size={16} />} 
              label={t('psicotrading.emotionalControl')} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              icon={<TrendUp size={16} />} 
              label={t('psicotrading.mentalPerformance')} 
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
              {t('psicotrading.notForYouTitle')}
            </Typography>
            <Stack spacing={2}>
              <Typography>• {t('psicotrading.notForYou.magicSolution')}</Typography>
              <Typography>• {t('psicotrading.notForYou.notWillingToWork')}</Typography>
              <Typography>• {t('psicotrading.notForYou.onlyTechnicalAnalysis')}</Typography>
              <Typography>• {t('psicotrading.notForYou.noTimeForLearning')}</Typography>
              <Typography>• {t('psicotrading.notForYou.immediateResults')}</Typography>
              <Typography>• {t('psicotrading.notForYou.notOpenToChange')}</Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Process Section - Updated */}
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
                }}
              >
                <Video size={28} weight="bold" />
              </Box>
              <Typography variant="h6">{t('psicotrading.steps.accessContent')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('psicotrading.steps.accessContentDesc')}
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
                }}
              >
                <BookOpen size={28} weight="bold" />
              </Box>
              <Typography variant="h6">{t('psicotrading.steps.learnConcepts')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('psicotrading.steps.learnConceptsDesc')}
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
                }}
              >
                <HandHeart size={28} weight="bold" />
              </Box>
              <Typography variant="h6">{t('psicotrading.steps.practiceExercises')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('psicotrading.steps.practiceExercisesDesc')}
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
                }}
              >
                <TrendUp size={28} weight="bold" />
              </Box>
              <Typography variant="h6">{t('psicotrading.steps.applyKnowledge')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('psicotrading.steps.applyKnowledgeDesc')}
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