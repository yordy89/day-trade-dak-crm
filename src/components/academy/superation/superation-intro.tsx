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
        {benefits.map((benefit, index) => {
          const colors = [
            theme.palette.primary.main,
            theme.palette.info.main,
            theme.palette.error.main,
            theme.palette.success.main,
          ];
          const color = colors[index % colors.length];

          return (
            <Grid item xs={12} sm={6} md={3} key={benefit.title}>
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  background: isDarkMode
                    ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(color, 0.08)} 100%)`
                    : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(color, 0.05)} 100%)`,
                  border: `1px solid ${alpha(color, 0.2)}`,
                  boxShadow: `0 4px 20px ${alpha(color, 0.1)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: `0 12px 30px ${alpha(color, 0.2)}`,
                    border: `1px solid ${alpha(color, 0.4)}`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.5)})`,
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${alpha(color, 0.2)} 0%, ${alpha(color, 0.1)} 100%)`,
                        border: `1px solid ${alpha(color, 0.3)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: color,
                      }}
                    >
                      {benefit.icon}
                    </Box>
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
          );
        })}
      </Grid>

      {/* Target Audience Section */}
      <Grid container spacing={4} mb={6}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              background: isDarkMode
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.success.main, 0.08)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              borderRadius: 3,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.2)} 0%, ${alpha(theme.palette.success.main, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Target size={24} weight="duotone" color={theme.palette.success.main} />
              </Box>
              <Typography variant="h6" fontWeight={700} color="success.main">
                {t('peaceWithMoney.forYouIf')}
              </Typography>
            </Stack>
            <List sx={{ '& .MuiListItem-root': { py: 1 } }}>
              {targetAudience.map((item) => (
                <ListItem
                  key={item}
                  disableGutters
                  sx={{
                    px: 2,
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircle size={20} weight="fill" color={theme.palette.success.main} />
                  </ListItemIcon>
                  <ListItemText primary={item} />
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
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: 3,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Lightning size={24} weight="duotone" color={theme.palette.primary.main} />
              </Box>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                {t('peaceWithMoney.whatYouReceive')}
              </Typography>
            </Stack>
            <List sx={{ '& .MuiListItem-root': { py: 1 } }}>
              {whatYouGet.map((item) => (
                <ListItem
                  key={item}
                  disableGutters
                  sx={{
                    px: 2,
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircle size={20} weight="fill" color={theme.palette.primary.main} />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* What&apos;s Included Section */}
      <Paper
        sx={{
          p: 4,
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.warning.main, 0.06)} 100%)`
            : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.warning.main, 0.04)} 100%)`,
          border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
          borderRadius: 3,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.2)} 0%, ${alpha(theme.palette.warning.main, 0.1)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Book size={24} weight="duotone" color={theme.palette.warning.main} />
          </Box>
          <Typography variant="h5" fontWeight={700}>
            {t('peaceWithMoney.courseIncludes')}
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          {includes.map((item) => (
            <Grid item xs={12} md={6} key={item.text}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.warning.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                }}
              >
                <Box sx={{ color: theme.palette.warning.main }}>{item.icon}</Box>
                <Typography fontWeight={500}>{item.text}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* What it is / What it isn&apos;t */}
      <Grid container spacing={3} mb={6}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              background: isDarkMode
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.error.main, 0.08)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              borderRadius: 3,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.error.light})`,
              },
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={3} color="error.main">
              ❌ {t('peaceWithMoney.thisIsNot')}
            </Typography>
            <Stack spacing={2}>
              {[
                t('peaceWithMoney.notList.technicalCourse'),
                t('peaceWithMoney.notList.quickProfit'),
                t('peaceWithMoney.notList.spiritualPath'),
              ].map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.error.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                  }}
                >
                  <Typography>• {item}</Typography>
                </Box>
              ))}
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
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.success.main, 0.08)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              borderRadius: 3,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
              },
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={3} color="success.main">
              ✅ {t('peaceWithMoney.thisIs')}
            </Typography>
            <Stack spacing={2}>
              {[
                t('peaceWithMoney.isList.doorToRelationship'),
                t('peaceWithMoney.isList.innerWork'),
                t('peaceWithMoney.isList.baseForTrading'),
              ].map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                  }}
                >
                  <Typography>• {item}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Why are you struggling? */}
      <Paper
        sx={{
          p: 5,
          mb: 6,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
            : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
          border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
          borderRadius: 3,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
          },
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            border: `2px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <Brain size={40} weight="duotone" color={theme.palette.secondary.main} />
        </Box>
        <Typography variant="h5" fontWeight={700} mb={2}>
          {t('peaceWithMoney.whyStruggles')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
          {t('peaceWithMoney.strugglesAnswer')}
        </Typography>
      </Paper>

      {/* Instructor Section */}
      <Paper
        sx={{
          p: 4,
          mb: 6,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.info.main, 0.06)} 100%)`
            : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.info.main, 0.04)} 100%)`,
          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
          borderRadius: 3,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.info.main}, ${theme.palette.info.light})`,
          },
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.2)} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
            border: `2px solid ${alpha(theme.palette.info.main, 0.3)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <Certificate size={32} weight="duotone" color={theme.palette.info.main} />
        </Box>
        <Typography variant="h6" fontWeight={700} mb={2} color="info.main">
          {t('peaceWithMoney.yourInstructor')}
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto' }}>
          {t('peaceWithMoney.instructorBio')}
        </Typography>
      </Paper>

      {/* Bonus Section */}
      <Paper
        sx={{
          p: 4,
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha('#1a1a2e', 0.95)} 0%, ${alpha(theme.palette.warning.main, 0.15)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.light, 0.05)} 100%)`,
          border: `2px solid ${alpha(theme.palette.warning.main, 0.4)}`,
          borderRadius: 3,
          boxShadow: `0 8px 32px ${alpha(theme.palette.warning.main, 0.2)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.3)} 0%, ${alpha(theme.palette.warning.main, 0.1)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.4)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkle size={28} weight="fill" color={theme.palette.warning.main} />
          </Box>
          <Typography variant="h5" fontWeight={700}>
            🎁 {t('peaceWithMoney.exclusiveBonus')}
          </Typography>
        </Stack>
        <Typography variant="body1" sx={{ pl: 9 }}>
          {t('peaceWithMoney.bonusDescription')}
        </Typography>
      </Paper>

      {/* CTA Section */}
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
            : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
          border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          borderRadius: 4,
          boxShadow: `0 8px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          },
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
            border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <Heart size={40} weight="duotone" color={theme.palette.primary.main} />
        </Box>
        <Typography variant="h4" fontWeight={700} mb={2}>
          {t('peaceWithMoney.readyToTransform')}
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4} sx={{ maxWidth: 500, mx: 'auto' }}>
          {t('peaceWithMoney.startJourney')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={onStart}
          startIcon={<Sparkle size={24} weight="bold" />}
          sx={{
            py: 2.5,
            px: 6,
            fontSize: '1.2rem',
            fontWeight: 600,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            boxShadow: '0 8px 24px rgba(22, 163, 74, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
              boxShadow: '0 12px 32px rgba(22, 163, 74, 0.5)',
              transform: 'translateY(-3px)',
            },
          }}
        >
          {ctaText}
        </Button>
      </Paper>
    </Box>
  );
}