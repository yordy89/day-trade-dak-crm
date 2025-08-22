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
                backgroundColor: item.badge === 'EXCLUSIVE' ? '#8b5cf6' : item.badge === 'OFERTA' ? '#f59e0b' : '#ef4444',
                color: 'white',
                fontSize: '8px',
                fontWeight: 700,
                px: 0.5,
                py: 0.2,
                borderRadius: '8px',
                lineHeight: 1,
                minWidth: '24px',
                textAlign: 'center',
                boxShadow: item.badge === 'OFERTA' ? '0 0 15px rgba(245, 158, 11, 0.5)' : '0 2px 4px rgba(0,0,0,0.2)',
                animation: item.badge === 'OFERTA' ? 'offerPulse 2s infinite' : undefined,
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
          background: isDarkMode 
            ? 'linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
          zIndex: 1400,
          boxShadow: '-4px 0 15px rgba(0,0,0,0.2)',
        },
      }}
      sx={{
        zIndex: 1400,
      }}
    >
      {/* Header with gradient */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
        p: 2.5,
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="h6" sx={{ 
            color: 'white', 
            fontWeight: 700,
            fontSize: '1.1rem',
          }}>
            DAY TRADE
          </Typography>
          <Typography variant="h6" sx={{ 
            color: 'white', 
            fontWeight: 800,
            fontSize: '1.1rem',
          }}>
            DAK
          </Typography>
        </Box>
        <IconButton 
          onClick={() => setMobileOpen(false)}
          sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <Close />
        </IconButton>
      </Box>
      {/* Navigation Items */}
      <List sx={{ px: 1, py: 2 }}>
        {mainNavigation.map((item) => (
          <ListItem key={item.key} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton 
              onClick={() => handleNavClick(item)} 
              sx={{ 
                borderRadius: 2,
                px: 2,
                py: 1.5,
                position: 'relative',
                transition: 'all 0.2s',
                backgroundColor: isActiveRoute(item.href) 
                  ? (isDarkMode ? 'rgba(22, 163, 74, 0.15)' : 'rgba(22, 163, 74, 0.1)')
                  : 'transparent',
                '&:hover': {
                  backgroundColor: isDarkMode 
                    ? 'rgba(255,255,255,0.05)' 
                    : 'rgba(0,0,0,0.05)',
                  transform: 'translateX(4px)',
                },
                ...(item.key === 'live' && {
                  border: '1px solid #ef4444',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    width: 6,
                    height: 6,
                    backgroundColor: '#ef4444',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite',
                  },
                }),
              }}
            >
              <ListItemText 
                primary={t(`navigation.${item.key}`)}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: isActiveRoute(item.href) ? 600 : 500,
                    fontSize: '0.95rem',
                    color: item.key === 'live' 
                      ? '#ef4444' 
                      : (isActiveRoute(item.href) ? '#16a34a' : 'inherit'),
                    pl: item.key === 'live' ? 2 : 0,
                  },
                }}
              />
              {item.badge ? (
                <Box
                  sx={{
                    backgroundColor: item.badge === 'EXCLUSIVE' ? '#8b5cf6' : item.badge === 'OFERTA' ? '#f59e0b' : '#ef4444',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    px: 1,
                    py: 0.3,
                    borderRadius: '12px',
                    lineHeight: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    animation: item.badge === 'OFERTA' ? 'offerPulse 2s infinite' : undefined,
                    boxShadow: item.badge === 'OFERTA' ? '0 0 10px rgba(245, 158, 11, 0.4)' : undefined,
                  }}
                >
                  {item.badge}
                </Box>
              ) : null}
              {item.external ? <OpenInNew sx={{ fontSize: 16, ml: 1, opacity: 0.5 }} /> : null}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      {/* Bottom Section */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        background: isDarkMode 
          ? 'rgba(0,0,0,0.3)'
          : 'rgba(0,0,0,0.02)',
      }}>
        {/* Language and Theme Controls */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            fullWidth
            size="small"
            variant={isDarkMode ? 'outlined' : 'contained'}
            onClick={handleLanguageClick}
            startIcon={<Box sx={{ fontSize: '1rem' }}>{mounted ? (normalizedLang === 'es' ? '🇪🇸' : '🇺🇸') : '🇺🇸'}</Box>}
            sx={{ 
              textTransform: 'none',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
              backgroundColor: !isDarkMode ? 'white' : undefined,
              color: isDarkMode ? 'white' : 'text.primary',
              boxShadow: !isDarkMode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
              },
            }}
          >
            {mounted ? (normalizedLang === 'es' ? 'ES' : 'EN') : 'EN'}
          </Button>
          <Button
            fullWidth
            size="small"
            variant={isDarkMode ? 'outlined' : 'contained'}
            onClick={toggleTheme}
            startIcon={isDarkMode ? <LightMode sx={{ fontSize: 18 }} /> : <DarkMode sx={{ fontSize: 18 }} />}
            sx={{ 
              textTransform: 'none',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : undefined,
              backgroundColor: !isDarkMode ? 'white' : undefined,
              color: isDarkMode ? 'white' : 'text.primary',
              boxShadow: !isDarkMode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
              },
            }}
          >
            {isDarkMode ? 'Claro' : 'Oscuro'}
          </Button>
        </Box>
        {isAuthenticated ? (
          <>
            <Button
              fullWidth
              component={Link}
              href="/academy/account"
              startIcon={<AccountCircle />}
              sx={{ 
                mb: 1,
                justifyContent: 'flex-start',
                color: isDarkMode ? 'white' : 'text.primary',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              }}
            >
              {t('navigation.profile')}
            </Button>
            <Button
              fullWidth
              onClick={handleLogout}
              variant="outlined"
              sx={{
                color: '#ef4444',
                borderColor: '#ef4444',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  borderColor: '#ef4444',
                },
              }}
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
              sx={{ 
                mb: 1,
                borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                color: isDarkMode ? 'white' : 'text.primary',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                },
              }}
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
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                  boxShadow: '0 6px 20px rgba(22, 163, 74, 0.4)',
                },
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
          top: { xs: 60, md: 66 }, // Updated: TopBar (32/36px) + Promotional Banner (~28/30px)
          backgroundColor: scrolled 
            ? (isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)')
            : (isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'),
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ 
          minHeight: { xs: '56px', md: '80px' }, 
          px: { xs: 2, md: 4 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* Logo */}
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Image
                src={isDarkMode 
            ? (settings?.branding?.logo_dark_url || "/assets/logos/day_trade_dak_white_logo.png")
            : (settings?.branding?.logo_light_url || "/assets/logos/day_trade_dak_black_logo.png")
          }
                alt={settings?.branding?.company_name || "DayTradeDak"}
                width={isMobile ? 120 : 180}
                height={isMobile ? 35 : 50}
                style={{ 
                  objectFit: 'contain'
                }}
              />
            </Box>
          </Link>

          {/* Desktop Navigation - Center */}
          {!isMobile ? renderDesktopMenu() : null}
          
          {/* Spacer for mobile to push menu to the right */}
          {isMobile && <Box sx={{ flexGrow: 1 }} />}

          {/* Right Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Language - Hidden on mobile */}
            {!isMobile && (
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
            )}

            {/* Theme Toggle - Hidden on mobile */}
            {!isMobile && (
              <IconButton
                size="small"
                onClick={toggleTheme}
                sx={{ color: isDarkMode ? 'white' : 'black', cursor: 'pointer' }}
              >
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            )}

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
                sx={{ 
                  color: isDarkMode ? 'white' : 'black', 
                  cursor: 'pointer',
                  ml: 1, // Add margin to create space from other elements
                }}
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