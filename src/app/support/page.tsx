'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';
import { EnvelopeSimple, Phone, WhatsappLogo, Globe, ArrowLeft } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { MainNavbar } from '@/components/landing/main-navbar';
import { ProfessionalFooter } from '@/components/landing/professional-footer';

export default function SupportPage() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation(['common', 'masterCourse']);

  const contactMethods = [
    {
      icon: <EnvelopeSimple size={32} weight="fill" />,
      title: 'Email',
      value: 'support@daytradedak.com',
      action: () => window.location.href = 'mailto:support@daytradedak.com',
      color: theme.palette.primary.main,
    },
    {
      icon: <Phone size={32} weight="fill" />,
      title: t('masterCourse:support.phone'),
      value: '786.356.7260',
      action: () => window.location.href = 'tel:+17863567260',
      color: theme.palette.success.main,
    },
    {
      icon: <WhatsappLogo size={32} weight="fill" />,
      title: 'WhatsApp',
      value: t('masterCourse:support.whatsapp'),
      action: () => window.open('https://wa.me/17863567260', '_blank'),
      color: '#25D366',
    },
    {
      icon: <Globe size={32} weight="fill" />,
      title: t('masterCourse:support.web'),
      value: 'www.DayTradeDAK.com',
      action: () => window.open('https://www.daytradedak.com', '_blank'),
      color: theme.palette.info.main,
    },
  ];

  return (
    <>
      <MainNavbar />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 10 }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          {/* Header */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h2" fontWeight={800} gutterBottom>
              {t('masterCourse:support.title', 'Contact Support')}
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              We're here to help you succeed
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Have questions about our platform, need help with configuration, or want to learn about our services?
              Our support team is ready to assist you.
            </Typography>
          </Box>

          {/* Contact Methods */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {contactMethods.map((method, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: `1px solid ${alpha(method.color, 0.1)}`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 8px 24px ${alpha(method.color, 0.2)}`,
                      border: `1px solid ${alpha(method.color, 0.3)}`,
                    },
                  }}
                  onClick={method.action}
                >
                  <CardContent>
                    <Stack spacing={2} alignItems="center" textAlign="center">
                      <Box sx={{ color: method.color }}>
                        {method.icon}
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        {method.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {method.value}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Support Hours */}
          <Card
            sx={{
              mb: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(
                theme.palette.info.main,
                0.1
              )} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Support Hours
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monday - Friday: 9:00 AM - 6:00 PM EST
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Saturday: 10:00 AM - 4:00 PM EST
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sunday: Closed
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                For urgent matters outside business hours, please email us and we'll respond as soon as possible.
              </Typography>
            </CardContent>
          </Card>

          {/* Back Button */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              startIcon={<ArrowLeft size={20} />}
              onClick={() => router.back()}
              variant="outlined"
              size="large"
            >
              {t('common.back', 'Go Back')}
            </Button>
          </Box>
        </Container>
      </Box>
      <ProfessionalFooter />
    </>
  );
}
