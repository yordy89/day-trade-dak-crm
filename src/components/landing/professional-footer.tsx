'use client';

import React from 'react';
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
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/components/theme/theme-provider';
import { useTranslation } from 'react-i18next';

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

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/daytradedak', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/daytradedak', label: 'Twitter' },
  { icon: LinkedIn, href: 'https://linkedin.com/company/daytradedak', label: 'LinkedIn' },
  { icon: YouTube, href: 'https://youtube.com/daytradedak', label: 'YouTube' },
  { icon: Instagram, href: 'https://instagram.com/daytradedak', label: 'Instagram' },
  { icon: Telegram, href: 'https://t.me/daytradedak', label: 'Telegram' },
];

export function ProfessionalFooter() {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation('landing');
  const footerLinks = getFooterLinks(t);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: isDarkMode ? '#000000' : '#f5f5f5',
        color: isDarkMode ? 'white' : '#333333',
        pt: 8,
        pb: 4,
        borderTop: '1px solid',
        borderColor: isDarkMode ? 'rgba(22, 163, 74, 0.2)' : 'rgba(22, 163, 74, 0.3)',
      }}
    >
      <Container maxWidth="lg">
        {/* Top Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Link href="/" passHref style={{ textDecoration: 'none' }}>
                <Image
                  src={isDarkMode ? "/assets/logos/day_trade_dak_white_logo.png" : "/assets/logos/day_trade_dak_black_logo.png"}
                  alt="DayTradeDak"
                  width={200}
                  height={60}
                  style={{ objectFit: 'contain' }}
                />
              </Link>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, opacity: isDarkMode ? 0.8 : 0.7, lineHeight: 1.8 }}>
              {t('footer.about.description')}
            </Typography>
            
            {/* Contact Info */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Phone fontSize="small" />
                <Typography variant="body2">{t('footer.contact.phone')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Email fontSize="small" />
                <Typography variant="body2">{t('footer.contact.email')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2">{t('footer.contact.address')}</Typography>
              </Box>
            </Box>

            {/* Social Links */}
            <Box sx={{ display: 'flex', gap: 0.5, mt: 3 }}>
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
                    <Icon fontSize="small" />
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
                }}
              >
                {section.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
            backgroundColor: isDarkMode ? 'rgba(22, 163, 74, 0.1)' : 'rgba(22, 163, 74, 0.05)',
            borderRadius: 2,
            p: 4,
            mb: 6,
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(22, 163, 74, 0.2)' : 'rgba(22, 163, 74, 0.1)',
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: isDarkMode ? 'white' : '#333333',
                      '& fieldset': {
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(22, 163, 74, 0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#16a34a',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: isDarkMode ? 'white' : '#333333',
                      '&::placeholder': {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                        opacity: 1,
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: 'white',
                    px: 3,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                    },
                  }}
                >
                  {t('footer.newsletter.button')}
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
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: isDarkMode ? 0.6 : 0.7, color: isDarkMode ? 'white' : '#333333' }}>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </Typography>
          
          <Typography variant="caption" sx={{ opacity: isDarkMode ? 0.5 : 0.6, color: isDarkMode ? 'white' : '#333333', maxWidth: 600, textAlign: 'center' }}>
            {t('footer.riskWarning')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}