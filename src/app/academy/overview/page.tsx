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
  Skeleton,
  useTheme as useMuiTheme,
  alpha,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  GraduationCap,
  Brain,
  Users,
  Trophy,
  ArrowRight,
  PlayCircle,
  Calendar,
  Crown,
  VideoCamera,
  Books,
  ChartLine,
  CreditCard,
  CalendarCheck,
  Info,
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/theme/theme-provider';
import { useClientAuth } from '@/hooks/use-client-auth';
import { paths } from '@/paths';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import API from '@/lib/axios';
import { formatEventDate } from '@/lib/date-utils';
import { useMultipleModuleAccess } from '@/hooks/use-module-access';
import { ModuleType } from '@/types/module-permission';

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

// Stats Card Component
const StatsCard = ({
  title,
  value,
  icon,
  color,
  subtitle,
  loading = false,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  loading?: boolean;
}) => {
  const theme = useMuiTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        border: '1px solid',
        borderColor: isDark ? alpha(color, 0.2) : alpha(color, 0.15),
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        background: isDark
          ? `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha('#000', 0.2)} 100%)`
          : `linear-gradient(135deg, ${alpha(color, 0.04)} 0%, ${alpha('#fff', 0.8)} 100%)`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(color, isDark ? 0.25 : 0.15)}`,
          borderColor: alpha(color, isDark ? 0.4 : 0.3),
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '120px',
          height: '120px',
          background: `radial-gradient(circle, ${alpha(color, isDark ? 0.15 : 0.08)} 0%, transparent 70%)`,
          filter: 'blur(30px)',
          pointerEvents: 'none',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 }, position: 'relative', zIndex: 1 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha(color, 0.2)} 0%, ${alpha(color, 0.1)} 100%)`,
                border: '1px solid',
                borderColor: alpha(color, 0.2),
                color,
                boxShadow: `0 4px 12px ${alpha(color, 0.2)}`,
              }}
            >
              {icon}
            </Box>
          </Box>

          <Box>
            {loading ? (
              <>
                <Skeleton variant="text" width={60} height={40} />
                <Skeleton variant="text" width={120} />
              </>
            ) : (
              <>
                <Typography
                  variant="h3"
                  fontWeight={800}
                  sx={{
                    background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`,
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {value}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mt: 0.5 }}>
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8 }}>
                    {subtitle}
                  </Typography>
                )}
              </>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Content Access Card
const ContentAccessCard = ({
  title,
  description,
  icon,
  path,
  color,
  available,
  locked = false,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  available: boolean;
  locked?: boolean;
}) => {
  const router = useRouter();
  const theme = useMuiTheme();
  const { t } = useTranslation('academy');
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        height: '100%',
        cursor: available ? 'pointer' : 'not-allowed',
        position: 'relative',
        overflow: 'visible',
        border: '1px solid',
        borderColor: available
          ? isDark ? alpha(color, 0.2) : alpha(color, 0.15)
          : 'divider',
        borderRadius: 3,
        opacity: available ? 1 : 0.6,
        transition: 'all 0.3s ease',
        background: available
          ? isDark
            ? `linear-gradient(145deg, ${alpha(color, 0.06)} 0%, ${alpha('#000', 0.2)} 100%)`
            : `linear-gradient(145deg, ${alpha(color, 0.03)} 0%, ${alpha('#fff', 0.9)} 100%)`
          : undefined,
        '&:hover': available ? {
          transform: 'translateY(-8px)',
          boxShadow: `0 16px 32px ${alpha(color, isDark ? 0.25 : 0.15)}`,
          borderColor: alpha(color, isDark ? 0.4 : 0.3),
          background: isDark
            ? `linear-gradient(145deg, ${alpha(color, 0.1)} 0%, ${alpha('#000', 0.2)} 100%)`
            : `linear-gradient(145deg, ${alpha(color, 0.06)} 0%, ${alpha('#fff', 0.9)} 100%)`,
          '& .hover-arrow': {
            transform: 'translateX(6px)',
          },
          '& .icon-box': {
            boxShadow: `0 8px 20px ${alpha(color, 0.4)}`,
            transform: 'scale(1.05)',
          },
        } : {}
      }}
      onClick={() => available && router.push(path)}
    >
      {locked && (
        <Chip
          icon={<Crown size={14} weight="fill" />}
          label={t('overview.premiumOnly')}
          size="small"
          sx={{
            position: 'absolute',
            top: -10,
            right: 16,
            background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
            color: 'white',
            fontWeight: 700,
            fontSize: '0.7rem',
            height: 26,
            boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.4)}`,
            '& .MuiChip-icon': {
              color: 'white',
            },
          }}
        />
      )}

      <CardContent sx={{ p: 3, height: '100%' }}>
        <Stack spacing={2} height="100%">
          <Box
            className="icon-box"
            sx={{
              width: 60,
              height: 60,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: available
                ? `linear-gradient(135deg, ${alpha(color, 0.2)} 0%, ${alpha(color, 0.1)} 100%)`
                : alpha(theme.palette.text.disabled, 0.1),
              border: '1px solid',
              borderColor: available ? alpha(color, 0.25) : 'transparent',
              color: available ? color : 'text.disabled',
              mb: 1,
              boxShadow: available ? `0 4px 12px ${alpha(color, 0.2)}` : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            {icon}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
              {description}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: available ? color : 'text.disabled',
              fontWeight: 700,
            }}
          >
            <Typography variant="button" sx={{ mr: 1, fontWeight: 700 }}>
              {available ? t('overview.explore') : t('overview.blocked')}
            </Typography>
            {available && (
              <ArrowRight
                size={20}
                weight="bold"
                className="hover-arrow"
                style={{ transition: 'transform 0.2s ease' }}
              />
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default function AcademyOverviewPage(): React.JSX.Element {
  const theme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const { user } = useClientAuth();
  const { t, i18n } = useTranslation('academy');
  
  // Check module access for all content types
  const { accessMap, loading: moduleAccessLoading } = useMultipleModuleAccess([
    ModuleType.CLASSES,
    ModuleType.MASTER_CLASSES,
    ModuleType.LIVE_RECORDED,
    ModuleType.PSICOTRADING,
    ModuleType.STOCKS,
    ModuleType.PEACE_WITH_MONEY,
  ]);
  
  // Fetch user's event registrations
  const { data: eventRegistrations, isLoading: eventsLoading } = useQuery({
    queryKey: ['user-events', user?._id],
    queryFn: async () => {
      if (!user?._id) return [];
      const response = await API.get(`/event-registrations/user/${user._id}`);
      return response.data;
    },
    enabled: Boolean(user?._id),
  });
  
  // Fetch upcoming events
  const { data: upcomingEvents } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      try {
        // Use the regular events endpoint with filters for active events
        const response = await API.get('/events', {
          params: {
            isActive: true,
            limit: 10, // Fetch more to filter client-side
          }
        });
        const allEvents = response.data.data || response.data.events || [];

        // Filter out past events client-side to ensure only future events are shown
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Start of today

        const futureEvents = allEvents.filter((event: any) => {
          if (!event.date) return false;
          const eventDate = new Date(event.date);
          return eventDate >= now;
        });

        // Sort by date ascending (nearest first)
        futureEvents.sort((a: any, b: any) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        return futureEvents;
      } catch (error) {
        console.error('Failed to fetch upcoming events:', error);
        // Return empty array on error to prevent breaking the UI
        return [];
      }
    },
  });
  
  // Fetch user profile to get accurate createdAt and other data
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile-overview'],
    queryFn: async () => {
      try {
        const response = await API.get('/user/profile');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        return null;
      }
    },
    enabled: Boolean(user?._id),
  });

  // Fetch available videos count (as a proxy for content)
  const { data: videoStats } = useQuery({
    queryKey: ['video-stats'],
    queryFn: async () => {
      // Return static counts for now to avoid permission errors
      // These will be replaced with actual API calls when permissions are properly configured
      return {
        classVideos: 12, // Basic classes available to all users
        mentorshipVideos: hasPremiumAccess ? 8 : 0,
        psicotradingVideos: hasPremiumAccess ? 15 : 0,
      };
    },
  });

  // Calculate real stats - use userProfile from API which has accurate createdAt
  const createdAtDate = userProfile?.createdAt || user?.createdAt;
  const memberDays = createdAtDate
    ? Math.max(1, Math.floor((new Date().getTime() - new Date(createdAtDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 1; // Show at least 1 day if user exists
    
  // Use userProfile from API for most accurate subscription data
  const allSubscriptions = userProfile?.subscriptions || user?.subscriptions || [];
  const activeSubscriptions = allSubscriptions.filter((sub: any) => {
    if (typeof sub === 'string') return true;
    if (sub && typeof sub === 'object' && 'expiresAt' in sub) {
      return !sub.expiresAt || new Date(sub.expiresAt) > new Date();
    }
    return false;
  });
  
  // Check user permissions and access
  const isSuperAdmin = user?.role === 'super_admin';
  const hasPremiumAccess = activeSubscriptions.length > 0 || isSuperAdmin;
  
  // Use module access results from the hook (which checks API for proper permissions)
  const hasClassesAccess = accessMap[ModuleType.CLASSES] ?? false;
  const hasMasterClassAccess = accessMap[ModuleType.MASTER_CLASSES] ?? false;
  const hasLiveSessionsAccess = accessMap[ModuleType.LIVE_RECORDED] ?? false;
  const hasPsicoTradingAccess = accessMap[ModuleType.PSICOTRADING] ?? false;
  const hasStocksAccess = accessMap[ModuleType.STOCKS] ?? false;
  const hasPeaceWithMoneyAccess = accessMap[ModuleType.PEACE_WITH_MONEY] ?? false;
  
  // Content access based on subscriptions and permissions
  const contentAccess = [
    {
      title: t('overview.classes.title'),
      description: t('overview.classes.description'),
      icon: <GraduationCap size={32} weight="duotone" />,
      path: paths.academy.class,
      color: theme.palette.primary.main,
      available: hasClassesAccess,
      locked: !hasClassesAccess,
    },
    {
      title: t('overview.masterClasses.title'),
      description: t('overview.masterClasses.description'),
      icon: <Trophy size={32} weight="duotone" />,
      path: paths.academy.mentorship,
      color: theme.palette.warning.main,
      available: hasMasterClassAccess,
      locked: !hasMasterClassAccess,
    },
    {
      title: t('overview.recordedLiveSessions.title'),
      description: t('overview.recordedLiveSessions.description'),
      icon: <VideoCamera size={32} weight="duotone" />,
      path: paths.academy.liveSessions,
      color: theme.palette.error.main,
      available: hasLiveSessionsAccess,
      locked: !hasLiveSessionsAccess,
    },
    {
      title: t('overview.psicoTrading.title'),
      description: t('overview.psicoTrading.description'),
      icon: <Brain size={32} weight="duotone" />,
      path: paths.academy.psicotrading,
      color: theme.palette.success.main,
      available: hasPsicoTradingAccess,
      locked: !hasPsicoTradingAccess,
    },
    {
      title: t('overview.stockMarket.title'),
      description: t('overview.stockMarket.description'),
      icon: <ChartLine size={32} weight="duotone" />,
      path: paths.academy.stock,
      color: theme.palette.info.main,
      available: hasStocksAccess,
      locked: !hasStocksAccess,
    },
    {
      title: t('overview.peaceWithMoney.title'),
      description: t('overview.peaceWithMoney.description'),
      icon: <CreditCard size={32} weight="duotone" />,
      path: paths.academy.personalGrowth.peaceWithMoney,
      color: theme.palette.secondary.main,
      available: hasPeaceWithMoneyAccess,
      locked: !hasPeaceWithMoneyAccess,
    },
  ];
  
  // Show loading state while checking module permissions
  if (moduleAccessLoading) {
    return (
      <Box sx={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ModernBackground isDarkMode={isDarkMode} />
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <ModernBackground isDarkMode={isDarkMode} />
      
      {/* Hero Section */}
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={{ xs: 3, sm: 4 }} alignItems="center">
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
                  icon={<Calendar size={16} />} 
                  label={t('overview.memberFor', { days: memberDays })}
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    fontWeight: 600,
                    '& .MuiChip-icon': { color: 'primary.main' }
                  }}
                />
                {hasPremiumAccess && (
                  <Chip 
                    icon={<Crown size={16} />} 
                    label={t('overview.premiumMember')}
                    sx={{ 
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: 'warning.main',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: 'warning.main' }
                    }}
                  />
                )}
                {user?.tradingPhase && (
                  <Chip 
                    icon={<ChartLine size={16} />} 
                    label={t('overview.tradingPhase', { phase: user.tradingPhase })}
                    sx={{ 
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: 'success.main',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: 'success.main' }
                    }}
                  />
                )}
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
                {t('overview.exploreCourses')}
              </Button>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                position: 'relative',
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {user?.profileImage ? (
                <Avatar
                  src={user.profileImage}
                  sx={{
                    width: 200,
                    height: 200,
                    border: '4px solid',
                    borderColor: theme.palette.primary.main,
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 200,
                    height: 200,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '4rem',
                  }}
                >
                  {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </Avatar>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* Real Stats Cards */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
          {t('overview.yourAccount')}
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={6} lg={3}>
            <StatsCard
              title={t('overview.activeSubscriptions')}
              value={activeSubscriptions.length}
              icon={<CreditCard size={24} weight="bold" />}
              color={theme.palette.primary.main}
              subtitle={activeSubscriptions.length > 0 ? t('overview.premiumAccess') : t('overview.freeAccount')}
            />
          </Grid>
          <Grid item xs={6} lg={3}>
            <StatsCard
              title={t('overview.eventsRegistered')}
              value={eventRegistrations?.length || 0}
              icon={<CalendarCheck size={24} weight="bold" />}
              color={theme.palette.info.main}
              loading={eventsLoading}
            />
          </Grid>
          <Grid item xs={6} lg={3}>
            <StatsCard
              title={t('overview.contentAvailable')}
              value={videoStats ? videoStats.classVideos + videoStats.mentorshipVideos + videoStats.psicotradingVideos : '...'}
              icon={<Books size={24} weight="bold" />}
              color={theme.palette.success.main}
              subtitle={t('overview.videosAndCourses')}
            />
          </Grid>
          <Grid item xs={6} lg={3}>
            <StatsCard
              title={t('overview.daysAsMember')}
              value={memberDays}
              icon={<Trophy size={24} weight="bold" />}
              color={theme.palette.warning.main}
              subtitle={createdAtDate ? t('overview.since', { date: new Date(createdAtDate).toLocaleDateString(i18n.language === 'es' ? 'es-ES' : 'en-US', { month: 'short', year: 'numeric' }) }) : t('overview.newMember')}
            />
          </Grid>
        </Grid>
      </Box>
      
      {/* Content Access */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
          {t('overview.contentLibrary')}
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {contentAccess.map((content) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={content.path}>
              <ContentAccessCard {...content} />
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Two Column Layout */}
      <Grid container spacing={{ xs: 3, sm: 4 }}>
        {/* Subscription Status */}
        <Grid item xs={12} lg={6}>
          <Paper
            sx={{
              p: 4,
              height: '100%',
              border: '1px solid',
              borderColor: isDarkMode ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.primary.main, 0.1),
              borderRadius: 3,
              background: isDarkMode
                ? `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, transparent 100%)`
                : `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, transparent 100%)`,
            }}
          >
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
              {t('overview.subscriptionStatus')}
            </Typography>
            
            {activeSubscriptions.length > 0 ? (
              <Stack spacing={2}>
                {activeSubscriptions.map((sub: any, index: number) => {
                  if (!sub) return null; // Handle null/undefined subscription
                  const planName = typeof sub === 'string' ? sub : sub?.plan;
                  const expiresAt = typeof sub === 'object' && sub?.expiresAt ? new Date(sub.expiresAt) : null;
                  
                  return (
                    <Card key={index} variant="outlined" sx={{ p: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Crown size={24} color={theme.palette.warning.main} weight="fill" />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {planName}
                          </Typography>
                          {expiresAt && (
                            <Typography variant="caption" color="text.secondary">
                              {t('overview.expiresOn', { 
                                date: expiresAt.toLocaleDateString(i18n.language === 'es' ? 'es-ES' : 'en-US')
                              })}
                            </Typography>
                          )}
                        </Box>
                        <Chip 
                          label={t('overview.active')} 
                          color="success" 
                          size="small"
                        />
                      </Stack>
                    </Card>
                  );
                })}
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => router.push(paths.academy.subscriptions.plans)}
                  endIcon={<ArrowRight size={20} />}
                >
                  {t('overview.manageSubscriptions')}
                </Button>
              </Stack>
            ) : (
              <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
                <Info size={48} color={theme.palette.text.secondary} />
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  {t('overview.noActiveSubscriptions')}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Crown size={20} />}
                  onClick={() => router.push(paths.academy.subscriptions.plans)}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  }}
                >
                  {t('overview.viewPlans')}
                </Button>
              </Stack>
            )}
          </Paper>
        </Grid>
        
        {/* Upcoming Events */}
        <Grid item xs={12} lg={6}>
          <Paper
            sx={{
              p: 4,
              height: '100%',
              border: '1px solid',
              borderColor: isDarkMode ? alpha(theme.palette.info.main, 0.15) : alpha(theme.palette.info.main, 0.1),
              borderRadius: 3,
              background: isDarkMode
                ? `linear-gradient(145deg, ${alpha(theme.palette.info.main, 0.04)} 0%, transparent 100%)`
                : `linear-gradient(145deg, ${alpha(theme.palette.info.main, 0.02)} 0%, transparent 100%)`,
            }}
          >
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
              {t('overview.upcomingEvents')}
            </Typography>
            
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <List sx={{ p: 0 }}>
                {upcomingEvents.slice(0, 3).map((event: any) => (
                  <React.Fragment key={event._id}>
                    <ListItem 
                      sx={{ 
                        px: 0, 
                        // Disable click for now until event pages are ready
                        // cursor: 'pointer',
                        // '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
                      }}
                      // onClick={() => router.push(`/events/${event._id}`)}
                    >
                      <ListItemIcon>
                        <Calendar size={24} color={theme.palette.primary.main} />
                      </ListItemIcon>
                      <ListItemText
                        primary={event.title}
                        secondary={formatEventDate(event.date, i18n.language)}
                      />
                      {event.isPremium && (
                        <Chip 
                          icon={<Crown size={14} />} 
                          label="VIP" 
                          size="small" 
                          color="warning"
                        />
                      )}
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
                <Calendar size={48} color={theme.palette.text.secondary} />
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  {t('overview.noUpcomingEvents')}
                </Typography>
                {/* Hide browse events button for now until event pages are ready
                <Button
                  variant="outlined"
                  onClick={() => router.push('/events')}
                  endIcon={<ArrowRight size={20} />}
                >
                  {t('overview.browseEvents')}
                </Button>
                */}
              </Stack>
            )}
            
            {/* Hide "Ver todos" button for now until events pages are ready
            {upcomingEvents && upcomingEvents.length > 3 && (
              <Button
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => router.push('/events')}
                endIcon={<ArrowRight size={20} />}
              >
                {t('overview.viewAllEvents', { count: upcomingEvents.length })}
              </Button>
            )} */}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Quick Actions */}
      <Paper
        sx={{
          mt: 6,
          p: 5,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.primary.dark, 0.08)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, isDarkMode ? 0.25 : 0.2),
          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, isDarkMode ? 0.15 : 0.08)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: '200px',
            height: '200px',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
            filter: 'blur(40px)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: '150px',
            height: '150px',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
            filter: 'blur(30px)',
          },
        }}
      >
        <Stack spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" fontWeight={800}>
            {t('overview.readyToLearnMore')}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
            {t('overview.exploreOurContent')}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayCircle size={20} />}
              onClick={() => router.push(paths.academy.courses)}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              }}
            >
              {t('overview.startLearning')}
            </Button>
            {!hasPremiumAccess && (
              <Button
                variant="outlined"
                size="large"
                startIcon={<Crown size={20} />}
                onClick={() => router.push(paths.academy.subscriptions.plans)}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                {t('overview.upgradeToPremium')}
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}