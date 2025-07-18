'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useClientAuth } from '@/hooks/use-client-auth';
import { useLogout } from '@/hooks/use-logout';
import { useTheme } from '@/components/theme/theme-provider';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
  Chip,
  Badge,
  Paper,
  useTheme as useMuiTheme,
  alpha,
} from '@mui/material';
import {
  Sun,
  Moon,
  Bell,
  Translate,
  User,
  CreditCard,
  BookOpen,
  SignOut,
  ChartLine,
  CaretDown,
  Crown,
  Sparkle,
  House,
  VideoCamera,
} from '@phosphor-icons/react';
import { paths } from '@/paths';
import { useMutation } from '@tanstack/react-query';
import API from '@/lib/axios';
import { logger } from '@/lib/default-logger';
import { useTranslation } from 'react-i18next';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

interface HeaderProps {
  pageTitle?: string;
  pageSubtitle?: string;
}

export function Header({ pageTitle = 'Dashboard', pageSubtitle }: HeaderProps): React.JSX.Element {
  const router = useRouter();
  const theme = useMuiTheme();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useClientAuth();
  const logout = useLogout();
  const { t, i18n } = useTranslation('academy');
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [langAnchorEl, setLangAnchorEl] = React.useState<null | HTMLElement>(null);
  const [currentLang, setCurrentLang] = React.useState<Language>(
    languages.find(lang => lang.code === i18n.language) || languages[0]
  );
  
  const openMenu = Boolean(anchorEl);
  const openLangMenu = Boolean(langAnchorEl);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      const response = await API.post('/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    onSuccess: () => {
      logout();
    },
    onError: (error) => {
      logger.error('Logout failed', error);
      logout();
    },
  });

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLangMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangMenuClose = () => {
    setLangAnchorEl(null);
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    void i18n.changeLanguage(lang.code);
    handleLangMenuClose();
  };

  const handleLogout = () => {
    handleMenuClose();
    logoutMutation.mutate();
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return (firstName[0] || '') + (lastName[0] || '') || 'U';
  };

  const getSubscriptionBadge = () => {
    if (!user?.subscriptions || user.subscriptions.length === 0) return 'Free';
    const subscription = user.subscriptions[0];
    // Handle both string and object subscription formats
    const planName = typeof subscription === 'string' ? subscription : subscription.plan;
    return String(planName).charAt(0).toUpperCase() + String(planName).slice(1);
  };

  const isPremium = user?.subscriptions && user.subscriptions.length > 0;

  return (
    <Box
      component="header"
      sx={{
        borderBottom: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.1),
        backgroundColor: isDarkMode 
          ? alpha(theme.palette.background.paper, 0.9)
          : alpha(theme.palette.background.paper, 0.95),
        position: 'sticky',
        top: 0,
        zIndex: (muiTheme) => muiTheme.zIndex.appBar,
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
      }}
    >
      {/* Floating ETF Symbols Background Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Floating ETF Symbols with Percentage */}
        {[
          { symbol: 'IWM', change: '+1.2%' },
          { symbol: 'SPY', change: '-0.8%' },
          { symbol: 'QQQ', change: '+2.4%' },
          { symbol: 'DIA', change: '+0.5%' },
          { symbol: 'VTI', change: '-1.1%' },
          { symbol: 'VOO', change: '+1.8%' },
        ].map((etf) => (
          <Box
            key={etf.symbol}
            sx={{
              position: 'absolute',
              top: '50%',
              left: `${10 + (etf.symbol.charCodeAt(0) % 6 * 15)}%`,
              transform: 'translateY(-50%)',
              animation: `drift${etf.symbol.charCodeAt(0) % 2} ${25 + etf.symbol.charCodeAt(0) % 10 * 3}s ease-in-out infinite`,
              '@keyframes drift0': {
                '0%, 100%': { transform: 'translateY(-50%) translateX(0px)' },
                '50%': { transform: 'translateY(-50%) translateX(-20px)' },
              },
              '@keyframes drift1': {
                '0%, 100%': { transform: 'translateY(-50%) translateX(0px)' },
                '50%': { transform: 'translateY(-50%) translateX(20px)' },
              },
            }}
          >
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 600,
                color: theme.palette.text.primary,
                opacity: isDarkMode ? 0.1 : 0.08,
              }}
            >
              {etf.symbol}
            </Typography>
            <Typography
              sx={{
                fontSize: '9px',
                fontWeight: 500,
                color: etf.change.startsWith('+') ? theme.palette.success.main : theme.palette.error.main,
                opacity: isDarkMode ? 0.12 : 0.1,
                textAlign: 'center',
              }}
            >
              {etf.change}
            </Typography>
          </Box>
        ))}
        
        {/* Mini Candlesticks */}
        {[
          { type: 'green', left: '5%', delay: 0 },
          { type: 'red', left: '15%', delay: 2 },
          { type: 'green', left: '25%', delay: 4 },
          { type: 'red', left: '35%', delay: 1 },
          { type: 'green', left: '55%', delay: 3 },
          { type: 'red', left: '65%', delay: 5 },
          { type: 'green', left: '75%', delay: 2 },
          { type: 'red', left: '85%', delay: 4 },
          { type: 'green', left: '95%', delay: 1 },
        ].map((candle) => (
          <Box
            key={`candle-${candle.left}-${candle.delay}`}
            sx={{
              position: 'absolute',
              top: '50%',
              left: candle.left,
              transform: 'translateY(-50%)',
              opacity: isDarkMode ? 0.12 : 0.1,
              animation: `float${candle.delay % 2} ${30 + candle.delay * 5}s ease-in-out infinite`,
              animationDelay: `${candle.delay}s`,
              '@keyframes float0': {
                '0%, 100%': { transform: 'translateY(-50%)' },
                '50%': { transform: 'translateY(-60%)' },
              },
              '@keyframes float1': {
                '0%, 100%': { transform: 'translateY(-50%)' },
                '50%': { transform: 'translateY(-40%)' },
              },
            }}
          >
            {/* Wick */}
            <Box
              sx={{
                width: '1px',
                height: '16px',
                bgcolor: candle.type === 'green' ? theme.palette.success.main : theme.palette.error.main,
                margin: '0 auto',
              }}
            />
            {/* Body */}
            <Box
              sx={{
                width: '6px',
                height: '8px',
                bgcolor: candle.type === 'green' ? theme.palette.success.main : theme.palette.error.main,
                mt: '-12px',
                borderRadius: '1px',
              }}
            />
          </Box>
        ))}
      </Box>
      <Box sx={{ px: 3, height: 64, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Left Section - Page Title with Navigation */}
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Home Button */}
            <IconButton
              onClick={() => router.push('/')}
              sx={{
                width: 40,
                height: 40,
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                },
              }}
            >
              <House size={20} weight="duotone" />
            </IconButton>
            
            <Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                {pageTitle}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {pageSubtitle || t('academy:common.welcomeBack', { name: user?.firstName || 'Trader' })}
              </Typography>
            </Box>
          </Stack>

          {/* Right Section - Actions */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Quick Access to Live Classes */}
            <Button
              size="small"
              onClick={() => router.push('/live')}
              startIcon={<VideoCamera size={18} weight="fill" />}
              sx={{
                color: 'error.main',
                bgcolor: alpha(theme.palette.error.main, 0.08),
                px: 2,
                py: 1,
                borderRadius: 2,
                fontWeight: 600,
                display: { xs: 'none', md: 'flex' },
                '&:hover': {
                  bgcolor: alpha(theme.palette.error.main, 0.12),
                },
              }}
            >
              {t('academy:common.live')}
            </Button>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, opacity: 0.3, display: { xs: 'none', md: 'flex' } }} />
            
            {/* Language Selector */}
            <Button
              size="small"
              onClick={handleLangMenuOpen}
              startIcon={<Translate size={18} />}
              endIcon={<CaretDown size={16} />}
              sx={{
                color: 'text.primary',
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                px: 2,
                py: 1,
                borderRadius: 2,
                fontWeight: 500,
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                },
              }}
            >
              {currentLang.code.toUpperCase()}
            </Button>

            {/* Theme Toggle */}
            <IconButton
              onClick={toggleTheme}
              size="small"
              sx={{
                width: 40,
                height: 40,
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                },
              }}
            >
              {isDarkMode ? <Sun size={20} weight="duotone" /> : <Moon size={20} weight="duotone" />}
            </IconButton>

            {/* Notifications */}
            <IconButton
              size="small"
              sx={{
                width: 40,
                height: 40,
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                },
              }}
            >
              <Badge 
                badgeContent={3} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.65rem',
                    height: 16,
                    minWidth: 16,
                  }
                }}
              >
                <Bell size={20} weight="duotone" />
              </Badge>
            </IconButton>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, opacity: 0.3 }} />

            {/* User Menu Button */}
            <Button
              onClick={handleProfileMenuOpen}
              sx={{
                p: 0.5,
                pr: 1.5,
                borderRadius: 3,
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: isPremium ? 'primary.main' : 'grey.500',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: isPremium ? '2px solid' : 'none',
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  }}
                  src={user?.profileImage}
                >
                  {getUserInitials()}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : (user?.firstName || 'Usuario')}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {isPremium ? <Crown size={12} weight="fill" color={theme.palette.warning.main} /> : null}
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      {getSubscriptionBadge()}
                    </Typography>
                  </Stack>
                </Box>
                <CaretDown size={16} />
              </Stack>
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Language Menu */}
      <Menu
        anchorEl={langAnchorEl}
        open={openLangMenu}
        onClose={handleLangMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 150,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang)}
            selected={lang.code === currentLang.code}
            sx={{ py: 1.5 }}
          >
            <Stack direction="row" spacing={2} alignItems="center" width="100%">
              <span style={{ fontSize: '20px' }}>{lang.flag}</span>
              <Typography>{lang.name}</Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            minWidth: 320,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 20,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              borderLeft: '1px solid',
              borderTop: '1px solid',
              borderColor: 'divider',
            },
          },
        }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 3, py: 2.5 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: isPremium ? 'primary.main' : 'grey.500',
                fontSize: '1.25rem',
                fontWeight: 600,
                border: isPremium ? '3px solid' : 'none',
                borderColor: alpha(theme.palette.primary.main, 0.3),
              }}
              src={user?.profileImage}
            >
              {getUserInitials()}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : (user?.firstName || 'Usuario')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || 'email@example.com'}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                {isPremium ? (
                  <Chip
                    icon={<Crown size={14} weight="fill" />}
                    label={getSubscriptionBadge()}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: 'warning.main',
                      fontWeight: 600,
                      '& .MuiChip-icon': {
                        color: 'warning.main',
                      }
                    }}
                  />
                ) : (
                  <Chip
                    label={t('academy:common.freePlan')}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>
          
          {!isPremium && (
            <Paper
              sx={{
                mt: 2,
                p: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.05)} 100%)`,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.2),
                borderRadius: 2,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Sparkle size={20} weight="fill" color={theme.palette.primary.main} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="caption" fontWeight={600}>
                    {t('academy:common.becomePremium')}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    {t('academy:common.unlockAllFeatures')}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => {
                    handleMenuClose();
                    router.push(paths.academy.subscriptions.plans);
                  }}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    fontWeight: 600,
                    px: 2,
                  }}
                >
                  {t('academy:common.upgrade')}
                </Button>
              </Stack>
            </Paper>
          )}
        </Box>
        
        <Divider />

        {/* Navigation Items */}
        <Box sx={{ py: 1 }}>
          <MenuItem 
            onClick={() => { handleMenuClose(); router.push(paths.academy.overview); }}
            sx={{ py: 1.5, px: 3 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ChartLine size={20} />
            </ListItemIcon>
            <Typography>{t('academy:common.dashboard')}</Typography>
          </MenuItem>

          <MenuItem 
            onClick={() => { handleMenuClose(); router.push(paths.academy.account); }}
            sx={{ py: 1.5, px: 3 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <User size={20} />
            </ListItemIcon>
            <Typography>{t('academy:common.myProfile')}</Typography>
          </MenuItem>

          <MenuItem 
            onClick={() => { handleMenuClose(); router.push(paths.academy.subscriptions.plans); }}
            sx={{ py: 1.5, px: 3 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CreditCard size={20} />
            </ListItemIcon>
            <Typography>{t('academy:common.mySubscription')}</Typography>
          </MenuItem>

          <MenuItem 
            onClick={() => { handleMenuClose(); router.push(paths.academy.courses); }}
            sx={{ py: 1.5, px: 3 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <BookOpen size={20} />
            </ListItemIcon>
            <Typography>{t('academy:common.myCourses')}</Typography>
          </MenuItem>

        </Box>

        <Divider />

        {/* Logout */}
        <Box sx={{ py: 1 }}>
          <MenuItem 
            onClick={handleLogout} 
            sx={{ 
              py: 1.5, 
              px: 3,
              color: 'error.main',
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.08),
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
              <SignOut size={20} />
            </ListItemIcon>
            <Typography fontWeight={500}>{t('academy:common.logout')}</Typography>
          </MenuItem>
        </Box>
      </Menu>
    </Box>
  );
}