'use client';

import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem,
  Divider,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Typography,
} from '@mui/material';
import {
  DarkMode,
  LightMode,
  AccountCircle,
  Menu as MenuIcon,
  Close,
  OpenInNew,
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/theme/theme-provider';
import { useClientAuth } from '@/hooks/use-client-auth';
import { useLogout } from '@/hooks/use-logout';
import { mainNavigation } from '@/config/navigation';
import { TopBar } from '@/components/landing/top-bar';
import { useSettings } from '@/services/api/settings.service';

export function MainNavbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useClientAuth();
  const logout = useLogout();
  const isMobile = useMediaQuery('(max-width:960px)');
  const { data: settings } = useSettings();
  
  // Normalize language code to avoid hydration mismatch
  const normalizedLang = i18n.language?.split('-')[0] || 'en';
  
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchor(null);
  };

  const changeLanguage = (lng: string) => {
    void i18n.changeLanguage(lng);
    handleLanguageClose();
  };

  const handleNavClick = (item: typeof mainNavigation[0]) => {
    // Close mobile menu if open
    setMobileOpen(false);

    // Check if item requires auth and user is not authenticated
    if (item.requiresAuth && !isAuthenticated) {
      // Store the intended destination
      const returnUrl = item.href;
      router.push(`/auth/sign-in?returnUrl=${encodeURIComponent(returnUrl || '/')}`);
      return;
    }

    // Handle external links
    if (item.external && item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
      return;
    }

    // Handle internal navigation
    if (item.href) {
      router.push(item.href);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActiveRoute = (href: string | undefined) => {
    if (!href) return false;
    
    // For home page
    if (href === '/' && pathname === '/') return true;
    
    // For other pages, check if pathname starts with href
    if (href !== '/' && pathname.startsWith(href)) return true;
    
    return false;
  };

  const renderDesktopMenu = () => (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', lg: 'flex' }, gap: 0.5, justifyContent: 'center' }}>
      {mainNavigation.map((item) => (
        <Button
          key={item.key}
          onClick={() => handleNavClick(item)}
          endIcon={item.external ? <OpenInNew sx={{ fontSize: 14 }} /> : null}
          sx={{
            color: isDarkMode ? 'white' : 'black',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            px: 1.5,
            minWidth: 'auto',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: isActiveRoute(item.href) ? '80%' : '0',
              height: '2px',
              backgroundColor: item.key === 'live' ? '#ef4444' : '#16a34a',
              transition: 'width 0.3s ease',
            },
            '&:hover::after': {
              width: '80%',
            },
            ...(isActiveRoute(item.href) && {
              fontWeight: 600,
              color: item.key === 'live' ? '#ef4444' : (isDarkMode ? '#16a34a' : '#15803d'),
            }),
            ...(item.key === 'live' && {
              color: '#ef4444',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                animation: 'pulse 2s infinite',
              },
            }),
          }}
        >
          {t(`navigation.${item.key}`)}
          {item.badge ? (
            <Box
              sx={{
                position: 'absolute',
                top: -6,
                right: -8,
                backgroundColor: item.badge === 'EXCLUSIVE' ? '#8b5cf6' : '#ef4444',
                color: 'white',
                fontSize: '8px',
                fontWeight: 700,
                px: 0.5,
                py: 0.2,
                borderRadius: '8px',
                lineHeight: 1,
                minWidth: '24px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {item.badge}
            </Box>
          ) : null}
        </Button>
      ))}
    </Box>
  );

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileOpen}
      onClose={() => setMobileOpen(false)}
      PaperProps={{
        sx: {
          width: 280,
          backgroundColor: isDarkMode ? '#0a0a0a' : 'white',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Image
          src={isDarkMode 
            ? (settings?.branding?.logo_dark_url || "/assets/logos/day_trade_dak_white_logo.png")
            : (settings?.branding?.logo_light_url || "/assets/logos/day_trade_dak_black_logo.png")
          }
          alt={settings?.branding?.company_name || "DayTradeDak"}
          width={120}
          height={35}
          style={{ 
            objectFit: 'contain'
          }}
        />
        <IconButton onClick={() => setMobileOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {mainNavigation.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton onClick={() => handleNavClick(item)} sx={{ position: 'relative' }}>
              <ListItemText primary={t(`navigation.${item.key}`)} />
              {item.badge ? (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: item.external ? 40 : 16,
                    backgroundColor: item.badge === 'EXCLUSIVE' ? '#8b5cf6' : '#ef4444',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: 700,
                    px: 0.75,
                    py: 0.25,
                    borderRadius: '10px',
                    lineHeight: 1,
                    minWidth: '28px',
                    textAlign: 'center',
                  }}
                >
                  {item.badge}
                </Box>
              ) : null}
              {item.external ? <OpenInNew sx={{ fontSize: 16, ml: 1 }} /> : null}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        {/* Language and Theme Controls */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleLanguageClick}
            startIcon={<Box sx={{ fontSize: '1.2rem' }}>{mounted ? (normalizedLang === 'es' ? '🇪🇸' : '🇺🇸') : '🇺🇸'}</Box>}
            sx={{ textTransform: 'none' }}
          >
            {mounted ? (normalizedLang === 'es' ? 'Español' : 'English') : 'English'}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={toggleTheme}
            startIcon={isDarkMode ? <LightMode /> : <DarkMode />}
            sx={{ textTransform: 'none' }}
          >
            {isDarkMode ? t('theme.light') : t('theme.dark')}
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {isAuthenticated ? (
          <>
            <Button
              fullWidth
              component={Link}
              href="/academy/account"
              startIcon={<AccountCircle />}
              sx={{ mb: 1 }}
            >
              {t('navigation.profile')}
            </Button>
            <Button
              fullWidth
              onClick={handleLogout}
              variant="outlined"
              color="error"
            >
              {t('navigation.logout')}
            </Button>
          </>
        ) : (
          <>
            <Button
              fullWidth
              component={Link}
              href="/auth/sign-in"
              variant="outlined"
              sx={{ mb: 1 }}
            >
              {t('navigation.login')}
            </Button>
            <Button
              fullWidth
              component={Link}
              href="/auth/sign-up"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: 'white',
              }}
            >
              {t('navigation.signup')}
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  );

  return (
    <>
      {/* Top Bar */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1300 }}>
        <TopBar />
      </Box>
      
      <AppBar
        position="fixed"
        elevation={scrolled ? 1 : 0}
        sx={{
          top: 36, // Height of TopBar
          backgroundColor: scrolled 
            ? (isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)')
            : (isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'),
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ minHeight: '80px', px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 6 }}>
              <Image
                src={isDarkMode 
            ? (settings?.branding?.logo_dark_url || "/assets/logos/day_trade_dak_white_logo.png")
            : (settings?.branding?.logo_light_url || "/assets/logos/day_trade_dak_black_logo.png")
          }
                alt={settings?.branding?.company_name || "DayTradeDak"}
                width={180}
                height={50}
                style={{ 
                  objectFit: 'contain'
                }}
              />
            </Box>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile ? renderDesktopMenu() : null}

          {/* Right Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Language */}
            <Button
              size="small"
              onClick={handleLanguageClick}
              startIcon={<Box sx={{ fontSize: '1.2rem' }}>{mounted ? (normalizedLang === 'es' ? '🇪🇸' : '🇺🇸') : '🇺🇸'}</Box>}
              sx={{ 
                color: isDarkMode ? 'white' : 'black', 
                cursor: 'pointer',
                textTransform: 'none',
                minWidth: 'auto',
                '& .MuiButton-startIcon': {
                  marginRight: 0.5,
                },
              }}
            >
              {mounted ? normalizedLang.toUpperCase() : 'EN'}
            </Button>

            {/* Theme Toggle */}
            <IconButton
              size="small"
              onClick={toggleTheme}
              sx={{ color: isDarkMode ? 'white' : 'black', cursor: 'pointer' }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>

            {/* Desktop Auth Buttons */}
            {!isMobile ? (
              <>
                <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 30, alignSelf: 'center' }} />
                {isAuthenticated && user ? (
                  <>
                    <Button
                      component={Link}
                      href="/academy/account"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        textTransform: 'none',
                        px: 2,
                        py: 1,
                        borderRadius: 3,
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        '&:hover': {
                          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        },
                      }}
                    >
                      <Avatar
                        src={user.profileImage}
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: user.subscriptions?.length > 0 ? 'primary.main' : 'grey.500',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        {user.firstName?.[0]?.toUpperCase() || 'U'}
                      </Avatar>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ color: isDarkMode ? 'white' : 'black', lineHeight: 1.2 }}
                        >
                          {user.firstName || 'Usuario'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {user.subscriptions?.length > 0 ? (
                            <>
                              <Box
                                sx={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'white' }}>👑</Typography>
                              </Box>
                              <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 500 }}>
                                Premium
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Free
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="outlined"
                      size="small"
                      sx={{
                        textTransform: 'none',
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                        color: isDarkMode ? 'white' : 'black',
                      }}
                    >
                      {t('navigation.logout')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      component={Link}
                      href="/auth/sign-in"
                      startIcon={<AccountCircle />}
                      sx={{
                        color: isDarkMode ? 'white' : 'black',
                        textTransform: 'none',
                      }}
                    >
                      {t('navigation.login')}
                    </Button>
                    <Button
                      component={Link}
                      href="/auth/sign-up"
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                        color: 'white',
                        textTransform: 'none',
                        px: 3,
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                        },
                      }}
                    >
                      {t('navigation.signup')}
                    </Button>
                  </>
                )}
              </>
            ) : null}

            {/* Mobile Menu Button */}
            {isMobile ? (
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ color: isDarkMode ? 'white' : 'black', cursor: 'pointer' }}
              >
                <MenuIcon />
              </IconButton>
            ) : null}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Language Menu */}
      <Menu
        anchorEl={languageAnchor}
        open={Boolean(languageAnchor)}
        onClose={handleLanguageClose}
        PaperProps={{
          sx: {
            backgroundColor: isDarkMode ? '#0a0a0a' : 'white',
          },
        }}
      >
        <MenuItem onClick={() => changeLanguage('en')}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ fontSize: '1.2rem' }}>🇺🇸</Box>
            {t('language.en')}
          </Box>
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('es')}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ fontSize: '1.2rem' }}>🇪🇸</Box>
            {t('language.es')}
          </Box>
        </MenuItem>
      </Menu>

      {/* Mobile Menu */}
      {renderMobileMenu()}

    </>
  );
}