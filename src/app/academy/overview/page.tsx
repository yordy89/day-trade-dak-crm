'use client';

import * as React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Paper,
  Button,
  Stack,
  Chip,
  LinearProgress,
  useTheme as useMuiTheme,
  alpha,
  IconButton,
} from '@mui/material';
import {
  GraduationCap,
  TrendUp,
  Brain,
  Users,
  ChartLine,
  Trophy,
  Clock,
  ArrowRight,
  PlayCircle,
  CheckCircle,
  Star,
  Target,
  Sparkle,
  ChalkboardTeacher,
  Lightning,
  Fire,
  Calendar,
  Crown,
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/theme/theme-provider';
import { useClientAuth } from '@/hooks/use-client-auth';
import { paths } from '@/paths';
import { useTranslation } from 'react-i18next';

// Modern gradient background
const ModernBackground = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <Box
    sx={{
      position: 'absolute',
      top: -100,
      right: -100,
      width: 400,
      height: 400,
      background: `radial-gradient(circle, ${
        isDarkMode 
          ? 'rgba(22, 163, 74, 0.08)' 
          : 'rgba(22, 163, 74, 0.06)'
      } 0%, transparent 70%)`,
      filter: 'blur(40px)',
      pointerEvents: 'none',
    }}
  />
);

// Modern progress card
const ModernProgressCard = ({ 
  title, 
  value, 
  total, 
  icon, 
  color,
  trend,
  progressLabel = 'Progress',
}: { 
  title: string; 
  value: number; 
  total: number; 
  icon: React.ReactNode; 
  color: string;
  trend?: number;
  progressLabel?: string;
}) => {
  const progress = (value / total) * 100;
  const theme = useMuiTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        position: 'relative',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          borderColor: alpha(color, 0.3),
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: alpha(color, 0.1),
                color,
              }}
            >
              {icon}
            </Box>
            {trend ? (
              <Chip
                size="small"
                icon={<TrendUp size={14} />}
                label={`+${trend}%`}
                sx={{
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: 'success.main',
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    color: 'success.main',
                  }
                }}
              />
            ) : null}
          </Box>
          
          <Box>
            <Typography variant="h3" fontWeight={800} color={color}>
              {value}
              <Typography component="span" variant="h5" color="text.secondary" sx={{ ml: 1 }}>
                / {total}
              </Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {title}
            </Typography>
          </Box>
          
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {progressLabel}
              </Typography>
              <Typography variant="caption" fontWeight={600} color={color}>
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(color, 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: color,
                  borderRadius: 3,
                }
              }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Modern learning path card
const ModernPathCard = ({ 
  title, 
  description,
  icon, 
  path,
  color,
  isNew = false,
  progress = 0,
  percentCompletedText = 'completed',
  newLabel = 'NEW',
  exploreLabel = 'Explore',
}: { 
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  isNew?: boolean;
  progress?: number;
  percentCompletedText?: string;
  newLabel?: string;
  exploreLabel?: string;
}) => {
  const router = useRouter();
  const theme = useMuiTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'visible',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[12],
          borderColor: alpha(color, 0.3),
          '& .hover-arrow': {
            transform: 'translateX(4px)',
          }
        }
      }}
      onClick={() => router.push(path)}
    >
      {isNew ? (
        <Chip
          label={newLabel}
          size="small"
          sx={{
            position: 'absolute',
            top: -10,
            right: 16,
            bgcolor: 'error.main',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.7rem',
            height: 24,
          }}
        />
      ) : null}
      
      <CardContent sx={{ p: 3, height: '100%' }}>
        <Stack spacing={2} height="100%">
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${alpha(color, 0.15)} 0%, ${alpha(color, 0.05)} 100%)`,
              color,
              mb: 1,
            }}
          >
            {icon}
          </Box>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {description}
            </Typography>
          </Box>
          
          {progress > 0 && (
            <Box>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: alpha(color, 0.1),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: color,
                    borderRadius: 2,
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {progress}% {percentCompletedText}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', color, fontWeight: 600 }}>
            <Typography variant="button" sx={{ mr: 1 }}>
              {exploreLabel}
            </Typography>
            <ArrowRight size={20} className="hover-arrow" style={{ transition: 'transform 0.2s' }} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Achievement badge
const AchievementBadge = ({ icon, title, date }: { icon: React.ReactNode; title: string; date: string }) => {
  const theme = useMuiTheme();
  
  return (
    <Paper
      sx={{
        p: 2,
        textAlign: 'center',
        border: '2px solid',
        borderColor: theme.palette.warning.main,
        background: alpha(theme.palette.warning.main, 0.05),
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          margin: '0 auto',
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.palette.warning.main,
        }}
      >
        {icon}
      </Box>
      <Typography variant="subtitle2" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {date}
      </Typography>
    </Paper>
  );
};

export default function AcademyOverviewPage(): React.JSX.Element {
  const theme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const { user } = useClientAuth();
  const { t } = useTranslation('academy');
  
  // Add CSS animation for pulse effect
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.2);
          opacity: 0.7;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Mock data - replace with real data from API
  const stats = {
    coursesCompleted: 3,
    totalCourses: 12,
    hoursLearned: 24,
    totalHours: 100,
    achievements: 5,
    totalAchievements: 20,
    analysisCompleted: 15,
    totalAnalysis: 50,
  };
  
  const learningPaths = [
    {
      title: t('overview.tradingCourses.title'),
      description: t('overview.tradingCourses.description'),
      icon: <GraduationCap size={32} weight="duotone" />,
      path: paths.academy.courses,
      color: theme.palette.primary.main,
      progress: 25,
    },
    {
      title: t('overview.mentorship.title'),
      description: t('overview.mentorship.description'),
      icon: <ChalkboardTeacher size={32} weight="duotone" />,
      path: paths.academy.mentorship,
      color: theme.palette.info.main,
      isNew: true,
    },
    {
      title: t('overview.liveClasses.title'),
      description: t('overview.liveClasses.description'),
      icon: <Users size={32} weight="duotone" />,
      path: paths.academy.class,
      color: theme.palette.secondary.main,
      progress: 60,
    },
    {
      title: t('overview.psicoTradingElite.title'),
      description: t('overview.psicoTradingElite.description'),
      icon: <Brain size={32} weight="duotone" />,
      path: paths.academy.psicotrading,
      color: theme.palette.success.main,
    },
  ];
  
  const recentAchievements = [
    { icon: <Fire size={40} weight="fill" />, title: t('overview.firstStreak'), date: t('overview.daysAgo', { days: 2 }) },
    { icon: <Target size={40} weight="fill" />, title: t('overview.tenAnalysis'), date: t('overview.weekAgo') },
    { icon: <Trophy size={40} weight="fill" />, title: t('overview.courseCompleted'), date: t('overview.weeksAgo', { weeks: 2 }) },
  ];
  
  return (
    <Box sx={{ position: 'relative' }}>
      <ModernBackground isDarkMode={isDarkMode} />
      
      {/* Hero Section */}
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <Box>
                <Typography 
                  variant="h2" 
                  fontWeight={800}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  {t('overview.welcome', { name: user?.firstName || 'Trader' })}
                </Typography>
                <Typography variant="h5" color="text.secondary" fontWeight={400}>
                  {t('overview.welcomeSubtitle')}
                </Typography>
              </Box>
              
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Chip 
                  icon={<Fire size={16} />} 
                  label={t('overview.daysStreak', { days: 7 })}
                  sx={{ 
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    color: 'error.main',
                    fontWeight: 600,
                    '& .MuiChip-icon': { color: 'error.main' }
                  }}
                />
                <Chip 
                  icon={<Lightning size={16} />} 
                  label={t('overview.hoursLearning', { hours: stats.hoursLearned })}
                  sx={{ 
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    color: 'warning.main',
                    fontWeight: 600,
                    '& .MuiChip-icon': { color: 'warning.main' }
                  }}
                />
                <Chip 
                  icon={<Trophy size={16} />} 
                  label={t('overview.achievements', { count: stats.achievements })}
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: 'success.main',
                    fontWeight: 600,
                    '& .MuiChip-icon': { color: 'success.main' }
                  }}
                />
              </Stack>
              
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayCircle size={20} />}
                onClick={() => router.push(paths.academy.courses)}
                sx={{
                  alignSelf: 'flex-start',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  }
                }}
              >
                {t('overview.continueLearning')}
              </Button>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                position: 'relative',
                height: 300,
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChartLine 
                size={200} 
                weight="duotone" 
                color={alpha(theme.palette.primary.main, 0.1)}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Sparkle
                  size={40}
                  weight="fill"
                  color={theme.palette.warning.main}
                  style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    animation: 'pulse 2s infinite',
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* Progress Cards */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
          {t('overview.yourProgress')}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={3}>
            <ModernProgressCard
              title={t('overview.coursesCompleted')}
              value={stats.coursesCompleted}
              total={stats.totalCourses}
              icon={<GraduationCap size={24} weight="bold" />}
              color={theme.palette.primary.main}
              trend={15}
              progressLabel={t('stats.progress')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <ModernProgressCard
              title={t('overview.studyHours')}
              value={stats.hoursLearned}
              total={stats.totalHours}
              icon={<Clock size={24} weight="bold" />}
              color={theme.palette.info.main}
              trend={8}
              progressLabel={t('stats.progress')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <ModernProgressCard
              title={t('overview.achievementsEarned')}
              value={stats.achievements}
              total={stats.totalAchievements}
              icon={<Trophy size={24} weight="bold" />}
              color={theme.palette.warning.main}
              progressLabel={t('stats.progress')}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <ModernProgressCard
              title={t('overview.analysisCompleted')}
              value={stats.analysisCompleted}
              total={stats.totalAnalysis}
              icon={<Target size={24} weight="bold" />}
              color={theme.palette.success.main}
              trend={25}
              progressLabel={t('stats.progress')}
            />
          </Grid>
        </Grid>
      </Box>
      
      {/* Learning Paths */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            {t('overview.learningPaths')}
          </Typography>
          <Button
            endIcon={<ArrowRight size={20} />}
            sx={{ color: 'text.secondary' }}
            onClick={() => router.push(paths.academy.subscriptions.plans)}
          >
            {t('overview.viewAll')}
          </Button>
        </Box>
        <Grid container spacing={3}>
          {learningPaths.map((path, _index) => (
            <Grid item xs={12} sm={6} lg={3} key={path.path}>
              <ModernPathCard 
                {...path} 
                percentCompletedText={t('overview.completed')} 
                newLabel={t('overview.new')}
                exploreLabel={t('overview.explore')}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Recent Achievements & Next Steps */}
      <Grid container spacing={4}>
        {/* Recent Achievements */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight={700}>
                {t('overview.recentAchievements')}
              </Typography>
              <IconButton size="small">
                <Star size={20} />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              {recentAchievements.map((achievement, _index) => (
                <Grid item xs={4} key={achievement.title}>
                  <AchievementBadge {...achievement} />
                </Grid>
              ))}
            </Grid>
            <Button
              fullWidth
              sx={{ mt: 3 }}
              endIcon={<ArrowRight size={20} />}
            >
              {t('overview.viewAllAchievements')}
            </Button>
          </Paper>
        </Grid>
        
        {/* Next Steps */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 4,
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              background: isDarkMode
                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.05)} 0%, transparent 100%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, transparent 100%)`,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight={700}>
                {t('quickActions.title')}
              </Typography>
              <IconButton size="small">
                <Calendar size={20} />
              </IconButton>
            </Box>
            <Stack spacing={2}>
              <Card
                variant="outlined"
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <CheckCircle size={24} color={theme.palette.success.main} weight="fill" />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {t('quickActions.completeModule')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('quickActions.lessonsRemaining', { count: 2 })}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
              
              <Card
                variant="outlined"
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <PlayCircle size={24} color={theme.palette.primary.main} weight="fill" />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {t('quickActions.joinLiveClass')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('courses.advancedStrategies.title')} - 2:00 PM EST
                    </Typography>
                  </Box>
                </Stack>
              </Card>
              
              <Card
                variant="outlined"
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Brain size={24} color={theme.palette.secondary.main} weight="fill" />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {t('quickActions.tryPsicoTrading')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('quickActions.firstSessionFree')}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      
      {/* CTA Section */}
      <Paper
        sx={{
          mt: 6,
          p: 5,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.2),
        }}
      >
        <Lightning
          size={80}
          weight="duotone"
          style={{
            position: 'absolute',
            top: -20,
            right: -20,
            opacity: 0.1,
            color: theme.palette.primary.main,
            transform: 'rotate(-15deg)',
          }}
        />
        <Stack spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Chip
            icon={<Sparkle size={16} />}
            label={t('overview.trending')}
            color="primary"
            sx={{ fontWeight: 600 }}
          />
          <Typography variant="h4" fontWeight={800}>
            {t('subscriptions.title')}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
            {t('subscriptions.subtitle')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Crown size={20} />}
            onClick={() => router.push(paths.academy.subscriptions.plans)}
            sx={{
              px: 5,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[8],
              }
            }}
          >
            {t('account.upgradeSubscription')}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

