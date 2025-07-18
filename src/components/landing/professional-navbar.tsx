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
  Fade,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
} from '@mui/material';
import {
  KeyboardArrowDown,
  School,
  Groups,
  MenuBook,
  Psychology,
  ShowChart,
  LiveTv,
  AccountCircle,
  DarkMode,
  LightMode,
  Language,
  NotificationsOutlined,
  TrendingUp,
  CalendarToday,
  BarChart,
  AutoGraph,
  Star,
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/components/theme/theme-provider';

interface SubMenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
}

interface NavMenuItem {
  label: string;
  href?: string;
  submenu?: SubMenuItem[];
}

const navigationItems: NavMenuItem[] = [
  {
    label: 'Trading',
    submenu: [
      { 
        label: 'Live Trading Room', 
        href: '/live-trading',
        icon: <LiveTv />,
        description: 'Join live sessions with pro traders'
      },
      { 
        label: 'Market Analysis', 
        href: '/analysis',
        icon: <ShowChart />,
        description: 'Daily technical & fundamental analysis'
      },
      { 
        label: 'Trading Signals', 
        href: '/signals',
        icon: <TrendingUp />,
        description: 'Real-time buy/sell alerts'
      },
      { 
        label: 'Economic Calendar', 
        href: '/calendar',
        icon: <CalendarToday />,
        description: 'Important market events'
      },
    ],
  },
  {
    label: 'Education',
    submenu: [
      { 
        label: 'Trading Academy', 
        href: '/academy/live-sessions',
        icon: <School />,
        description: 'Comprehensive trading courses'
      },
      { 
        label: 'Master Classes', 
        href: '/academy/masterclass',
        icon: <Groups />,
        description: 'Elite trading masterclasses'
      },
      { 
        label: 'Trading Psychology', 
        href: '/academy/psicotrading',
        icon: <Psychology />,
        description: 'Master your trading mindset'
      },
      { 
        label: 'eBooks Library', 
        href: '/academy/books',
        icon: <MenuBook />,
        description: 'Trading books & resources'
      },
    ],
  },
  {
    label: 'Tools',
    submenu: [
      { 
        label: 'Stock Screener', 
        href: '/tools/screener',
        icon: <BarChart />,
        description: 'Find trading opportunities'
      },
      { 
        label: 'Position Calculator', 
        href: '/tools/calculator',
        icon: <AutoGraph />,
        description: 'Risk & position sizing'
      },
      { 
        label: 'Market Scanner', 
        href: '/academy/companies',
        icon: <ShowChart />,
        description: 'Real-time market data'
      },
    ],
  },
  {
    label: 'Live',
    href: '/live',
  },
  {
    label: 'Pricing',
    href: '/academy/subscription/plans',
  },
  {
    label: 'About',
    href: '/about',
  },
];

export function ProfessionalNavbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [menuAnchors, setMenuAnchors] = useState<Record<string, HTMLElement | null>>({});
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuOpen = (menuKey: string, event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchors({ ...menuAnchors, [menuKey]: event.currentTarget });
  };

  const handleMenuClose = (menuKey: string) => {
    setMenuAnchors({ ...menuAnchors, [menuKey]: null });
  };

  return (
    <AppBar
      position="fixed"
      elevation={scrolled ? 1 : 0}
      sx={{
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
        <Link href="/" passHref>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 6 }}>
            <Image
              src="/assets/logo.png"
              alt="DayTradeDak"
              width={180}
              height={50}
              style={{ 
                objectFit: 'contain',
                filter: isDarkMode ? 'none' : 'invert(1)'
              }}
            />
          </Box>
        </Link>

        {/* Navigation */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', lg: 'flex' }, gap: 1 }}>
          {navigationItems.map((item) => (
            <Box key={item.label}>
              {item.submenu ? (
                <>
                  <Button
                    onClick={(e) => handleMenuOpen(item.label, e)}
                    endIcon={<KeyboardArrowDown />}
                    sx={{
                      color: isDarkMode ? 'white' : 'black',
                      textTransform: 'none',
                      fontSize: '15px',
                      fontWeight: 500,
                      px: 2,
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                  <Menu
                    anchorEl={menuAnchors[item.label]}
                    open={Boolean(menuAnchors[item.label])}
                    onClose={() => handleMenuClose(item.label)}
                    TransitionComponent={Fade}
                    PaperProps={{
                      elevation: 8,
                      sx: {
                        mt: 1.5,
                        minWidth: 280,
                        backgroundColor: isDarkMode ? '#0a0a0a' : 'white',
                        border: '1px solid',
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    {item.submenu.map((subItem, index) => (
                      <React.Fragment key={subItem.label}>
                        <MenuItem
                          component={Link}
                          href={subItem.href}
                          onClick={() => handleMenuClose(item.label)}
                          sx={{
                            py: 2,
                            px: 3,
                            '&:hover': {
                              backgroundColor: isDarkMode ? 'rgba(22, 163, 74, 0.1)' : 'rgba(22, 163, 74, 0.05)',
                            },
                          }}
                        >
                          <ListItemIcon sx={{ color: '#16a34a' }}>
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={subItem.label}
                            secondary={subItem.description}
                            primaryTypographyProps={{
                              fontWeight: 600,
                              fontSize: '14px',
                            }}
                            secondaryTypographyProps={{
                              fontSize: '12px',
                              sx: { opacity: 0.7 },
                            }}
                          />
                        </MenuItem>
                        {index < item.submenu!.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </Menu>
                </>
              ) : (
                <Button
                  component={Link}
                  href={item.href}
                  sx={{
                    color: isDarkMode ? 'white' : 'black',
                    textTransform: 'none',
                    fontSize: '15px',
                    fontWeight: 500,
                    px: 2,
                    ...(item.label === 'Live' && {
                      color: '#ef4444',
                      position: 'relative',
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
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              )}
            </Box>
          ))}
        </Box>

        {/* Right Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <IconButton size="small" sx={{ color: isDarkMode ? 'white' : 'black' }}>
            <Badge badgeContent={3} color="error">
              <NotificationsOutlined />
            </Badge>
          </IconButton>

          {/* Language */}
          <IconButton
            size="small"
            onClick={(e) => handleMenuOpen('language', e)}
            sx={{ color: isDarkMode ? 'white' : 'black' }}
          >
            <Language />
          </IconButton>

          {/* Theme Toggle */}
          <IconButton
            size="small"
            onClick={toggleTheme}
            sx={{ color: isDarkMode ? 'white' : 'black' }}
          >
            {isDarkMode ? <LightMode /> : <DarkMode />}
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 30, alignSelf: 'center' }} />

          {/* Login */}
          <Button
            component={Link}
            href="/auth/sign-in"
            startIcon={<AccountCircle />}
            sx={{
              color: isDarkMode ? 'white' : 'black',
              textTransform: 'none',
            }}
          >
            Login
          </Button>

          {/* CTA Button */}
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
            Get Started
          </Button>
        </Box>
      </Toolbar>

      {/* Language Menu */}
      <Menu
        anchorEl={menuAnchors['language']}
        open={Boolean(menuAnchors['language'])}
        onClose={() => handleMenuClose('language')}
        PaperProps={{
          sx: {
            backgroundColor: isDarkMode ? '#0a0a0a' : 'white',
          },
        }}
      >
        <MenuItem onClick={() => handleMenuClose('language')}>
          English
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose('language')}>
          Español
        </MenuItem>
      </Menu>
    </AppBar>
  );
}