'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, useMediaQuery, useTheme as useMuiTheme, Stack, alpha } from '@mui/material';
import MuiLink from '@mui/material/Link';
import Link from 'next/link';
import { 
  Email, 
  Phone, 
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  TrendingUp,
  TrendingDown,
  AccessTime,
  LocalOffer
} from '@mui/icons-material';
import { SiTiktok } from 'react-icons/si';
import { useTheme } from '@/components/theme/theme-provider';
import { useSettings } from '@/services/api/settings.service';
import { useTranslation } from 'react-i18next';

export function TopBar() {
  const { isDarkMode } = useTheme();
  const muiTheme = useMuiTheme();
  const { data: settings } = useSettings();
  const { t } = useTranslation('common');
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketStatus, setMarketStatus] = useState<{ status: string; color: string }>({ 
    status: 'market.closed', 
    color: '#ef4444' 
  });
  const [marketData] = useState({
    index: 'DAK Index',
    value: 247.83,
    change: 1.91,
    changePercent: 0.78,
    isPositive: true
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Determine market status based on ET time
      const isDST = () => {
        const month = now.getUTCMonth();
        return month >= 2 && month <= 10; // Approximate DST period (March-November)
      };
      
      const etOffset = isDST() ? 4 : 5;
      let etHours = now.getUTCHours() - etOffset;
      const minutes = now.getUTCMinutes();
      let etDay = now.getUTCDay();
      
      // Adjust day if we crossed midnight
      if (etHours < 0) {
        etHours += 24;
        etDay = (etDay - 1 + 7) % 7;
      }
      
      const time = etHours * 100 + minutes;
      
      // Determine market status with professional color scheme
      let status = { status: 'topBar.closed', color: '#ef4444' }; // Red for closed
      
      if (etDay === 0 || etDay === 6) {
        // Weekend - Market Closed
        status = { status: 'topBar.closed', color: '#ef4444' }; // Red
      } else if (time >= 930 && time < 1600) {
        // Regular Trading Hours
        status = { status: 'topBar.open', color: '#16a34a' }; // Green
      } else if (time >= 400 && time < 930) {
        // Pre-Market
        status = { status: 'topBar.preMarket', color: '#fbbf24' }; // Amber/Yellow
      } else if (time >= 1600 && time < 2000) {
        // After-Hours
        status = { status: 'topBar.afterHours', color: '#fbbf24' }; // Amber/Yellow
      }
      
      setMarketStatus(status);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    }) + ' EST';
  };

  const socialLinks = React.useMemo(() => {
    const links = [];
    const socialMedia = settings?.social_media;
    
    if (!socialMedia) {
      // Fallback to default links
      return [
        { icon: <Facebook sx={{ fontSize: 14 }} />, href: 'https://facebook.com/daytradedk', label: 'Facebook' },
        { icon: <Twitter sx={{ fontSize: 14 }} />, href: 'https://twitter.com/daytradedk', label: 'Twitter' },
        { icon: <Instagram sx={{ fontSize: 14 }} />, href: 'https://instagram.com/daytradedk', label: 'Instagram' },
        { icon: <LinkedIn sx={{ fontSize: 14 }} />, href: 'https://linkedin.com/company/daytradedk', label: 'LinkedIn' },
        { icon: <YouTube sx={{ fontSize: 14 }} />, href: 'https://youtube.com/@daytradedk', label: 'YouTube' },
        { icon: <SiTiktok size={14} />, href: 'https://www.tiktok.com/@daytradedk', label: 'TikTok' },
      ];
    }
    
    if (socialMedia.facebook_url) {
      links.push({ icon: <Facebook sx={{ fontSize: 14 }} />, href: socialMedia.facebook_url, label: 'Facebook' });
    }
    if (socialMedia.twitter_url) {
      links.push({ icon: <Twitter sx={{ fontSize: 14 }} />, href: socialMedia.twitter_url, label: 'Twitter' });
    }
    if (socialMedia.instagram_url) {
      links.push({ icon: <Instagram sx={{ fontSize: 14 }} />, href: socialMedia.instagram_url, label: 'Instagram' });
    }
    if (socialMedia.linkedin_url) {
      links.push({ icon: <LinkedIn sx={{ fontSize: 14 }} />, href: socialMedia.linkedin_url, label: 'LinkedIn' });
    }
    if (socialMedia.youtube_url) {
      links.push({ icon: <YouTube sx={{ fontSize: 14 }} />, href: socialMedia.youtube_url, label: 'YouTube' });
    }
    if (socialMedia.tiktok_url) {
      links.push({ icon: <SiTiktok size={14} />, href: socialMedia.tiktok_url, label: 'TikTok' });
    }
    
    return links;
  }, [settings]);

  // Mobile version - simplified
  if (isMobile) {
    return (
      <Box sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1400,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}>
        {/* Original TopBar Content - Mobile */}
        <Box
          sx={{
            backgroundColor: '#0a0a0a',
            color: 'rgba(255, 255, 255, 0.8)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.7rem',
            minHeight: 36,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Container maxWidth={false}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 36,
              py: 0.5,
              px: 1,
            }}
          >
            {/* Left - Market Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
              }}>
                <Box sx={{ 
                  width: 5, 
                  height: 5, 
                  borderRadius: '50%',
                  backgroundColor: marketStatus.color,
                  animation: marketStatus.status === 'topBar.open' ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                }} />
                <Typography variant="caption" sx={{ 
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  {t('topBar.market')}: {t(marketStatus.status)}
                </Typography>
              </Box>

              {/* Market Data - with separator */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                pl: 1,
                borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
              }}>
                <Typography variant="caption" sx={{ 
                  fontSize: '0.65rem',
                  opacity: 0.7,
                }}>
                  DAK:
                </Typography>
                <Typography variant="caption" sx={{ 
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}>
                  ${marketData.value.toFixed(0)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: marketData.isPositive ? '#10b981' : '#ef4444',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                  }}
                >
                  {marketData.isPositive ? '+' : ''}{marketData.changePercent}%
                </Typography>
              </Box>
            </Box>

            {/* Right - Removed Live Button for cleaner mobile view */}
          </Box>
        </Container>
      </Box>
      </Box>
    );
  }

  // Desktop version - full featured
  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1400 }}>
      {/* Original TopBar Content */}
      <Box
        sx={{
          backgroundColor: '#0a0a0a',
          color: 'rgba(255, 255, 255, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.75rem',
          height: 36,
        }}
      >
        <Container maxWidth={false}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 36,
            px: 2,
          }}
        >
          {/* Left Section - Market Status and Contact */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Market Status Indicator */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
            }}>
              <Box sx={{ 
                width: 6, 
                height: 6, 
                borderRadius: '50%',
                backgroundColor: marketStatus.color,
                animation: marketStatus.status === 'topBar.open' ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }} />
              <Typography variant="caption" sx={{ 
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {t(marketStatus.status)}
              </Typography>
            </Box>

            {/* Market Index */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              px: 1.5,
              borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
              borderRight: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <Typography variant="caption" sx={{ 
                fontSize: '0.7rem',
                opacity: 0.7,
              }}>
                {marketData.index}:
              </Typography>
              <Typography variant="caption" sx={{ 
                fontSize: '0.75rem',
                fontWeight: 600,
              }}>
                ${marketData.value.toFixed(2)}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.25,
              }}>
                {marketData.isPositive ? (
                  <TrendingUp sx={{ fontSize: 12, color: '#10b981' }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 12, color: '#ef4444' }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: marketData.isPositive ? '#10b981' : '#ef4444',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                  }}
                >
                  {marketData.isPositive ? '+' : ''}{marketData.change} ({marketData.changePercent}%)
                </Typography>
              </Box>
            </Box>

            {/* Live Updates Button */}
            <Link href="/live" style={{ textDecoration: 'none' }}>
              <Button
                size="small"
                sx={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  px: 1.5,
                  py: 0.5,
                  minHeight: 'auto',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#059669',
                  },
                }}
              >
                Actualizaciones en Vivo
              </Button>
            </Link>
          </Box>

          {/* Center Section - Social Media Icons */}
          <Box sx={{ 
            display: { xs: 'none', lg: 'flex' }, 
            alignItems: 'center', 
            gap: 1,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}>
            {socialLinks.map((social) => (
              <MuiLink
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  '&:hover': {
                    color: 'white',
                    transform: 'translateY(-2px)',
                  },
                }}
                aria-label={social.label}
              >
                {social.icon}
              </MuiLink>
            ))}
          </Box>

          {/* Right Section - Contact Info and Time */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Email */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center', 
              gap: 0.5,
            }}>
              <Email sx={{ fontSize: 12, opacity: 0.5 }} />
              <MuiLink
                href={`mailto:${settings?.contact?.contact_email || 'support@daytradedak.com'}`}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.7rem',
                  '&:hover': {
                    color: 'white',
                    textDecoration: 'underline',
                  },
                }}
              >
                {settings?.contact?.contact_email || 'support@daytradedak.com'}
              </MuiLink>
            </Box>

            {/* Phone */}
            <Box sx={{ 
              display: { xs: 'none', lg: 'flex' }, 
              alignItems: 'center', 
              gap: 0.5,
              px: 2,
              borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
              borderRight: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <Phone sx={{ fontSize: 12, opacity: 0.5 }} />
              <MuiLink
                href={`tel:${settings?.contact?.contact_phone?.replace(/[^0-9+]/g, '') || '+17863551346'}`}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                {settings?.contact?.contact_phone || '+1 (786) 355-1346'}
              </MuiLink>
            </Box>

            {/* Current Time */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime sx={{ fontSize: 12, opacity: 0.5 }} />
              <Typography variant="caption" sx={{ 
                fontSize: '0.7rem',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.7)',
              }}>
                {formatTime(currentTime)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
    </Box>
  );
}