'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Chip } from '@mui/material';
import Link from 'next/link';
import MuiLink from '@mui/material/Link';
import { 
  Email, 
  Phone, 
  AccessTime,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { SiTiktok } from 'react-icons/si';
import { useTheme } from '@/components/theme/theme-provider';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/services/api/settings.service';

export function TopBar() {
  const _theme = useTheme();
  const { t } = useTranslation();
  const { data: settings } = useSettings();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketOpen, setMarketOpen] = useState(false);
  const [marketData] = useState({
    index: 'DAK Index',
    value: 247.83,
    change: 1.91,
    changePercent: 0.78
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Check if market is open (9:30 AM - 4:00 PM EST)
      const hours = now.getUTCHours() - 5; // Convert to EST
      const minutes = now.getUTCMinutes();
      const time = hours * 100 + minutes;
      setMarketOpen(time >= 930 && time < 1600 && now.getDay() > 0 && now.getDay() < 6);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return `${date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    })} EST`;
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

  return (
    <Box
        sx={{
          backgroundColor: '#0a0a0a',
          color: 'white',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.8rem',
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
            {/* Left Section - Market Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Market Status */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                pr: 2,
              }}>
                <Box sx={{ 
                  width: 6, 
                  height: 6, 
                  borderRadius: '50%',
                  backgroundColor: marketOpen ? '#10b981' : '#ef4444',
                  animation: marketOpen ? 'pulse 2s infinite' : 'none',
                }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('topBar.market')}: {marketOpen ? t('topBar.open') : t('topBar.closed')}
                </Typography>
              </Box>

              {/* Market Index */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                pr: 2,
              }}>
                <Typography variant="caption" sx={{ 
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.75rem',
                }}>
                  {marketData.index}:
                </Typography>
                <Typography variant="caption" sx={{ 
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}>
                  ${marketData.value.toFixed(2)}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.25,
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 0.5,
                  backgroundColor: marketData.change > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                }}>
                  {marketData.change > 0 ? (
                    <TrendingUp sx={{ fontSize: 12, color: '#10b981' }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 12, color: '#ef4444' }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: marketData.change > 0 ? '#10b981' : '#ef4444',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  >
                    {marketData.change > 0 ? '+' : ''}{marketData.change.toFixed(2)} ({marketData.changePercent.toFixed(2)}%)
                  </Typography>
                </Box>
              </Box>

              {/* Live Updates Button */}
              <Link href="/live" style={{ textDecoration: 'none' }}>
                <Chip
                  label={t('topBar.liveUpdates')}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    backgroundColor: '#10b981',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#059669',
                    },
                    cursor: 'pointer',
                    '& .MuiChip-label': {
                      px: 1.5,
                    },
                  }}
                />
              </Link>
            </Box>

            {/* Center Section - Social Media */}
            <Box sx={{ 
              display: { xs: 'none', lg: 'flex' }, 
              alignItems: 'center', 
              gap: 0,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}>
              {socialLinks.map((social, index) => (
                <React.Fragment key={social.label}>
                  <MuiLink
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      p: 0.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </MuiLink>
                  {index < socialLinks.length - 1 && (
                    <Box sx={{ 
                      width: '1px', 
                      height: 14, 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      mx: 0.5,
                    }} />
                  )}
                </React.Fragment>
              ))}
            </Box>

            {/* Right Section - Contact Info and Time */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {/* Email */}
              <Box sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                alignItems: 'center', 
                gap: 0.5,
                borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                pr: 2,
                mr: 2,
              }}>
                <Email sx={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.5)' }} />
                <MuiLink
                  href={`mailto:${settings?.contact?.contact_email || 'support@daytradedk.com'}`}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: 'white',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {settings?.contact?.contact_email || 'support@daytradedk.com'}
                </MuiLink>
              </Box>

              {/* Phone */}
              <Box sx={{ 
                display: { xs: 'none', lg: 'flex' }, 
                alignItems: 'center', 
                gap: 0.5,
                borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                pr: 2,
                mr: 2,
              }}>
                <Phone sx={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.5)' }} />
                <MuiLink
                  href={`tel:${settings?.contact?.contact_phone?.replace(/[^0-9+]/g, '') || '+17274861603'}`}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
                >
                  {settings?.contact?.contact_phone || '+1 (727) 486 1603'}
                </MuiLink>
              </Box>

              {/* Current Time */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTime sx={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.5)' }} />
                <Typography variant="caption" sx={{ 
                  fontSize: '0.75rem',
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
  );
}