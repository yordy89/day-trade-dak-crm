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
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
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
          </Box>
          
          <Box>
            {loading ? (
              <>
                <Skeleton variant="text" width={60} height={40} />
                <Skeleton variant="text" width={120} />
              </>
            ) : (
              <>
                <Typography variant="h3" fontWeight={800} color={color}>
                  {value}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant="caption" color="text.secondary">
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
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: available ? 'pointer' : 'not-allowed',
        position: 'relative',
        overflow: 'visible',
        border: '1px solid',
        borderColor: 'divider',
        opacity: available ? 1 : 0.7,
        transition: 'all 0.3s ease',
        '&:hover': available ? {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[12],
          borderColor: alpha(color, 0.3),
          '& .hover-arrow': {
            transform: 'translateX(4px)',
          }
        } : {}
      }}
      onClick={() => available && router.push(path)}
    >
      {locked && (
        <Chip
          icon={<Crown size={14} />}
          label={t('overview.premiumOnly')}
          size="small"
          sx={{
            position: 'absolute',
            top: -10,
            right: 16,
            bgcolor: 'warning.main',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.7rem',
            height: 24,
          }}
        />
      )}
      
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
              color: available ? color : 'text.disabled',
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
          
          <Box sx={{ display: 'flex', alignItems: 'center', color: available ? color : 'text.disabled', fontWeight: 600 }}>
            <Typography variant="button" sx={{ mr: 1 }}>
              {available ? t('overview.explore') : t('overview.locked')}
            </Typography>
            {available && <ArrowRight size={20} className="hover-arrow" style={{ transition: 'transform 0.2s' }} />}
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
        // Use the regular events endpoint with filters for active and future events
        const response = await API.get('/events', {
          params: {
            isActive: true,
            limit: 5,
            // Only get events from today onwards
            startDate: new Date().toISOString(),
          }
        });
        return response.data.data || response.data.events || [];
      } catch (error) {
        console.error('Failed to fetch upcoming events:', error);
        // Return empty array on error to prevent breaking the UI
        return [];
      }
    },
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
  
  // Calculate real stats
  const memberDays = user?.createdAt 
    ? Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
    
  const activeSubscriptions = user?.subscriptions?.filter((sub: any) => {
    if (typeof sub === 'string') return true;
    if (sub && typeof sub === 'object' && 'expiresAt' in sub) {
      return !sub.expiresAt || new Date(sub.expiresAt) > new Date();
    }
    return false;
  }) || [];
  
  const hasLiveAccess = user?.allowLiveMeetingAccess || user?.allowLiveWeeklyAccess || false;
  const hasPremiumAccess = activeSubscriptions.length > 0;
  
  // Content access based on subscriptions
  const contentAccess = [
    {
      title: t('overview.tradingCourses.title'),
      description: t('overview.tradingCourses.description'),
      icon: <GraduationCap size={32} weight="duotone" />,
      path: paths.academy.courses,
      color: theme.palette.primary.main,
      available: true, // Basic courses available to all
    },
    {
      title: t('overview.liveClasses.title'),
      description: t('overview.liveClasses.description'),
      icon: <VideoCamera size={32} weight="duotone" />,
      path: paths.academy.class,
      color: theme.palette.error.main,
      available: hasLiveAccess,
      locked: !hasLiveAccess,
    },
    {
      title: t('overview.mentorship.title'),
      description: t('overview.mentorship.description'),
      icon: <Users size={32} weight="duotone" />,
      path: paths.academy.mentorship,
      color: theme.palette.info.main,
      available: hasPremiumAccess,
      locked: !hasPremiumAccess,
    },
    {
      title: t('overview.psicoTradingElite.title'),
      description: t('overview.psicoTradingElite.description'),
      icon: <Brain size={32} weight="duotone" />,
      path: paths.academy.psicotrading,
      color: theme.palette.success.main,
      available: hasPremiumAccess,
      locked: !hasPremiumAccess,
    },
  ];
  
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
              title={t('overview.tradingLevel')}
              value={user?.tradingPhase || 1}
              icon={<Trophy size={24} weight="bold" />}
              color={theme.palette.warning.main}
              subtitle={t('overview.currentPhase')}
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
            <Grid item xs={12} md={6} lg={3} key={content.path}>
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
              borderColor: 'divider',
            }}
          >
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
              {t('overview.subscriptionStatus')}
            </Typography>
            
            {activeSubscriptions.length > 0 ? (
              <Stack spacing={2}>
                {activeSubscriptions.map((sub: any, index: number) => {
                  const planName = typeof sub === 'string' ? sub : sub.plan;
                  const expiresAt = typeof sub === 'object' && sub.expiresAt ? new Date(sub.expiresAt) : null;
                  
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
              borderColor: 'divider',
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
                        cursor: 'pointer',
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
                      }}
                      onClick={() => router.push(`/events/${event._id}`)}
                    >
                      <ListItemIcon>
                        <Calendar size={24} color={theme.palette.primary.main} />
                      </ListItemIcon>
                      <ListItemText
                        primary={event.title}
                        secondary={new Date(event.date).toLocaleDateString(
                          i18n.language === 'es' ? 'es-ES' : 'en-US',
                          { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                        )}
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
                <Button
                  variant="outlined"
                  onClick={() => router.push('/events')}
                  endIcon={<ArrowRight size={20} />}
                >
                  {t('overview.browseEvents')}
                </Button>
              </Stack>
            )}
            
            {upcomingEvents && upcomingEvents.length > 3 && (
              <Button
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => router.push('/events')}
                endIcon={<ArrowRight size={20} />}
              >
                {t('overview.viewAllEvents', { count: upcomingEvents.length })}
              </Button>
            )}
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
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.2),
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