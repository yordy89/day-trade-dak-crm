'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  Divider,
  Button,
  TextField,
  Skeleton,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  YouTube,
  Instagram,
  Telegram,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import { SiTiktok } from 'react-icons/si';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/components/theme/theme-provider';
import { useTranslation } from 'react-i18next';
import { useSettings, processCopyrightText } from '@/services/api/settings.service';

const getFooterLinks = (t: any) => ({
  trading: {
    title: t('footer.sections.trading.title'),
    links: [
      { label: t('footer.sections.trading.links.liveRoom'), href: '/live' },
      { label: t('footer.sections.trading.links.signals'), href: '/signals' },
      { label: t('footer.sections.trading.links.analysis'), href: '/analysis' },
      { label: t('footer.sections.trading.links.calendar'), href: '/calendar' },
      { label: t('footer.sections.trading.links.tools'), href: '/tools' },
    ],
  },
  education: {
    title: t('footer.sections.education.title'),
    links: [
      { label: t('footer.sections.education.links.academy'), href: '/academy/live-sessions' },
      { label: t('footer.sections.education.links.masterClasses'), href: '/academy/masterclass' },
      { label: t('footer.sections.education.links.psychology'), href: '/academy/psicotrading' },
      { label: t('footer.sections.education.links.library'), href: '/academy/books' },
      { label: t('footer.sections.education.links.webinars'), href: '/webinars' },
    ],
  },
  company: {
    title: t('footer.sections.company.title'),
    links: [
      { label: t('footer.sections.company.links.about'), href: '/about' },
      { label: t('footer.sections.company.links.success'), href: '/success-stories' },
      { label: t('footer.sections.company.links.careers'), href: '/careers' },
      { label: t('footer.sections.company.links.blog'), href: '/blog' },
      { label: t('footer.sections.company.links.contact'), href: '/contact' },
    ],
  },
  support: {
    title: t('footer.sections.support.title'),
    links: [
      { label: t('footer.sections.support.links.help'), href: '/help' },
      { label: t('footer.sections.support.links.faq'), href: '/faq' },
      { label: t('footer.sections.support.links.terms'), href: '/terms/terms-conditions#terms' },
      { label: t('footer.sections.support.links.privacy'), href: '/terms/terms-conditions#privacy' },
      { label: t('footer.sections.support.links.risk'), href: '/risk' },
    ],
  },
});

export function ProfessionalFooter() {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation('landing');
  const footerLinks = getFooterLinks(t);
  const { data: settings, isLoading } = useSettings();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSubscribe = async () => {
    if (!email?.includes('@')) {
      setSnackbar({
        open: true,
        message: t('footer.newsletter.errors.invalidEmail'),
        severity: 'error',
      });
      return;
    }

    setIsSubscribing(true);
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: t('footer.newsletter.success'),
          severity: 'success',
        });
        setEmail('');
      } else {
        setSnackbar({
          open: true,
          message: data.message || t('footer.newsletter.errors.generic'),
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: t('footer.newsletter.errors.generic'),
        severity: 'error',
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Build social links from settings
  const socialLinks = React.useMemo(() => {
    if (!settings?.social_media) {
      return [
        { icon: Facebook, href: 'https://facebook.com/daytradedak', label: 'Facebook', key: 'facebook_url' },
        { icon: Twitter, href: 'https://twitter.com/daytradedak', label: 'Twitter', key: 'twitter_url' },
        { icon: LinkedIn, href: 'https://linkedin.com/company/daytradedak', label: 'LinkedIn', key: 'linkedin_url' },
        { icon: YouTube, href: 'https://youtube.com/daytradedak', label: 'YouTube', key: 'youtube_url' },
        { icon: Instagram, href: 'https://instagram.com/daytradedak', label: 'Instagram', key: 'instagram_url' },
        { icon: Telegram, href: 'https://t.me/daytradedak', label: 'Telegram', key: 'telegram_url' },
        { icon: SiTiktok, href: 'https://www.tiktok.com/@daytradedak', label: 'TikTok', key: 'tiktok_url', isCustomIcon: true },
      ];
    }

    const links = [];
    const socialMedia = settings.social_media;
    
    if (socialMedia.facebook_url) {
      links.push({ icon: Facebook, href: socialMedia.facebook_url, label: 'Facebook' });
    }
    if (socialMedia.twitter_url) {
      links.push({ icon: Twitter, href: socialMedia.twitter_url, label: 'Twitter' });
    }
    if (socialMedia.linkedin_url) {
      links.push({ icon: LinkedIn, href: socialMedia.linkedin_url, label: 'LinkedIn' });
    }
    if (socialMedia.youtube_url) {
      links.push({ icon: YouTube, href: socialMedia.youtube_url, label: 'YouTube' });
    }
    if (socialMedia.instagram_url) {
      links.push({ icon: Instagram, href: socialMedia.instagram_url, label: 'Instagram' });
    }
    if (socialMedia.telegram_url) {
      links.push({ icon: Telegram, href: socialMedia.telegram_url, label: 'Telegram' });
    }
    if (socialMedia.tiktok_url) {
      links.push({ icon: SiTiktok, href: socialMedia.tiktok_url, label: 'TikTok', isCustomIcon: true });
    }
    
    return links;
  }, [settings]);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: isDarkMode ? '#000000' : '#f5f5f5',
        color: isDarkMode ? 'white' : '#333333',
        pt: 8,
        pb: 4,
        mt: { xs: 8, sm: 10, md: 12 },
        borderTop: '1px solid',
        borderColor: isDarkMode ? 'rgba(22, 163, 74, 0.2)' : 'rgba(22, 163, 74, 0.3)',
      }}
    >
      <Container maxWidth="lg">
        {/* Top Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3, textAlign: { xs: 'center', md: 'left' } }}>
              <Link href="/" passHref style={{ textDecoration: 'none' }}>
                {isLoading ? (
                  <Skeleton variant="rectangular" width={200} height={60} />
                ) : (
                  <Image
                    src={isDarkMode 
                      ? (settings?.branding?.logo_dark_url || "/assets/logos/day_trade_dak_white_logo.png")
                      : (settings?.branding?.logo_light_url || "/assets/logos/day_trade_dak_black_logo.png")
                    }
                    alt={settings?.branding?.company_name || "DayTradeDak"}
                    width={200}
                    height={60}
                    style={{ objectFit: 'contain' }}
                  />
                )}
              </Link>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, opacity: isDarkMode ? 0.8 : 0.7, lineHeight: 1.8, textAlign: { xs: 'center', md: 'left' } }}>
              {settings?.footer?.footer_company_description || t('footer.about.description')}
            </Typography>
            
            {/* Contact Info */}
            <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Phone fontSize="small" />
                <Typography variant="body2">
                  {settings?.contact?.contact_phone || t('footer.contact.phone')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Email fontSize="small" />
                <Typography variant="body2">
                  {settings?.contact?.contact_email || t('footer.contact.email')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2">
                  {settings?.contact?.contact_address || t('footer.contact.address')}
                </Typography>
              </Box>
            </Box>

            {/* Social Links */}
            <Box sx={{ display: 'flex', gap: 0.5, mt: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <IconButton
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      color: isDarkMode ? 'white' : '#333333',
                      opacity: isDarkMode ? 0.8 : 0.7,
                      '&:hover': {
                        opacity: 1,
                        backgroundColor: 'rgba(22, 163, 74, 0.1)',
                        color: '#16a34a',
                      },
                    }}
                  >
                    {social.isCustomIcon ? (
                      <Icon size={18} />
                    ) : (
                      <Icon fontSize="small" />
                    )}
                  </IconButton>
                );
              })}
            </Box>
          </Grid>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <Grid item xs={6} sm={3} md={2} key={key}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: isDarkMode ? 'white' : '#333333',
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                {section.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: { xs: 'center', md: 'flex-start' } }}>
                {section.links.map((link) => (
                  <MuiLink
                    key={link.label}
                    component={Link}
                    href={link.href}
                    variant="body2"
                    sx={{
                      color: isDarkMode ? 'white' : '#333333',
                      opacity: isDarkMode ? 0.8 : 0.7,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        opacity: 1,
                        color: '#16a34a',
                      },
                    }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Newsletter */}
        <Box
          sx={{
            backgroundColor: isDarkMode ? 'rgba(22, 163, 74, 0.08)' : 'rgba(22, 163, 74, 0.05)',
            borderRadius: 2,
            p: 4,
            mb: 6,
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(22, 163, 74, 0.3)' : 'rgba(22, 163, 74, 0.1)',
            boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? 'white' : '#333333' }}>
                {t('footer.newsletter.title')}
              </Typography>
              <Typography variant="body2" sx={{ opacity: isDarkMode ? 0.8 : 0.7, color: isDarkMode ? 'white' : '#333333' }}>
                {t('footer.newsletter.subtitle')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  placeholder={t('footer.newsletter.placeholder')}
                  variant="outlined"
                  size="small"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !isSubscribing) {
                      handleSubscribe();
                    }
                  }}
                  disabled={isSubscribing}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: isDarkMode ? '#000000' : '#333333',
                      backgroundColor: '#ffffff !important',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                        borderWidth: '1px',
                      },
                      '&:hover': {
                        backgroundColor: '#ffffff !important',
                        '& fieldset': {
                          borderColor: '#16a34a',
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#ffffff !important',
                        '& fieldset': {
                          borderColor: '#16a34a !important',
                          borderWidth: '2px',
                        },
                      },
                      '&.Mui-disabled': {
                        opacity: 0.6,
                        backgroundColor: '#f5f5f5 !important',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#000000 !important',
                      fontSize: '14px',
                      fontWeight: 400,
                      padding: '12px 14px',
                      backgroundColor: 'transparent !important',
                      '&::placeholder': {
                        color: 'rgba(0, 0, 0, 0.6) !important',
                        opacity: '1 !important',
                      },
                      // Force autofill styles
                      '&:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                        WebkitTextFillColor: '#000000 !important',
                        caretColor: '#000000 !important',
                      },
                      '&:-webkit-autofill:hover': {
                        WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                        WebkitTextFillColor: '#000000 !important',
                        caretColor: '#000000 !important',
                      },
                      '&:-webkit-autofill:focus': {
                        WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                        WebkitTextFillColor: '#000000 !important',
                        caretColor: '#000000 !important',
                      },
                      '&:-webkit-autofill:active': {
                        WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
                        WebkitTextFillColor: '#000000 !important',
                        caretColor: '#000000 !important',
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                  sx={{
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: 'white',
                    px: 3,
                    py: 1.5,
                    minWidth: 120,
                    height: '48px',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                    },
                    '&.Mui-disabled': {
                      opacity: 0.7,
                      boxShadow: 'none',
                    },
                  }}
                >
                  {isSubscribing ? (
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                  ) : (
                    t('footer.newsletter.button')
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', mb: 4 }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', md: 'space-between' },
            alignItems: 'center',
            gap: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ opacity: isDarkMode ? 0.6 : 0.7, color: isDarkMode ? 'white' : '#333333', width: { xs: '100%', md: 'auto' }, textAlign: { xs: 'center', md: 'left' } }}>
            {processCopyrightText(settings?.footer?.footer_copyright_text || t('footer.copyright', { year: new Date().getFullYear() }))}
          </Typography>
          
          <Typography variant="caption" sx={{ opacity: isDarkMode ? 0.5 : 0.6, color: isDarkMode ? 'white' : '#333333', maxWidth: 600, textAlign: 'center' }}>
            {t('footer.riskWarning')}
          </Typography>
        </Box>
      </Container>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}