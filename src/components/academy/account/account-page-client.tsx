'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useClientAuth } from '@/hooks/use-client-auth';
import { useAuthStore } from '@/store/auth-store';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Avatar,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Badge,
  TextField,
  InputAdornment,
  useTheme,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  Camera,
  User,
  EnvelopeSimple,
  Phone,
  MapPin,
  Crown,
  Shield,
  CreditCard,
  Clock,
  CheckCircle,
  Warning,
  PencilSimple,
  Trophy,
  CalendarBlank,
  LockKey,
  Bell,
  Eye,
  EyeSlash,
} from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from '@/lib/axios';
import { SubscriptionPlan } from '@/types/user';
import { mapMembershipName } from '@/lib/memberships';
import { formatDate } from '@/lib/date-format';
import { PrivacyTab } from './privacy-tab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null}
    </div>
  );
}

export function AccountPageClient(): React.JSX.Element {
  const theme = useTheme();
  const _isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useClientAuth();
  const setUser = useAuthStore.getState().setUser;
  const queryClient = useQueryClient();
  const { t } = useTranslation('academy');
  const searchParams = useSearchParams();
  const [mounted, setMounted] = React.useState(false);

  // Map URL tab param to tab index
  const getInitialTabFromUrl = (): number => {
    const tabParam = searchParams.get('tab');
    switch (tabParam) {
      case 'subscriptions':
        return 1;
      case 'security':
      case 'privacy':
        return 2;
      case 'notifications':
        return 3;
      default:
        return 0;
    }
  };

  const [tabValue, setTabValue] = React.useState(getInitialTabFromUrl());

  // Update tab when URL param changes
  React.useEffect(() => {
    setTabValue(getInitialTabFromUrl());
  }, [searchParams]);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // Form state
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch user profile
  const { data: userData, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await API.get('/user/profile');
      return response.data;
    },
  });

  React.useEffect(() => {
    if (userData) {
      setUser(userData);
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [userData, setUser]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await API.put('/user/profile', data);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data);
      setIsEditing(false);
      void queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (plan: string) => {
      await API.delete(`/payments/cancel/${plan}`);
    },
    onSuccess: async () => {
      void queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      setIsCancelDialogOpen(false);
      setSnackbar({
        open: true,
        message: t('account.subscriptionCancelledSuccess'),
        severity: 'success',
      });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: t('account.subscriptionCancelledError'),
        severity: 'error',
      });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await API.put('/auth/update-password', data);
      return response.data;
    },
    onSuccess: () => {
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      // Show success message
      setSnackbar({
        open: true,
        message: t('account.passwordUpdatedSuccessfully'),
        severity: 'success',
      });
    },
    onError: (error: any) => {
      // Show error message
      const errorMessage = error.response?.data?.message || t('account.passwordUpdateError');
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    },
  });

  // Handle file upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const fileFormData = new FormData();
    fileFormData.append('file', file);

    setIsUploading(true);

    try {
      const response = await API.post(`user/${user?._id}/upload-profile-image/`, fileFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.avatarUrl) {
        setUser({ ...response.data });
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsUploading(false);
    }
  };


  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: formData.address,
    });
  };

  const handleUpdatePassword = () => {
    // Validate password fields
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setSnackbar({
        open: true,
        message: t('account.pleaseFillAllFields'),
        severity: 'warning',
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setSnackbar({
        open: true,
        message: t('account.passwordsDoNotMatch'),
        severity: 'warning',
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      setSnackbar({
        open: true,
        message: t('account.passwordTooShort'),
        severity: 'warning',
      });
      return;
    }

    // Submit password change
    updatePasswordMutation.mutate({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
  };

  // Helper function to check if a subscription is active
  // Checks both expiresAt AND currentPeriodEnd for recurring subscriptions
  const isSubscriptionActive = (sub: any): boolean => {
    if (typeof sub === 'string') return true;
    if (sub && typeof sub === 'object' && 'plan' in sub) {
      // Check if explicitly cancelled/expired by status
      if (sub.status === 'expired' || sub.status === 'cancelled' || sub.status === 'canceled') {
        return false;
      }
      // For recurring subscriptions, currentPeriodEnd is authoritative
      // For non-recurring, expiresAt is authoritative
      // Check both for backwards compatibility
      const now = new Date();
      const expiresAt = sub.expiresAt ? new Date(sub.expiresAt) : null;
      const currentPeriodEnd = sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd) : null;

      // If both are set, use the later date (they should be in sync now)
      // If neither is set, consider it active
      if (!expiresAt && !currentPeriodEnd) return true;

      // Use currentPeriodEnd for recurring, expiresAt for non-recurring
      const effectiveExpiration = currentPeriodEnd || expiresAt;
      return effectiveExpiration ? effectiveExpiration > now : true;
    }
    return false;
  };

  const isPremium = (() => {
    const allSubs = user?.subscriptions || [];
    return allSubs.some(isSubscriptionActive);
  })();

  // Subscription price mapping based on API pricing service
  const subscriptionPrices: Record<string, string> = {
    [SubscriptionPlan.MasterClases]: '$22.99/mes',
    [SubscriptionPlan.CLASSES]: '$52.99/mes',
    [SubscriptionPlan.LiveRecorded]: '$199.99/mes',
    [SubscriptionPlan.PSICOTRADING]: '$29.99/mes',
    [SubscriptionPlan.PeaceWithMoney]: '$199.99 (único pago)',
    [SubscriptionPlan.LiveWeeklyManual]: '$53.99/mes',
    [SubscriptionPlan.LiveWeeklyRecurring]: '$51.99/mes',
    [SubscriptionPlan.MasterCourse]: '$2999.99',
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Profile Header */}
      <Paper
        sx={{
          p: 0,
          mb: 3,
          overflow: 'hidden',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Cover Background */}
        <Box
          sx={{
            height: 200,
            background: isPremium
              ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`
              : `linear-gradient(135deg, ${theme.palette.grey[800]} 0%, ${theme.palette.grey[700]} 50%, ${theme.palette.primary.dark} 100%)`,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Background pattern */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(circle at 20% 50%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
                               radial-gradient(circle at 80% 50%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%)`,
            }}
          />

          {/* DayTradeDak Branding */}
          <Stack
            alignItems="center"
            spacing={1}
            sx={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              px: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.common.white} 0%, ${alpha(theme.palette.common.white, 0.8)} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                letterSpacing: '-0.5px',
              }}
            >
              DayTradeDak Academy
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: alpha(theme.palette.common.white, 0.8),
                fontWeight: 500,
                maxWidth: 400,
              }}
            >
              {isPremium
                ? 'Tu viaje hacia el éxito financiero continúa'
                : 'Aprende a operar en los mercados con confianza'}
            </Typography>
          </Stack>

          {/* Floating elements */}
          <Crown
            size={80}
            weight="duotone"
            style={{
              position: 'absolute',
              top: 20,
              right: 40,
              opacity: isPremium ? 0.15 : 0.05,
              color: theme.palette.common.white,
            }}
          />
          <Trophy
            size={60}
            weight="duotone"
            style={{
              position: 'absolute',
              bottom: 20,
              left: 40,
              opacity: isPremium ? 0.15 : 0.05,
              color: theme.palette.common.white,
            }}
          />
        </Box>

        {/* Profile Info */}
        <Box sx={{ px: 4, pb: 4 }}>
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={3} 
            alignItems={{ xs: 'center', md: 'flex-start' }}
            sx={{ mt: -6 }}
          >
            {/* Avatar with Upload */}
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton
                  component="label"
                  htmlFor="upload-avatar"
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                    border: '3px solid',
                    borderColor: 'background.paper',
                  }}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                  ) : (
                    <Camera size={20} weight="bold" color="white" />
                  )}
                </IconButton>
              }
            >
              <Avatar
                src={user?.profileImage}
                sx={{
                  width: 140,
                  height: 140,
                  border: '4px solid',
                  borderColor: 'background.paper',
                  boxShadow: 4,
                  bgcolor: isPremium ? 'primary.main' : 'grey.500',
                  fontSize: '3rem',
                  fontWeight: 700,
                }}
              >
                {user?.firstName?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            </Badge>

            {/* User Details */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, mt: { xs: 2, md: 4 } }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Typography variant="h4" fontWeight={700}>
                  {`${user?.firstName || 'Usuario'} ${user?.lastName || ''}`}
                </Typography>
                {isPremium ? (
                  <Chip
                    icon={<Crown size={16} weight="fill" />}
                    label="Premium"
                    color="warning"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                ) : null}
              </Stack>

              <Stack direction="row" spacing={3} flexWrap="wrap" gap={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EnvelopeSimple size={16} weight="duotone" />
                  <Typography variant="body2" color="text.secondary">
                    {user?.email || 'email@example.com'}
                  </Typography>
                </Stack>
                
                {user?.phone ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Phone size={16} weight="duotone" />
                    <Typography variant="body2" color="text.secondary">
                      {user.phone}
                    </Typography>
                  </Stack>
                ) : null}

                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarBlank size={16} weight="duotone" />
                  <Typography variant="body2" color="text.secondary">
                    {t('account.memberSince')} {new Date(user?.createdAt || Date.now()).toLocaleDateString('es', { month: 'long', year: 'numeric' })}
                  </Typography>
                </Stack>
              </Stack>

              {/* Quick Stats */}
              <Stack direction="row" spacing={2} mt={3} flexWrap="wrap" gap={2}>
                {[
                  {
                    value: (() => {
                      // Use userData from API which has createdAt field
                      const createdAt = userData?.createdAt || user?.createdAt;
                      if (!createdAt) return 1; // At least 1 day if registered
                      const memberSince = new Date(createdAt);
                      const now = new Date();
                      const diffTime = Math.abs(now.getTime() - memberSince.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      // Return at least 1 if user exists (they've been member at least today)
                      return Math.max(1, diffDays);
                    })(),
                    label: t('overview.daysAsMember'),
                    color: theme.palette.info.main,
                    icon: <CalendarBlank size={20} weight="bold" />,
                  },
                  {
                    value: (() => {
                      const allSubs = userData?.subscriptions || user?.subscriptions || [];
                      return allSubs.filter(isSubscriptionActive).length;
                    })(),
                    label: t('overview.activeSubscriptions'),
                    color: theme.palette.primary.main,
                    icon: <CreditCard size={20} weight="bold" />,
                  },
                  {
                    value: isPremium ? 'Premium' : 'Free',
                    label: t('overview.subscriptionStatus'),
                    color: isPremium ? theme.palette.warning.main : theme.palette.grey[500],
                    isText: true,
                    icon: isPremium ? <Crown size={20} weight="bold" /> : <User size={20} weight="bold" />,
                  },
                ].map((stat, index) => (
                  <Box
                    key={index}
                    sx={{
                      px: 3,
                      py: 2,
                      borderRadius: 3,
                      background: _isDarkMode
                        ? `linear-gradient(135deg, ${alpha(stat.color, 0.2)} 0%, ${alpha(stat.color, 0.08)} 100%)`
                        : `linear-gradient(135deg, ${alpha(stat.color, 0.15)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                      border: `1px solid ${alpha(stat.color, 0.25)}`,
                      minWidth: 140,
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 20px ${alpha(stat.color, 0.2)}`,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: `linear-gradient(90deg, ${stat.color}, ${alpha(stat.color, 0.5)})`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        mb: 0.5,
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                      <Typography variant="h5" fontWeight={700} color={stat.color}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Paper>

      {/* Tabs */}
      {mounted && (
        <Paper
          sx={{
            mb: 3,
            borderRadius: 3,
            overflow: 'hidden',
            background: _isDarkMode
              ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
              : theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          }}
        >
          {isMobile ? (
            /* Mobile Tabs */
            <Box sx={{ p: 1 }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  '&::-webkit-scrollbar': { height: '4px' },
                  '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                  '&::-webkit-scrollbar-thumb': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    borderRadius: '2px',
                  },
                }}
              >
                {[
                  { icon: <User size={18} weight="duotone" />, label: t('academy:account.info'), color: theme.palette.primary.main },
                  { icon: <CreditCard size={18} weight="duotone" />, label: t('academy:navigation.subscriptions'), color: theme.palette.warning.main },
                  { icon: <Shield size={18} weight="duotone" />, label: 'Privacidad', color: theme.palette.secondary.main },
                  { icon: <LockKey size={18} weight="duotone" />, label: 'Seguridad', color: theme.palette.info.main },
                  { icon: <Bell size={18} weight="duotone" />, label: t('academy:settings.notifications.short'), color: theme.palette.error.main },
                ].map((tab, index) => (
                  <Button
                    key={index}
                    onClick={() => setTabValue(index)}
                    sx={{
                      minHeight: 48,
                      px: 2,
                      minWidth: 'auto',
                      flexShrink: 0,
                      borderRadius: 2,
                      color: tabValue === index ? 'white' : 'text.secondary',
                      fontWeight: tabValue === index ? 600 : 500,
                      textTransform: 'none',
                      whiteSpace: 'nowrap',
                      fontSize: '0.8rem',
                      background: tabValue === index
                        ? `linear-gradient(135deg, ${tab.color} 0%, ${alpha(tab.color, 0.8)} 100%)`
                        : 'transparent',
                      boxShadow: tabValue === index ? `0 4px 12px ${alpha(tab.color, 0.3)}` : 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: tabValue === index ? undefined : alpha(tab.color, 0.1),
                      },
                      '& .MuiButton-startIcon': {
                        marginRight: 0.5,
                        marginLeft: 0,
                      },
                    }}
                    startIcon={tab.icon}
                  >
                    {tab.label}
                  </Button>
                ))}
              </Stack>
            </Box>
          ) : (
            /* Desktop Tabs */
            <Box sx={{ p: 1 }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  '&::-webkit-scrollbar': { height: '4px' },
                  '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                  '&::-webkit-scrollbar-thumb': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    borderRadius: '2px',
                  },
                }}
              >
                {[
                  { icon: <User size={20} weight="duotone" />, label: t('academy:account.personalInfo'), color: theme.palette.primary.main },
                  { icon: <CreditCard size={20} weight="duotone" />, label: t('academy:navigation.subscriptions'), color: theme.palette.warning.main },
                  { icon: <Shield size={20} weight="duotone" />, label: 'Privacidad & Datos', color: theme.palette.secondary.main },
                  { icon: <LockKey size={20} weight="duotone" />, label: 'Seguridad', color: theme.palette.info.main },
                  { icon: <Bell size={20} weight="duotone" />, label: t('academy:settings.notifications.title'), color: theme.palette.error.main },
                ].map((tab, index) => (
                  <Button
                    key={tab.label}
                    onClick={() => setTabValue(index)}
                    sx={{
                      minHeight: 56,
                      px: 3,
                      minWidth: 'auto',
                      flexShrink: 0,
                      borderRadius: 2,
                      color: tabValue === index ? 'white' : 'text.secondary',
                      fontWeight: tabValue === index ? 600 : 500,
                      textTransform: 'none',
                      whiteSpace: 'nowrap',
                      background: tabValue === index
                        ? `linear-gradient(135deg, ${tab.color} 0%, ${alpha(tab.color, 0.8)} 100%)`
                        : 'transparent',
                      boxShadow: tabValue === index ? `0 4px 14px ${alpha(tab.color, 0.35)}` : 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: tabValue === index ? undefined : alpha(tab.color, 0.1),
                        transform: tabValue === index ? 'none' : 'translateY(-2px)',
                      },
                    }}
                    startIcon={tab.icon}
                  >
                    {tab.label}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}
        </Paper>
      )}

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Card
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            background: _isDarkMode
              ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
              : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.5)})`,
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.7)} 100%)`,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  <User size={24} weight="bold" color="white" />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {t('account.personalInfo')}
                </Typography>
              </Stack>
              <Button
                variant={isEditing ? "contained" : "outlined"}
                startIcon={isEditing ? <CheckCircle size={20} /> : <PencilSimple size={20} />}
                onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                disabled={updateProfileMutation.isPending}
              >
                {isEditing ? (updateProfileMutation.isPending ? t('common.loading') : t('common.save')) : t('common.edit')}
              </Button>
            </Stack>

            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('account.firstName')}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={20} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: 'transparent !important',
                    },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        '& fieldset': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 1,
                        },
                      },
                      '&.Mui-disabled': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('account.lastName')}
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={20} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: 'transparent !important',
                    },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        '& fieldset': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 1,
                        },
                      },
                      '&.Mui-disabled': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('account.email')}
                  value={formData.email}
                  disabled
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EnvelopeSimple size={20} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: 'transparent !important',
                    },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        '& fieldset': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 1,
                        },
                      },
                      '&.Mui-disabled': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('account.phone')}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone size={20} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: 'transparent !important',
                    },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        '& fieldset': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 1,
                        },
                      },
                      '&.Mui-disabled': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('account.address')}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!isEditing}
                  multiline
                  rows={2}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                        <MapPin size={20} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: 'transparent !important',
                    },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        '& fieldset': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 1,
                        },
                      },
                      '&.Mui-disabled': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {/* Active Subscriptions */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${alpha(theme.palette.warning.main, 0.7)} 100%)`,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.3)}`,
                }}
              >
                <CreditCard size={24} weight="bold" color="white" />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                {t('subscriptions.currentPlan')}
              </Typography>
            </Stack>
            {(() => {
              // Get all active subscriptions (both from activeSubscriptions and regular subscriptions)
              const allSubscriptions = user?.subscriptions || [];
              const activeSubscriptions = allSubscriptions.filter(isSubscriptionActive);

              return activeSubscriptions.length > 0 ? (
                <Grid container spacing={{ xs: 2, sm: 2 }}>
                  {activeSubscriptions.map((subscription: any) => {
                    if (!subscription) return null; // Handle null/undefined subscription
                    const plan = typeof subscription === 'string' ? subscription : subscription?.plan;
                    // For recurring subscriptions, use currentPeriodEnd; for non-recurring, use expiresAt
                    const currentPeriodEnd = typeof subscription === 'object' ? subscription?.currentPeriodEnd : null;
                    const rawExpiresAt = typeof subscription === 'object' ? subscription?.expiresAt : null;
                    // Use currentPeriodEnd as the authoritative date for display (they should be in sync)
                    const expiresAt = currentPeriodEnd || rawExpiresAt;

                    // Check if this is a recurring plan type
                    const isRecurringPlanType = [
                      SubscriptionPlan.LiveWeeklyManual,
                      SubscriptionPlan.LiveWeeklyRecurring,
                      SubscriptionPlan.MasterClases,
                      SubscriptionPlan.LiveRecorded,
                      SubscriptionPlan.PSICOTRADING
                    ].includes(plan as SubscriptionPlan);

                    // Determine if subscription was cancelled based on status field from database
                    const subscriptionStatus = typeof subscription === 'object' ? subscription?.status : null;
                    const isCancelled = subscriptionStatus === 'cancelled' || subscriptionStatus === 'canceled';
                    const isRecurring = isRecurringPlanType && !isCancelled;

                    return (
                    <Grid item xs={12} lg={6} key={plan}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          border: '2px solid',
                          borderColor: isCancelled ? 'warning.main' : 'success.main',
                          position: 'relative',
                          overflow: 'visible',
                          background: _isDarkMode
                            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(isCancelled ? theme.palette.warning.main : theme.palette.success.main, 0.1)} 100%)`
                            : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(isCancelled ? theme.palette.warning.main : theme.palette.success.main, 0.08)} 100%)`,
                          boxShadow: `0 4px 20px ${alpha(isCancelled ? theme.palette.warning.main : theme.palette.success.main, 0.15)}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 30px ${alpha(isCancelled ? theme.palette.warning.main : theme.palette.success.main, 0.2)}`,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -12,
                            right: 20,
                            background: isCancelled
                              ? `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`
                              : `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            boxShadow: `0 4px 12px ${alpha(isCancelled ? theme.palette.warning.main : theme.palette.success.main, 0.4)}`,
                          }}
                        >
                          {isCancelled ? t('account.cancelled') : t('account.active')}
                        </Box>
                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${alpha(theme.palette.warning.main, 0.7)} 100%)`,
                                boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.3)}`,
                              }}
                            >
                              <Crown size={28} weight="bold" color="white" />
                            </Box>
                            <Box>
                              <Typography variant="h6" fontWeight={600}>
                                {mapMembershipName(plan as SubscriptionPlan)}
                              </Typography>
                              <Typography variant="body2" color={isCancelled ? 'warning.main' : 'text.secondary'}>
                                {isCancelled
                                  ? t('account.cancelledAccessUntil', { date: formatDate(expiresAt) })
                                  : expiresAt
                                    ? t('account.activeUntil', { date: formatDate(expiresAt) })
                                    : t('account.autoRenewalActive')}
                              </Typography>
                            </Box>
                          </Stack>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Stack spacing={1}>
                            {expiresAt ? (
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                  {t('account.expires')}:
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                  {formatDate(expiresAt)}
                                </Typography>
                              </Stack>
                            ) : null}
                            {/* Show status for recurring subscriptions */}
                            {isRecurringPlanType ? (
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                  {t('account.status')}:
                                </Typography>
                                <Typography variant="body2" fontWeight={500} color={isCancelled ? 'warning.main' : 'success.main'}>
                                  {isCancelled ? t('account.cancelledStatus') : t('account.activeAutoRenewal')}
                                </Typography>
                              </Stack>
                            ) : null}
                            {/* Show next payment date for recurring subscriptions */}
                            {isRecurring && typeof subscription === 'object' && (subscription.currentPeriodEnd || subscription.nextPaymentDate) ? (
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                  {t('account.nextPayment')}:
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                  {formatDate(subscription.nextPaymentDate || subscription.currentPeriodEnd)}
                                </Typography>
                              </Stack>
                            ) : null}
                            {/* Show subscription start date if available */}
                            {typeof subscription === 'object' && subscription.createdAt ? (
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                  {t('account.startDate')}:
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                  {formatDate(subscription.createdAt)}
                                </Typography>
                              </Stack>
                            ) : null}
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2" color="text.secondary">
                                {t('account.price')}:
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {subscriptionPrices[plan] || 'N/A'}
                              </Typography>
                            </Stack>
                            {/* Show subscription type */}
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              {t('account.type')}:
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {(() => {
                                // For recurring plan types (active or cancelled), show subscription type
                                if ([SubscriptionPlan.LiveWeeklyManual, SubscriptionPlan.LiveWeeklyRecurring].includes(plan as SubscriptionPlan)) {
                                  return t('account.weeklySubscription');
                                }
                                if (isRecurringPlanType) {
                                  return t('account.monthlySubscription');
                                }
                                return t('account.oneTimePayment');
                              })()}
                            </Typography>
                          </Stack>
                          </Stack>

                          {/* Only show cancel button for active recurring subscriptions (not already cancelled) */}
                          {isRecurring && !isCancelled ? (
                            <Button
                              fullWidth
                              variant="outlined"
                              color="error"
                              sx={{ mt: 2 }}
                              onClick={() => {
                                setSelectedPlan(plan);
                                setIsCancelDialogOpen(true);
                              }}
                            >
                              {t('account.cancelSubscription')}
                            </Button>
                          ) : null}
                        </CardContent>
                      </Card>
                    </Grid>
                    );
                  })}
              </Grid>
            ) : (
              <Card
                sx={{
                  textAlign: 'center',
                  p: 6,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  background: _isDarkMode
                    ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.warning.main, 0.08)} 100%)`
                    : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.15)}`,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.warning.main, 0.1)}`,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${alpha(theme.palette.warning.main, 0.5)})`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.15)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Shield size={40} weight="duotone" color={theme.palette.warning.main} />
                </Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {t('account.noActiveSubscriptions')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {t('account.exploreOurPlans')}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  href="/academy/subscription/plans"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                    boxShadow: `0 4px 14px ${alpha(theme.palette.warning.main, 0.4)}`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.warning.dark} 0%, ${theme.palette.warning.main} 100%)`,
                      boxShadow: `0 6px 20px ${alpha(theme.palette.warning.main, 0.5)}`,
                    },
                  }}
                >
                  {t('account.viewAvailablePlans')}
                </Button>
              </Card>
            );
            })()}
          </Grid>

          {/* Expired Subscriptions */}
          {(() => {
            // Get expired subscriptions from the main subscriptions array
            const allSubscriptions = user?.subscriptions || [];
            const expiredSubscriptions = allSubscriptions.filter((sub: any) => {
              if (typeof sub === 'string') {
                return false; // String subscriptions don't expire
              } else if (sub && typeof sub === 'object' && 'plan' in sub) {
                // Check if explicitly expired by status
                if (sub.status === 'expired') return true;
                // Check both expiresAt and currentPeriodEnd
                const now = new Date();
                const expiresAt = sub.expiresAt ? new Date(sub.expiresAt) : null;
                const currentPeriodEnd = sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd) : null;
                // Use currentPeriodEnd for recurring, expiresAt for non-recurring
                const effectiveExpiration = currentPeriodEnd || expiresAt;
                return effectiveExpiration ? effectiveExpiration <= now : false;
              }
              return false;
            });

            return expiredSubscriptions.length > 0 ? (
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} alignItems="center" mb={3} mt={2}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${alpha(theme.palette.grey[500], 0.2)} 0%, ${alpha(theme.palette.grey[500], 0.1)} 100%)`,
                      border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
                    }}
                  >
                    <Clock size={20} weight="duotone" color={theme.palette.grey[500]} />
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    {t('account.subscriptionHistory')}
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  {expiredSubscriptions.map((subscription: any) => {
                    if (!subscription) return null; // Handle null/undefined subscription
                    const plan = typeof subscription === 'string' ? subscription : subscription?.plan;
                    // Use currentPeriodEnd or expiresAt for the expired date
                    const currentPeriodEnd = typeof subscription === 'object' ? subscription?.currentPeriodEnd : null;
                    const rawExpiresAt = typeof subscription === 'object' ? subscription?.expiresAt : null;
                    const expiredDate = currentPeriodEnd || rawExpiresAt;

                    return (
                      <Card
                        key={`expired-${plan}`}
                        sx={{
                          opacity: 0.8,
                          borderRadius: 2,
                          background: _isDarkMode
                            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.6)} 0%, ${alpha(theme.palette.grey[800], 0.4)} 100%)`
                            : `linear-gradient(135deg, ${alpha('#ffffff', 0.8)} 0%, ${alpha(theme.palette.grey[100], 0.6)} 100%)`,
                          border: `1px solid ${alpha(theme.palette.grey[500], 0.15)}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            opacity: 1,
                          },
                        }}
                      >
                        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Box
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 1.5,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: `linear-gradient(135deg, ${alpha(theme.palette.grey[500], 0.15)} 0%, ${alpha(theme.palette.grey[500], 0.05)} 100%)`,
                                  border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
                                }}
                              >
                                <Clock size={20} weight="duotone" color={theme.palette.grey[500]} />
                              </Box>
                              <Box>
                                <Typography fontWeight={500}>
                                  {mapMembershipName(plan as SubscriptionPlan)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {t('account.expiredOn', { date: formatDate(expiredDate) })}
                                </Typography>
                              </Box>
                            </Stack>
                            <Chip
                              label={t('account.expired')}
                              size="small"
                              variant="outlined"
                              color="default"
                              sx={{
                                borderColor: alpha(theme.palette.grey[500], 0.3),
                                color: theme.palette.grey[500],
                              }}
                            />
                          </Stack>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>
              </Grid>
            ) : null;
          })()}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <PrivacyTab />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Card
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            background: _isDarkMode
              ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.info.main, 0.08)} 100%)`
              : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.15)}`,
            boxShadow: `0 4px 20px ${alpha(theme.palette.info.main, 0.1)}`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.info.main}, ${alpha(theme.palette.info.main, 0.5)})`,
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${alpha(theme.palette.info.main, 0.7)} 100%)`,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.3)}`,
                }}
              >
                <LockKey size={24} weight="bold" color="white" />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                {t('account.changePassword')}
              </Typography>
            </Stack>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label={t('account.currentPassword')}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockKey size={20} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: 'transparent !important',
                    },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        '& fieldset': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 1,
                        },
                      },
                      '&.Mui-disabled': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label={t('account.newPassword')}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockKey size={20} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: 'transparent !important',
                    },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        '& fieldset': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 1,
                        },
                      },
                      '&.Mui-disabled': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="password"
                  label={t('account.confirmPassword')}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockKey size={20} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: 'transparent !important',
                    },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        '& fieldset': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 1,
                        },
                      },
                      '&.Mui-disabled': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={handleUpdatePassword}
                  disabled={updatePasswordMutation.isPending}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(22, 163, 74, 0.25)',
                    },
                  }}
                >
                  {updatePasswordMutation.isPending ? t('common.loading') : t('account.updatePassword')}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <Card
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            background: _isDarkMode
              ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.error.main, 0.08)} 100%)`
              : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.error.main, 0.15)}`,
            boxShadow: `0 4px 20px ${alpha(theme.palette.error.main, 0.1)}`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.error.main}, ${alpha(theme.palette.error.main, 0.5)})`,
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${alpha(theme.palette.error.main, 0.7)} 100%)`,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.3)}`,
                }}
              >
                <Bell size={24} weight="bold" color="white" />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                {t('account.notificationPreferences')}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {t('account.notificationsComingSoon')}
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        id="upload-avatar"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {/* Cancel Subscription Dialog */}
      <Dialog
        open={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Warning size={24} weight="duotone" color={theme.palette.error.main} />
            <Typography variant="h6">{t('account.cancelSubscriptionTitle')}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('account.cancelSubscriptionConfirm', { plan: mapMembershipName(selectedPlan as SubscriptionPlan) })}
          </Typography>
          <Box sx={{ bgcolor: 'rgba(237, 108, 2, 0.1)', p: 2, borderRadius: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              {t('account.accessUntilDate', { date: formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)) })}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setIsCancelDialogOpen(false)}
            variant="outlined"
          >
            {t('account.keepSubscription')}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => cancelSubscriptionMutation.mutate(selectedPlan!)}
            disabled={cancelSubscriptionMutation.isPending}
          >
            {cancelSubscriptionMutation.isPending ? t('account.processing') : t('account.yesCancel')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}