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
  useMediaQuery,
} from '@mui/material';
import {
  Sun,
  Moon,
  Bell,
  Translate,
  User,
  CreditCard,
  SignOut,
  ChartLine,
  CaretDown,
  Crown,
  Sparkle,
  House,
  VideoCamera,
  List as MenuIcon,
  Question,
  Gear,
} from '@phosphor-icons/react';
import { paths } from '@/paths';
import { useMutation } from '@tanstack/react-query';
import API from '@/lib/axios';
import { logger } from '@/lib/default-logger';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/services/api/settings.service';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { data: settings } = useSettings();
  
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

  const handleMobileMenuToggle = () => {
    // @ts-ignore
    if (window.academySidebarToggle) {
      // @ts-ignore
      window.academySidebarToggle();
    }
  };

  const handleHelpSupport = () => {
    handleMenuClose();
    const isChatbotEnabled = settings?.features?.chatbot_enabled !== false;
    if (isChatbotEnabled) {
      // Dispatch global event to open chatbot
      window.dispatchEvent(new CustomEvent('openChatbot'));
    } else {
      // Fallback to contact page
      router.push('/contact');
    }
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
    if (!subscription) return 'Free'; // Handle null/undefined subscription
    // Handle both string and object subscription formats
    const planName = typeof subscription === 'string' ? subscription : subscription?.plan || 'Free';
    return String(planName).charAt(0).toUpperCase() + String(planName).slice(1);
  };

  const isPremium = user?.subscriptions && user.subscriptions.length > 0;

  return (
    <Box
      component="header"
      sx={{
        borderBottom: '1px solid',
        borderColor: isDarkMode
          ? alpha(theme.palette.primary.main, 0.15)
          : alpha(theme.palette.primary.main, 0.1),
        backgroundColor: isDarkMode
          ? alpha('#0f0f0f', 0.95)
          : alpha('#fafafa', 0.98),
        background: isDarkMode
          ? `linear-gradient(90deg, ${alpha('#0f0f0f', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 50%, ${alpha('#0f0f0f', 0.98)} 100%)`
          : `linear-gradient(90deg, ${alpha('#fafafa', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 50%, ${alpha('#fafafa', 0.98)} 100%)`,
        position: 'sticky',
        top: 0,
        zIndex: (muiTheme) => muiTheme.zIndex.appBar,
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        boxShadow: isDarkMode
          ? `0 4px 20px ${alpha('#000', 0.3)}`
          : `0 2px 12px ${alpha('#000', 0.05)}`,
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
      <Box sx={{ px: { xs: 2, sm: 3 }, height: 64, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
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
            {/* Mobile Hamburger Menu */}
            <IconButton
              onClick={handleMobileMenuToggle}
              sx={{
                width: 42,
                height: 42,
                display: { xs: 'flex', lg: 'none' },
                borderRadius: 2,
                bgcolor: isDarkMode
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.primary.main, 0.05),
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, isDarkMode ? 0.2 : 0.1),
                color: theme.palette.primary.main,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, isDarkMode ? 0.15 : 0.1),
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  transform: 'scale(1.05)',
                },
              }}
            >
              <MenuIcon size={20} weight="bold" />
            </IconButton>

            {/* Home Button on Desktop */}
            <IconButton
              onClick={() => router.push('/')}
              sx={{
                width: 42,
                height: 42,
                display: { xs: 'none', lg: 'flex' },
                borderRadius: 2,
                bgcolor: isDarkMode
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.primary.main, 0.05),
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, isDarkMode ? 0.2 : 0.1),
                color: theme.palette.primary.main,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, isDarkMode ? 0.15 : 0.1),
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  transform: 'scale(1.05)',
                },
              }}
            >
              <House size={20} weight="duotone" />
            </IconButton>

            {/* Divider */}
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                height: 32,
                alignSelf: 'center',
                borderColor: alpha(theme.palette.primary.main, isDarkMode ? 0.15 : 0.1),
              }}
            />

            {/* Title and Subtitle - Centered */}
            <Stack spacing={0} justifyContent="center" sx={{ minHeight: 42 }}>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  fontSize: { xs: '1.1rem', sm: '1.35rem' },
                  background: isDarkMode
                    ? `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`
                    : theme.palette.text.primary,
                  backgroundClip: isDarkMode ? 'text' : 'unset',
                  textFillColor: isDarkMode ? 'transparent' : 'unset',
                  WebkitBackgroundClip: isDarkMode ? 'text' : 'unset',
                  WebkitTextFillColor: isDarkMode ? 'transparent' : 'unset',
                  lineHeight: 1.2,
                }}
              >
                {pageTitle}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  color: alpha(theme.palette.text.secondary, 0.8),
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}
              >
                {pageSubtitle || t('academy:common.welcomeBack', { name: user?.firstName || 'Trader' })}
              </Typography>
            </Stack>
          </Stack>

          {/* Right Section - Actions */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Quick Access to Live Classes */}
            <Button
              size="small"
              onClick={() => router.push('/live')}
              startIcon={<VideoCamera size={18} weight="fill" />}
              sx={{
                color: '#fff',
                background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                border: '1px solid',
                borderColor: alpha(theme.palette.error.main, 0.3),
                px: 2.5,
                py: 1,
                borderRadius: 2,
                fontWeight: 700,
                display: { xs: 'none', md: 'flex' },
                boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.3)}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
                  boxShadow: `0 6px 16px ${alpha(theme.palette.error.main, 0.4)}`,
                  transform: 'translateY(-1px)',
                },
              }}
            >
              {t('academy:common.live')}
            </Button>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                mx: 0.5,
                borderColor: alpha(theme.palette.primary.main, isDarkMode ? 0.15 : 0.1),
                display: { xs: 'none', md: 'flex' },
              }}
            />

            {/* Language Selector */}
            <Button
              size="small"
              onClick={handleLangMenuOpen}
              startIcon={<Translate size={18} />}
              endIcon={<CaretDown size={16} />}
              sx={{
                color: theme.palette.primary.main,
                bgcolor: isDarkMode
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.primary.main, 0.05),
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, isDarkMode ? 0.2 : 0.1),
                px: { xs: 1, sm: 2 },
                py: 1,
                borderRadius: 2,
                fontWeight: 600,
                minWidth: { xs: 'auto', sm: '80px' },
                transition: 'all 0.2s ease',
                '& .MuiButton-startIcon': {
                  display: { xs: 'none', sm: 'inherit' },
                },
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, isDarkMode ? 0.15 : 0.1),
                  borderColor: alpha(theme.palette.primary.main, 0.3),
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
                borderRadius: 2,
                bgcolor: isDarkMode
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.primary.main, 0.05),
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, isDarkMode ? 0.2 : 0.1),
                color: theme.palette.primary.main,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, isDarkMode ? 0.15 : 0.1),
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  transform: 'scale(1.05)',
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
                display: { xs: 'none', sm: 'flex' },
                borderRadius: 2,
                bgcolor: isDarkMode
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.primary.main, 0.05),
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, isDarkMode ? 0.2 : 0.1),
                color: theme.palette.primary.main,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, isDarkMode ? 0.15 : 0.1),
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Bell size={20} weight="duotone" />
            </IconButton>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                mx: { xs: 0.5, sm: 1 },
                borderColor: alpha(theme.palette.primary.main, isDarkMode ? 0.15 : 0.1),
                display: { xs: 'none', sm: 'flex' },
              }}
            />

            {/* User Menu Button */}
            <Button
              onClick={handleProfileMenuOpen}
              sx={{
                p: 0.5,
                pr: 1.5,
                borderRadius: 3,
                bgcolor: isDarkMode
                  ? alpha(theme.palette.primary.main, 0.08)
                  : alpha(theme.palette.primary.main, 0.04),
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, isDarkMode ? 0.15 : 0.1),
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, isDarkMode ? 0.12 : 0.08),
                  borderColor: alpha(theme.palette.primary.main, 0.25),
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
          elevation: 12,
          sx: {
            mt: 1.5,
            minWidth: 180,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, isDarkMode ? 0.25 : 0.15)}`,
            background: isDarkMode
              ? `linear-gradient(180deg, ${alpha('#1a1a1a', 0.98)} 0%, ${alpha('#0f0f0f', 0.99)} 100%)`
              : `linear-gradient(180deg, #ffffff 0%, ${alpha('#f8fafc', 0.98)} 100%)`,
            overflow: 'hidden',
            boxShadow: isDarkMode
              ? `0 12px 40px ${alpha('#000', 0.5)}, 0 0 0 1px ${alpha(theme.palette.primary.main, 0.1)}`
              : `0 12px 40px ${alpha('#000', 0.12)}`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
            },
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang)}
            selected={lang.code === currentLang.code}
            sx={{
              py: 1.5,
              px: 2.5,
              mx: 1,
              my: 0.5,
              borderRadius: 2,
              transition: 'all 0.2s ease',
              bgcolor: lang.code === currentLang.code
                ? alpha(theme.palette.primary.main, isDarkMode ? 0.15 : 0.1)
                : 'transparent',
              border: lang.code === currentLang.code
                ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                : '1px solid transparent',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, isDarkMode ? 0.12 : 0.08),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              },
              '&:first-of-type': {
                mt: 1,
              },
              '&:last-of-type': {
                mb: 1,
              },
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" width="100%">
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  fontSize: '16px',
                }}
              >
                {lang.flag}
              </Box>
              <Typography
                fontWeight={lang.code === currentLang.code ? 600 : 500}
                color={lang.code === currentLang.code ? 'primary.main' : 'text.primary'}
              >
                {lang.name}
              </Typography>
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
          elevation: 12,
          sx: {
            mt: 1.5,
            minWidth: 340,
            borderRadius: 3,
            border: '1px solid',
            borderColor: isDarkMode
              ? alpha(theme.palette.primary.main, 0.15)
              : alpha(theme.palette.divider, 0.5),
            overflow: 'visible',
            background: isDarkMode
              ? `linear-gradient(180deg, ${alpha('#1A2027', 0.98)} 0%, ${alpha('#0F1419', 0.99)} 100%)`
              : `linear-gradient(180deg, #FFFFFF 0%, ${alpha('#F8FAFC', 0.98)} 100%)`,
            boxShadow: isDarkMode
              ? `0 20px 40px ${alpha('#000', 0.4)}, 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`
              : `0 20px 40px ${alpha(theme.palette.grey[500], 0.2)}`,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 20,
              width: 12,
              height: 12,
              bgcolor: isDarkMode ? '#1A2027' : 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              borderLeft: '1px solid',
              borderTop: '1px solid',
              borderColor: isDarkMode
                ? alpha(theme.palette.primary.main, 0.15)
                : alpha(theme.palette.divider, 0.5),
            },
          },
        }}
      >
        {/* User Info Header */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            background: isDarkMode
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.08)} 0%, transparent 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.08)} 0%, transparent 100%)`,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: isPremium
                  ? 'transparent'
                  : isDarkMode ? alpha(theme.palette.grey[700], 0.8) : 'grey.400',
                background: isPremium
                  ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                  : undefined,
                fontSize: '1.25rem',
                fontWeight: 700,
                border: '3px solid',
                borderColor: isPremium
                  ? alpha(theme.palette.primary.main, 0.3)
                  : isDarkMode ? alpha(theme.palette.grey[600], 0.5) : alpha(theme.palette.grey[300], 0.8),
                boxShadow: isPremium
                  ? `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`
                  : 'none',
              }}
              src={user?.profileImage}
            >
              {getUserInitials()}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : (user?.firstName || 'Usuario')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                {user?.email || 'email@example.com'}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.75 }}>
                {isPremium ? (
                  <Chip
                    icon={<Crown size={14} weight="fill" />}
                    label={getSubscriptionBadge()}
                    size="small"
                    sx={{
                      background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.15)} 0%, ${alpha(theme.palette.warning.dark, 0.1)} 100%)`,
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
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
                    sx={{
                      fontWeight: 600,
                      bgcolor: isDarkMode
                        ? alpha(theme.palette.grey[700], 0.5)
                        : alpha(theme.palette.grey[200], 0.8),
                      color: 'text.secondary',
                      border: 'none',
                    }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>

          {!isPremium && (
            <Paper
              elevation={0}
              sx={{
                mt: 2.5,
                p: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.primary.dark, 0.08)} 100%)`,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.25),
                borderRadius: 2.5,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)} 0%, ${alpha(theme.palette.primary.dark, 0.12)} 100%)`,
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                  transform: 'translateY(-1px)',
                },
              }}
              onClick={() => {
                handleMenuClose();
                router.push(paths.academy.subscriptions.plans);
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  <Sparkle size={20} weight="fill" color="#fff" />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight={700} color="text.primary">
                    {t('academy:common.becomePremium')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('academy:common.unlockAllFeatures')}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    fontWeight: 600,
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                    },
                  }}
                >
                  {t('academy:common.upgrade')}
                </Button>
              </Stack>
            </Paper>
          )}
        </Box>

        <Divider sx={{ opacity: isDarkMode ? 0.1 : 0.5 }} />

        {/* Navigation Items */}
        <Box sx={{ py: 1 }}>
          <MenuItem
            onClick={() => { handleMenuClose(); router.push(paths.academy.overview); }}
            sx={{
              py: 1.5,
              px: 3,
              mx: 1,
              borderRadius: 2,
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: isDarkMode
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: theme.palette.primary.main }}>
              <ChartLine size={20} weight="duotone" />
            </ListItemIcon>
            <Typography fontWeight={500}>{t('academy:common.dashboard')}</Typography>
          </MenuItem>

          <MenuItem
            onClick={() => { handleMenuClose(); router.push(paths.academy.account); }}
            sx={{
              py: 1.5,
              px: 3,
              mx: 1,
              borderRadius: 2,
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: isDarkMode
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: theme.palette.primary.main }}>
              <User size={20} weight="duotone" />
            </ListItemIcon>
            <Typography fontWeight={500}>{t('academy:common.myAccount')}</Typography>
          </MenuItem>

          <MenuItem
            onClick={() => { handleMenuClose(); router.push(`${paths.academy.account}?tab=subscriptions`); }}
            sx={{
              py: 1.5,
              px: 3,
              mx: 1,
              borderRadius: 2,
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: isDarkMode
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: theme.palette.primary.main }}>
              <CreditCard size={20} weight="duotone" />
            </ListItemIcon>
            <Typography fontWeight={500}>{t('academy:common.mySubscription')}</Typography>
          </MenuItem>

        </Box>

        <Divider sx={{ opacity: isDarkMode ? 0.1 : 0.5 }} />

        {/* Settings & Help */}
        <Box sx={{ py: 1 }}>
          <MenuItem
            onClick={() => { handleMenuClose(); router.push(`${paths.academy.account}?tab=security`); }}
            sx={{
              py: 1.5,
              px: 3,
              mx: 1,
              borderRadius: 2,
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: isDarkMode
                  ? alpha(theme.palette.grey[700], 0.3)
                  : alpha(theme.palette.grey[200], 0.8),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
              <Gear size={20} weight="duotone" />
            </ListItemIcon>
            <Typography fontWeight={500} color="text.secondary">{t('academy:common.settings')}</Typography>
          </MenuItem>

          <MenuItem
            onClick={handleHelpSupport}
            sx={{
              py: 1.5,
              px: 3,
              mx: 1,
              borderRadius: 2,
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: isDarkMode
                  ? alpha(theme.palette.grey[700], 0.3)
                  : alpha(theme.palette.grey[200], 0.8),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
              <Question size={20} weight="duotone" />
            </ListItemIcon>
            <Typography fontWeight={500} color="text.secondary">{t('academy:common.helpSupport')}</Typography>
          </MenuItem>
        </Box>

        <Divider sx={{ opacity: isDarkMode ? 0.1 : 0.5 }} />

        {/* Logout */}
        <Box sx={{ py: 1, pb: 1.5 }}>
          <MenuItem
            onClick={handleLogout}
            sx={{
              py: 1.5,
              px: 3,
              mx: 1,
              borderRadius: 2,
              color: 'error.main',
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.1),
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
              <SignOut size={20} weight="duotone" />
            </ListItemIcon>
            <Typography fontWeight={600}>{t('academy:common.logout')}</Typography>
          </MenuItem>
        </Box>
      </Menu>
    </Box>
  );
}