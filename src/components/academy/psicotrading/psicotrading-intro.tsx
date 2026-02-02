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
                position: 'relative',
                overflow: 'hidden',
                background: isDarkMode
                  ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.12)} 100%)`
                  : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.25)}`,
                  transform: 'translateY(-4px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
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

      {/* Target Audience */}
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
          <Paper
            sx={{
              p: 4,
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              background: isDarkMode
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.error.main, 0.08)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.error.main, 0.04)} 100%)`,
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              boxShadow: `0 6px 24px ${alpha(theme.palette.error.main, 0.12)}`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.error.light}, ${theme.palette.error.main})`,
              },
            }}
          >
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
          position: 'relative',
          overflow: 'hidden',
          background: isDarkMode
            ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 50%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
            : `linear-gradient(180deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 50%, ${alpha('#ffffff', 0.98)} 100%)`,
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
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          },
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
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
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
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
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
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
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
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
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
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            color: 'primary.main',
            boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <TrendUp size={40} weight="duotone" />
        </Box>
        <Typography variant="h5" fontWeight={700} my={2}>
          {t('psicotrading.transformYourTrading')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('psicotrading.successfulTradingDescription')}
        </Typography>
        <Typography variant="body1" fontWeight={500} color="primary.main">
          {t('psicotrading.improveAsPersonAndTrader')}
        </Typography>
      </Paper>

      {/* CTA Section */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 4,
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