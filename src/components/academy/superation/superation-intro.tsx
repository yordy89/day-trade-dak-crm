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
  Divider,
} from '@mui/material';
import { 
  Heart,
  Brain,
  Target,
  Sparkle,
  Plant,
  HandCoins,
  HandsPraying,
  Calendar,
  Book,
  YinYang,
  Lightning,
  CheckCircle,
  Clock,
  Certificate,
  DownloadSimple,
} from '@phosphor-icons/react';

interface SuperacionIntroProps {
  onStart: () => void;
  ctaText: string;
}

export default function SuperacionIntro({ onStart, ctaText }: SuperacionIntroProps) {
  const theme = useTheme();
  const { t } = useTranslation('academy');
  const isDarkMode = theme.palette.mode === 'dark';

  const benefits = [
    {
      icon: <HandsPraying size={32} weight="duotone" />,
      title: t('peaceWithMoney.benefits.innerPeace.title'),
      description: t('peaceWithMoney.benefits.innerPeace.description')
    },
    {
      icon: <Brain size={32} weight="duotone" />,
      title: t('peaceWithMoney.benefits.mentalClarity.title'),
      description: t('peaceWithMoney.benefits.mentalClarity.description')
    },
    {
      icon: <Heart size={32} weight="duotone" />,
      title: t('peaceWithMoney.benefits.emotionalStability.title'),
      description: t('peaceWithMoney.benefits.emotionalStability.description')
    },
    {
      icon: <Plant size={32} weight="duotone" />,
      title: t('peaceWithMoney.benefits.sustainableGrowth.title'),
      description: t('peaceWithMoney.benefits.sustainableGrowth.description')
    }
  ];

  const targetAudience = [
    t('peaceWithMoney.targetAudience.frustration'),
    t('peaceWithMoney.targetAudience.emotionalRollercoaster'),
    t('peaceWithMoney.targetAudience.cantRetainMoney'),
    t('peaceWithMoney.targetAudience.internalSabotage'),
    t('peaceWithMoney.targetAudience.beyondTechnicalAnalysis')
  ];

  const whatYouGet = [
    t('peaceWithMoney.whatYouGet.clearStructure'),
    t('peaceWithMoney.whatYouGet.practicalTools'),
    t('peaceWithMoney.whatYouGet.keysToWork'),
    t('peaceWithMoney.whatYouGet.energeticTechniques'),
    t('peaceWithMoney.whatYouGet.solidFoundation')
  ];

  const includes = [
    { icon: <Book size={20} />, text: t('peaceWithMoney.includes.21Lessons') },
    { icon: <DownloadSimple size={20} />, text: t('peaceWithMoney.includes.ebook') },
    { icon: <YinYang size={20} weight="duotone" />, text: t('peaceWithMoney.includes.exercises') },
    { icon: <Clock size={20} />, text: t('peaceWithMoney.includes.onlineAccess') },
    { icon: <Calendar size={20} />, text: t('peaceWithMoney.includes.60DaysAccess') },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Hero Section */}
      <Paper
        sx={{
          p: 6,
          mb: 6,
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)} 0%, ${alpha(theme.palette.secondary.dark, 0.1)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.15)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.2),
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={3}>
            <HandCoins size={48} weight="duotone" color={theme.palette.primary.main} />
            <Box>
              <Typography variant="h3" fontWeight={800} mb={1}>
                {t('peaceWithMoney.title')}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {t('peaceWithMoney.subtitle')}
              </Typography>
            </Box>
          </Stack>

          <Typography variant="h5" paragraph sx={{ mb: 3, fontWeight: 300 }}>
            {t('peaceWithMoney.description')}
          </Typography>

          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            {t('peaceWithMoney.mainDescription')}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4}>
            <Chip 
              icon={<Calendar size={16} />} 
              label={t('peaceWithMoney.21Days')} 
              color="primary" 
              variant="filled"
            />
            <Chip 
              icon={<Certificate size={16} />} 
              label={t('peaceWithMoney.authorName')} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              icon={<Clock size={16} />} 
              label={t('peaceWithMoney.60DaysAccess')} 
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
        {t('peaceWithMoney.whatYouTransform')}
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

      {/* Target Audience Section */}
      <Grid container spacing={4} mb={6}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, height: '100%', bgcolor: alpha(theme.palette.success.main, 0.05) }}>
            <Typography variant="h6" fontWeight={700} mb={2} color="success.main">
              <Target size={24} weight="duotone" style={{ verticalAlign: 'middle', marginRight: 8 }} />
              {t('peaceWithMoney.forYouIf')}
            </Typography>
            <List sx={{ '& .MuiListItem-root': { py: 0.5 } }}>
              {targetAudience.map((item, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircle size={20} weight="fill" color={theme.palette.success.main} />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, height: '100%', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <Typography variant="h6" fontWeight={700} mb={2} color="primary.main">
              <Lightning size={24} weight="duotone" style={{ verticalAlign: 'middle', marginRight: 8 }} />
              {t('peaceWithMoney.whatYouReceive')}
            </Typography>
            <List sx={{ '& .MuiListItem-root': { py: 0.5 } }}>
              {whatYouGet.map((item, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircle size={20} weight="fill" color={theme.palette.primary.main} />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* What's Included Section */}
      <Paper sx={{ p: 4, mb: 6, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          <Book size={28} weight="duotone" style={{ verticalAlign: 'middle', marginRight: 8 }} />
          {t('peaceWithMoney.courseIncludes')}
        </Typography>
        
        <Grid container spacing={2}>
          {includes.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1 }}>
                <Box sx={{ color: 'primary.main' }}>{item.icon}</Box>
                <Typography>{item.text}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* What it is / What it isn't */}
      <Grid container spacing={3} mb={6}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, height: '100%', border: '1px solid', borderColor: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.02) }}>
            <Typography variant="h6" fontWeight={700} mb={2} color="error.main">
              ❌ {t('peaceWithMoney.thisIsNot')}
            </Typography>
            <Stack spacing={1}>
              <Typography>• {t('peaceWithMoney.notList.technicalCourse')}</Typography>
              <Typography>• {t('peaceWithMoney.notList.quickProfit')}</Typography>
              <Typography>• {t('peaceWithMoney.notList.spiritualPath')}</Typography>
            </Stack>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, height: '100%', border: '1px solid', borderColor: 'success.main', bgcolor: alpha(theme.palette.success.main, 0.02) }}>
            <Typography variant="h6" fontWeight={700} mb={2} color="success.main">
              ✅ {t('peaceWithMoney.thisIs')}
            </Typography>
            <Stack spacing={1}>
              <Typography>• {t('peaceWithMoney.isList.doorToRelationship')}</Typography>
              <Typography>• {t('peaceWithMoney.isList.innerWork')}</Typography>
              <Typography>• {t('peaceWithMoney.isList.baseForTrading')}</Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Why are you struggling? */}
      <Paper
        sx={{
          p: 4,
          mb: 6,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, transparent 100%)`,
          border: '1px solid',
          borderColor: alpha(theme.palette.secondary.main, 0.2),
        }}
      >
        <Brain size={48} weight="duotone" color={theme.palette.secondary.main} />
        <Typography variant="h5" fontWeight={700} my={2}>
          {t('peaceWithMoney.whyStruggles')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('peaceWithMoney.strugglesAnswer')}
        </Typography>
      </Paper>

      {/* Instructor Section */}
      <Paper sx={{ p: 4, mb: 6, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          {t('peaceWithMoney.yourInstructor')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('peaceWithMoney.instructorBio')}
        </Typography>
      </Paper>

      {/* Bonus Section */}
      <Paper
        sx={{
          p: 4,
          mb: 6,
          background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.light, 0.05)} 100%)`,
          border: '1px solid',
          borderColor: alpha(theme.palette.warning.main, 0.3),
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Sparkle size={32} weight="fill" color={theme.palette.warning.main} />
          <Typography variant="h5" fontWeight={700}>
            🎁 {t('peaceWithMoney.exclusiveBonus')}
          </Typography>
        </Stack>
        <Typography variant="body1">
          {t('peaceWithMoney.bonusDescription')}
        </Typography>
      </Paper>

      {/* CTA Section */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700} mb={2}>
          {t('peaceWithMoney.readyToTransform')}
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          {t('peaceWithMoney.startJourney')}
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          onClick={onStart}
          startIcon={<Heart size={24} weight="bold" />}
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