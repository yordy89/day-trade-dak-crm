'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { Button, Card, List, ListItem, ListItemIcon, ListItemText, useTheme, alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { 
  TrendingUp, 
  ShowChart, 
  Assessment, 
  School,
  MenuBook,
  Groups,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import { MainNavbar } from '@/components/landing/main-navbar';
import { ProfessionalFooter } from '@/components/landing/professional-footer';

export interface LayoutProps {
  children: React.ReactNode;
}


export function Layout({ children }: LayoutProps): React.JSX.Element {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const { t } = useTranslation();

  const features = [
    { 
      icon: <Groups />, 
      text: t('auth.layout.features.mentorship.title'), 
      subtext: t('auth.layout.features.mentorship.subtitle') 
    },
    { 
      icon: <School />, 
      text: t('auth.layout.features.classes.title'), 
      subtext: t('auth.layout.features.classes.subtitle') 
    },
    { 
      icon: <MenuBook />, 
      text: t('auth.layout.features.library.title'), 
      subtext: t('auth.layout.features.library.subtitle') 
    },
    { 
      icon: <TrendingUp />, 
      text: t('auth.layout.features.earnings.title'), 
      subtext: t('auth.layout.features.earnings.subtitle') 
    },
    { 
      icon: <ShowChart />, 
      text: t('auth.layout.features.marketData.title'), 
      subtext: t('auth.layout.features.marketData.subtitle') 
    },
    { 
      icon: <Assessment />, 
      text: t('auth.layout.features.psychology.title'), 
      subtext: t('auth.layout.features.psychology.subtitle') 
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: isDarkMode 
          ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
          : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, ${alpha(theme.palette.info.main, 0.1)} 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        },
      }}
    >
      {/* Main Navigation - Same as other pages */}
      <MainNavbar />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          px: 3,
          pt: 18, // Account for TopBar (36px) + Navbar (80px)
          pb: 6,
          gap: { xs: 6, lg: 10 },
          position: 'relative',
          zIndex: 5,
        }}
      >
        {/* Form Section */}
        <Card
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            width: { xs: '100%', sm: '450px', md: '500px' },
            maxWidth: '500px',
            background: isDarkMode
              ? 'rgba(20, 20, 20, 0.9)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: 1,
            borderColor: 'divider',
            borderRadius: 3,
            boxShadow: isDarkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box sx={{ width: '100%' }}>{children}</Box>
        </Card>

        {/* Features Section */}
        <Box 
          sx={{ 
            display: { xs: 'none', lg: 'block' },
            maxWidth: '600px',
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {t('auth.layout.startJourney.title')}
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ mb: 4 }}
          >
            {t('auth.layout.startJourney.subtitle')}
          </Typography>
          
          <List sx={{ p: 0 }}>
            {features.map((feature, _index) => (
              <ListItem 
                key={feature.text} 
                sx={{ 
                  px: 0,
                  py: 2,
                  alignItems: 'flex-start',
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 48,
                    mt: 0.5,
                    color: 'primary.main',
                  }}
                >
                  {feature.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="subtitle1" fontWeight={600}>
                      {feature.text}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {feature.subtext}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 6, p: 3, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
              {t('auth.layout.upcomingEvent.label')}
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              {t('auth.layout.upcomingEvent.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              📍 {t('auth.layout.upcomingEvent.location')} | 📅 {t('auth.layout.upcomingEvent.date')}
            </Typography>
            <Button
              variant="outlined"
              component={RouterLink}
              href="/events/680fe27154c9b64e54e2424f"
              fullWidth
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              {t('auth.layout.upcomingEvent.learnMore')}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Footer - Use the same professional footer as other pages */}
      <ProfessionalFooter />
    </Box>
  );
}
