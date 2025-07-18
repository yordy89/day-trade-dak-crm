'use client';

import * as React from 'react';
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
  const { user } = useClientAuth();
  const setUser = useAuthStore.getState().setUser;
  const queryClient = useQueryClient();
  const { t } = useTranslation('academy');
  
  const [tabValue, setTabValue] = React.useState(0);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false);
  
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

  const isPremium = (() => {
    const allSubs = user?.subscriptions || [];
    return allSubs.some((sub: any) => {
      if (typeof sub === 'string') return true;
      if (sub && typeof sub === 'object' && 'plan' in sub) {
        return !sub.expiresAt || new Date(sub.expiresAt) > new Date();
      }
      return false;
    });
  })();

  // Subscription price mapping based on API pricing service
  const subscriptionPrices: Record<string, string> = {
    [SubscriptionPlan.MasterClases]: '$299.99/mes',
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
              : `linear-gradient(135deg, ${theme.palette.grey[800]} 0%, ${theme.palette.grey[600]} 100%)`,
            position: 'relative',
          }}
        >
          {/* Floating elements for premium users */}
          {isPremium && (
            <>
              <Crown 
                size={80} 
                weight="duotone" 
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 40,
                  opacity: 0.1,
                }}
              />
              <Trophy 
                size={60} 
                weight="duotone" 
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 40,
                  opacity: 0.1,
                }}
              />
            </>
          )}
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
              <Stack direction="row" spacing={4} mt={3}>
                <Box>
                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    {(() => {
                      const allSubs = user?.subscriptions || [];
                      return allSubs.filter((sub: any) => {
                        if (typeof sub === 'string') return true;
                        if (sub && typeof sub === 'object' && 'plan' in sub) {
                          return Boolean(!sub.expiresAt || new Date(sub.expiresAt) > new Date());
                        }
                        return false;
                      }).length;
                    })()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('subscriptions.currentPlan')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('overview.coursesCompleted')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('overview.achievements', { count: 0 })}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Stack 
            direction="row" 
            spacing={0}
            sx={{ 
              overflowX: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {[
              { icon: <User size={20} />, label: t('account.personalInfo') },
              { icon: <CreditCard size={20} />, label: t('navigation.subscriptions') },
              { icon: <LockKey size={20} />, label: t('settings.privacy.title') },
              { icon: <Bell size={20} />, label: t('settings.notifications.title') },
            ].map((tab, index) => (
              <Button
                key={tab.label}
                onClick={() => setTabValue(index)}
                sx={{
                  minHeight: 64,
                  px: 3,
                  borderRadius: 0,
                  borderBottom: '3px solid',
                  borderBottomColor: tabValue === index ? 'primary.main' : 'transparent',
                  color: tabValue === index ? 'primary.main' : 'text.secondary',
                  fontWeight: tabValue === index ? 600 : 500,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                startIcon={tab.icon}
              >
                {tab.label}
              </Button>
            ))}
          </Stack>
        </Box>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight={600}>
                {t('account.personalInfo')}
              </Typography>
              <Button
                variant={isEditing ? "contained" : "outlined"}
                startIcon={isEditing ? <CheckCircle size={20} /> : <PencilSimple size={20} />}
                onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                disabled={updateProfileMutation.isPending}
              >
                {isEditing ? (updateProfileMutation.isPending ? t('common.loading') : t('common.save')) : t('common.edit')}
              </Button>
            </Stack>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
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
            <Typography variant="h6" fontWeight={600} mb={2}>
              {t('subscriptions.currentPlan')}
            </Typography>
            {(() => {
              // Get all active subscriptions (both from activeSubscriptions and regular subscriptions)
              const allSubscriptions = user?.subscriptions || [];
              const activeSubscriptions = allSubscriptions.filter((sub: any) => {
                if (typeof sub === 'string') {
                  return true; // String subscriptions are always active
                } else if (sub && typeof sub === 'object' && 'plan' in sub) {
                  // Object subscriptions are active if they don't have expiresAt or haven't expired
                  return !sub.expiresAt || new Date(sub.expiresAt) > new Date();
                }
                return false;
              });

              return activeSubscriptions.length > 0 ? (
                <Grid container spacing={2}>
                  {activeSubscriptions.map((subscription: any) => {
                    const plan = typeof subscription === 'string' ? subscription : subscription.plan;
                    const expiresAt = typeof subscription === 'object' ? subscription.expiresAt : null;
                    
                    
                    // Determine if subscription is recurring or one-time
                    // If it has an expiresAt date, it's a one-time payment
                    const hasExpirationDate = Boolean(expiresAt);
                    const isRecurring = !hasExpirationDate && [
                      SubscriptionPlan.LiveWeeklyManual,
                      SubscriptionPlan.LiveWeeklyRecurring,
                      SubscriptionPlan.MasterClases,
                      SubscriptionPlan.LiveRecorded,
                      SubscriptionPlan.PSICOTRADING
                    ].includes(plan as SubscriptionPlan);
                    
                    return (
                    <Grid item xs={12} md={6} key={plan}>
                      <Card
                        sx={{
                          border: '2px solid',
                          borderColor: 'success.main',
                          position: 'relative',
                          overflow: 'visible',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -12,
                            right: 20,
                            bgcolor: 'success.main',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          {t('account.active')}
                        </Box>
                        <CardContent sx={{ p: 3 }}>
                          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                            <Crown size={32} weight="duotone" color={theme.palette.warning.main} />
                            <Box>
                              <Typography variant="h6" fontWeight={600}>
                                {mapMembershipName(plan as SubscriptionPlan)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {expiresAt ? t('account.activeUntil', { date: formatDate(expiresAt) }) : t('account.autoRenewalActive')}
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
                            {isRecurring && !expiresAt ? (
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                  {t('account.status')}:
                                </Typography>
                                <Typography variant="body2" fontWeight={500} color="success.main">
                                  {t('account.activeAutoRenewal')}
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
                                if (hasExpirationDate) {
                                  return t('account.oneTimePayment');
                                }
                                if ([SubscriptionPlan.LiveWeeklyManual, SubscriptionPlan.LiveWeeklyRecurring].includes(plan as SubscriptionPlan)) {
                                  return t('account.weeklySubscription');
                                }
                                if (isRecurring) {
                                  return t('account.monthlySubscription');
                                }
                                return t('account.oneTimePayment');
                              })()}
                            </Typography>
                          </Stack>
                          </Stack>

                          {isRecurring ? (
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
              <Card sx={{ textAlign: 'center', p: 6 }}>
                <Shield size={64} weight="duotone" color={theme.palette.grey[400]} />
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  {t('account.noActiveSubscriptions')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {t('account.exploreOurPlans')}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  href="/academy/subscription/plans"
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
              } else if (sub && typeof sub === 'object' && 'plan' in sub && 'expiresAt' in sub) {
                // Object subscriptions are expired if they have an expiresAt date in the past
                return sub.expiresAt && new Date(sub.expiresAt) <= new Date();
              }
              return false;
            });

            return expiredSubscriptions.length > 0 ? (
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Historial de Suscripciones
                </Typography>
                <Stack spacing={2}>
                  {expiredSubscriptions.map((subscription: any) => {
                    const plan = subscription.plan;
                    const expiredDate = subscription.expiresAt;
                    
                    return (
                      <Card key={`expired-${plan}`} sx={{ opacity: 0.7 }}>
                        <CardContent sx={{ p: 2 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Clock size={24} weight="duotone" color={theme.palette.grey[500]} />
                              <Box>
                                <Typography fontWeight={500}>
                                  {mapMembershipName(plan as SubscriptionPlan)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Expiró el {formatDate(expiredDate)}
                                </Typography>
                              </Box>
                            </Stack>
                            <Chip
                              label="Expirado"
                              size="small"
                              variant="outlined"
                              color="default"
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
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              {t('account.changePassword')}
            </Typography>
            <Grid container spacing={3}>
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
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
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
                  {t('account.updatePassword')}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              Preferencias de Notificaciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Próximamente podrás configurar tus preferencias de notificaciones.
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
            <Typography variant="h6">Cancelar suscripción</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            ¿Estás seguro de que quieres cancelar tu suscripción{' '}
            <strong>{mapMembershipName(selectedPlan as SubscriptionPlan)}</strong>?
            Mantendrás el acceso hasta el final de tu ciclo de facturación.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setIsCancelDialogOpen(false)}
            variant="outlined"
          >
            Mantener suscripción
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => cancelSubscriptionMutation.mutate(selectedPlan!)}
            disabled={cancelSubscriptionMutation.isPending}
          >
            {cancelSubscriptionMutation.isPending ? 'Procesando...' : 'Sí, cancelar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}