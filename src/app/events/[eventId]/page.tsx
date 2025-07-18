'use client';

import React, { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { 
  Box, 
  Button, 
  Container, 
  Fade, 
  Grid, 
  Paper, 
  Stack, 
  Typography,
  Chip,
  Card,
  CardContent,
  useTheme as useMuiTheme,
  alpha,
  Divider,
  IconButton,
} from '@mui/material';
import { 
  CheckCircle, 
  Cancel,
  CalendarMonth,
  Schedule,
  LocationOn,
  ArrowBack,
  Star,
  EmojiEvents,
  Groups,
  MenuBook,
  PhotoCamera,
  School,
  Psychology,
  Celebration,
  LocalOffer,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/theme/theme-provider';

import { MainNavbar } from '@/components/landing/main-navbar';
import API from '@/lib/axios';
import GoogleMap from '@/components/common/GoogleMap';
import EventRegistrationForm from '../components/event-registration-form';
import VipRegistrationForm from '../components/vip-registration-form';

// IWM Stock Market Animation
const IWMTicker = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <Box
    sx={{
      position: 'fixed',
      top: '120px',
      left: 0,
      right: 0,
      height: '40px',
      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <Box
      sx={{
        display: 'flex',
        animation: 'scrollTicker 25s linear infinite',
        '@keyframes scrollTicker': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      }}
    >
      {[...Array(2)].map((_, setIndex) => (
        <Box key={setIndex} sx={{ display: 'flex', alignItems: 'center' }}>
          {[
            { symbol: 'IWM', price: 223.45, change: 2.34, volume: '45.2M' },
            { symbol: 'SPY', price: 512.67, change: -0.89, volume: '78.5M' },
            { symbol: 'QQQ', price: 425.12, change: 1.23, volume: '52.3M' },
            { symbol: 'DIA', price: 389.78, change: 0.45, volume: '12.8M' },
            { symbol: 'IWM', price: 223.45, change: 2.34, volume: '45.2M' },
          ].map((stock, i) => (
            <Box
              key={`${setIndex}-${i}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mx: 4,
                minWidth: 'max-content',
                ...(stock.symbol === 'IWM' && {
                  backgroundColor: alpha('#16a34a', 0.1),
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: alpha('#16a34a', 0.3),
                }),
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: stock.symbol === 'IWM' ? 700 : 600,
                  mr: 1,
                  color: stock.symbol === 'IWM' ? '#16a34a' : 'text.primary',
                }}
              >
                {stock.symbol}
              </Typography>
              <Typography variant="body2" sx={{ mr: 1.5 }}>
                ${stock.price}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: stock.change > 0 ? '#16a34a' : '#ef4444',
                  fontWeight: 500,
                  mr: 1,
                }}
              >
                {stock.change > 0 ? '+' : ''}{stock.change}%
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Vol: {stock.volume}
              </Typography>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  </Box>
);

// Trading Chart Background
const TradingChartBg = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: '600px',
      height: '400px',
      opacity: isDarkMode ? 0.05 : 0.03,
      pointerEvents: 'none',
      overflow: 'hidden',
    }}
  >
    <svg width="600" height="400" viewBox="0 0 600 400">
      {/* IWM Chart Focus */}
      <text x="20" y="30" fill="#16a34a" fontSize="24" fontWeight="bold" opacity="0.8">
        IWM
      </text>
      
      {/* Candlesticks */}
      {[...Array(30)].map((_, i) => {
        const x = i * 20;
        const height = Math.random() * 60 + 30;
        const y = 200 - height / 2 + (Math.random() - 0.5) * 80;
        const wickHeight = height + Math.random() * 20;
        const isGreen = Math.random() > 0.4; // Bias towards green for bullish sentiment
        
        return (
          <g key={i}>
            <line
              x1={x + 10}
              y1={y - (wickHeight - height) / 2}
              x2={x + 10}
              y2={y + height + (wickHeight - height) / 2}
              stroke={isGreen ? '#16a34a' : '#ef4444'}
              strokeWidth="1"
            />
            <rect
              x={x + 5}
              y={y}
              width="10"
              height={height}
              fill={isGreen ? '#16a34a' : '#ef4444'}
              opacity="0.8"
            />
          </g>
        );
      })}
      
      {/* Trend Line */}
      <path
        d="M 0 250 Q 150 200 300 150 T 600 100"
        stroke="#16a34a"
        strokeWidth="3"
        fill="none"
        strokeDasharray="5,5"
        opacity="0.8"
      />
      
      {/* Support/Resistance Lines */}
      <line x1="0" y1="180" x2="600" y2="180" stroke="#eab308" strokeWidth="1" strokeDasharray="10,5" opacity="0.5" />
      <line x1="0" y1="220" x2="600" y2="220" stroke="#ef4444" strokeWidth="1" strokeDasharray="10,5" opacity="0.5" />
    </svg>
  </Box>
);

export default function EventPage() {
  const params = useParams<{ eventId: string }>();
  const searchParams = useSearchParams();
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t, i18n } = useTranslation();
  
  const promoCode = searchParams.get('promo') || undefined;
  const [registrationType, setRegistrationType] = useState<'free' | 'vip' | null>(promoCode ? 'vip' : null);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event-details', params.eventId],
    queryFn: async () => {
      const res = await API.get(`/events/${params.eventId}`);
      return res.data;
    },
    enabled: Boolean(params.eventId),
  });

  if (isLoading) {
    return (
      <>
        <MainNavbar />
        <Box sx={{ pt: 18, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <MainNavbar />
        <Box sx={{ pt: 18, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography>Event not found</Typography>
        </Box>
      </>
    );
  }

  const benefits = [
    { 
      feature: i18n.language === 'es' ? 'Acceso al evento completo (10 AM - 2 PM)' : 'Full event access (10 AM - 2 PM)', 
      free: true, 
      vip: true,
      icon: <Groups /> 
    },
    { 
      feature: i18n.language === 'es' ? 'Sesión VIP "Inversor con Propósito" (8:30 AM - 10 AM)' : 'VIP Session "Investor with Purpose" (8:30 AM - 10 AM)', 
      free: false, 
      vip: true,
      icon: <Star />
    },
    { 
      feature: i18n.language === 'es' ? 'Libro físico firmado por el Mentor' : 'Signed physical book by the Mentor', 
      free: false, 
      vip: true,
      icon: <MenuBook />
    },
    { 
      feature: i18n.language === 'es' ? 'Charla privada: Cómo piensa un mentor real' : 'Private talk: How a real mentor thinks', 
      free: false, 
      vip: true,
      icon: <Psychology />
    },
    { 
      feature: i18n.language === 'es' ? 'Foto privada con fondo VIP del evento' : 'Private photo with VIP event background', 
      free: false, 
      vip: true,
      icon: <PhotoCamera />
    },
    { 
      feature: i18n.language === 'es' ? 'Charla "De Principiante a Rentable"' : 'Talk "From Beginner to Profitable"', 
      free: true, 
      vip: true,
      icon: <School />
    },
    { 
      feature: i18n.language === 'es' ? 'Taller interactivo: ¿Invertirías o No?' : 'Interactive workshop: Would you invest or not?', 
      free: true, 
      vip: true,
      icon: <EmojiEvents />
    },
    { 
      feature: i18n.language === 'es' ? 'Testimonios en vivo y transformaciones reales' : 'Live testimonials and real transformations', 
      free: true, 
      vip: true,
      icon: <Celebration />
    },
    { 
      feature: i18n.language === 'es' ? 'Presentación del Plan de Acción final' : 'Final Action Plan presentation', 
      free: true, 
      vip: true,
      icon: <School />
    },
    { 
      feature: i18n.language === 'es' ? 'Oferta exclusiva al final del evento' : 'Exclusive offer at the end of the event', 
      free: true, 
      vip: true,
      icon: <LocalOffer />
    },
  ];

  return (
    <>
      <MainNavbar />
      <IWMTicker isDarkMode={isDarkMode} />
      <Box
        sx={{
          minHeight: '100vh',
          pt: '160px', // Account for TopBar + Navbar + Ticker
          backgroundColor: muiTheme.palette.background.default,
          color: muiTheme.palette.text.primary,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Hero Section with Gradient Background */}
        <Box
          sx={{
            background: isDarkMode 
              ? 'linear-gradient(180deg, rgba(22, 163, 74, 0.1) 0%, rgba(0, 0, 0, 0) 50%)'
              : 'linear-gradient(180deg, rgba(22, 163, 74, 0.05) 0%, rgba(255, 255, 255, 0) 50%)',
            pb: 8,
            position: 'relative',
          }}
        >
          <TradingChartBg isDarkMode={isDarkMode} />
          <Container maxWidth="xl">
            <Grid container spacing={6} alignItems="flex-start">
              {/* Left section: Event Details */}
              <Grid item xs={12} lg={6}>
                <Stack spacing={4}>
                  {/* Event Title */}
                  <Box>
                    <Chip 
                      label={i18n.language === 'es' ? 'EVENTO ESPECIAL' : 'SPECIAL EVENT'} 
                      color="primary" 
                      size="small" 
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="h2" fontWeight={800} gutterBottom>
                      {event.name}
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
                      {event.description}
                    </Typography>
                  </Box>

                  {/* Event Info Cards */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Card sx={{ 
                        height: '100%',
                        backgroundColor: isDarkMode ? alpha('#fff', 0.05) : alpha('#000', 0.02),
                        border: '1px solid',
                        borderColor: 'divider',
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <CalendarMonth color="primary" />
                            <Typography variant="subtitle2" color="text.secondary">
                              {i18n.language === 'es' ? 'Fecha' : 'Date'}
                            </Typography>
                          </Box>
                          <Typography variant="h6" fontWeight={600}>
                            {i18n.language === 'es' ? 'Sábado, 23 de agosto de 2025' : 'Saturday, August 23, 2025'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Card sx={{ 
                        height: '100%',
                        backgroundColor: isDarkMode ? alpha('#fff', 0.05) : alpha('#000', 0.02),
                        border: '1px solid',
                        borderColor: 'divider',
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Schedule color="primary" />
                            <Typography variant="subtitle2" color="text.secondary">
                              {i18n.language === 'es' ? 'Horario' : 'Schedule'}
                            </Typography>
                          </Box>
                          <Typography variant="body2" fontWeight={600}>
                            <span style={{ color: muiTheme.palette.primary.main }}>VIP:</span> 8:30 AM – 10:00 AM
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            <span style={{ color: muiTheme.palette.text.secondary }}>{i18n.language === 'es' ? 'General:' : 'General:'}</span> 10:00 AM – 2:00 PM
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Location */}
                  <Card sx={{ 
                    backgroundColor: isDarkMode ? alpha('#fff', 0.05) : alpha('#000', 0.02),
                    border: '1px solid',
                    borderColor: 'divider',
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <LocationOn color="primary" />
                        <Typography variant="h6">
                          {i18n.language === 'es' ? 'Ubicación' : 'Location'}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {event.location || '4200 George J.Bean Parkway, Tampa, FL 33607, USA'}
                      </Typography>
                      <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <GoogleMap address={event.location || ''} height="300px" />
                      </Box>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>

              {/* Right section: Registration Form */}
              <Grid item xs={12} lg={6}>
                <Box sx={{ position: 'sticky', top: 140 }}>
                  <Fade in>
                    <Paper
                      elevation={isDarkMode ? 0 : 3}
                      sx={{
                        p: 4,
                        backgroundColor: isDarkMode ? alpha('#fff', 0.05) : '#fff',
                        border: isDarkMode ? '1px solid' : 'none',
                        borderColor: 'divider',
                        borderRadius: 3,
                        position: 'relative',
                      }}
                    >
                      {registrationType !== null && (
                        <IconButton
                          onClick={() => setRegistrationType(null)}
                          sx={{ position: 'absolute', top: 16, left: 16 }}
                        >
                          <ArrowBack />
                        </IconButton>
                      )}

                      <Stack spacing={3}>
                        {registrationType === null ? (
                          <Stack spacing={3}>
                            <Typography variant="h4" fontWeight={700} textAlign="center">
                              {i18n.language === 'es' ? '¿Cómo quieres registrarte?' : 'How would you like to register?'}
                            </Typography>
                            
                            {/* Free Registration Option */}
                            <Card 
                              sx={{ 
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                border: '2px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  transform: 'translateY(-2px)',
                                  boxShadow: 4,
                                },
                              }}
                              onClick={() => setRegistrationType('free')}
                            >
                              <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                  <Box>
                                    <Typography variant="h5" fontWeight={600} gutterBottom>
                                      {i18n.language === 'es' ? '🎟️ Entrada General' : '🎟️ General Admission'}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                      {i18n.language === 'es' ? 'Acceso completo al evento' : 'Full event access'}
                                    </Typography>
                                  </Box>
                                  <Typography variant="h4" color="success.main" fontWeight={700}>
                                    {i18n.language === 'es' ? 'GRATIS' : 'FREE'}
                                  </Typography>
                                </Stack>
                              </CardContent>
                            </Card>

                            {/* VIP Registration Option */}
                            {event.vipPrice && event.vipPrice > 0 && (
                              <Card 
                                sx={{ 
                                  cursor: 'pointer',
                                  transition: 'all 0.3s',
                                  border: '2px solid',
                                  borderColor: 'primary.main',
                                  background: isDarkMode 
                                    ? 'linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, rgba(21, 128, 61, 0.05) 100%)'
                                    : 'linear-gradient(135deg, rgba(22, 163, 74, 0.05) 0%, rgba(21, 128, 61, 0.02) 100%)',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 6,
                                  },
                                }}
                                onClick={() => setRegistrationType('vip')}
                              >
                                <CardContent sx={{ p: 3 }}>
                                  <Chip 
                                    label={i18n.language === 'es' ? 'RECOMENDADO' : 'RECOMMENDED'} 
                                    color="primary" 
                                    size="small" 
                                    sx={{ mb: 1 }}
                                  />
                                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Box>
                                      <Typography variant="h5" fontWeight={600} gutterBottom>
                                        {i18n.language === 'es' ? '⭐ Acceso VIP' : '⭐ VIP Access'}
                                      </Typography>
                                      <Typography variant="body1" color="text.secondary">
                                        {i18n.language === 'es' 
                                          ? 'Sesión exclusiva + beneficios premium' 
                                          : 'Exclusive session + premium benefits'}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                      <Typography variant="h4" color="primary.main" fontWeight={700}>
                                        ${event.vipPrice}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        USD
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </CardContent>
                              </Card>
                            )}
                          </Stack>
                        ) : (
                          <>
                            {registrationType === 'free' && (
                              <EventRegistrationForm
                                eventId={event._id}
                                onRegistered={() => {
                                  window.location.href = '/events/thank-you';
                                }}
                              />
                            )}
                            {registrationType === 'vip' && (
                              <VipRegistrationForm
                                eventId={event._id}
                                priceId="price_1RJKtNJ1acFkbhNIBNsLFT4p"
                                promoCode={promoCode}
                              />
                            )}
                          </>
                        )}
                      </Stack>
                    </Paper>
                  </Fade>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Benefits Comparison Section */}
        <Box sx={{ py: 8, backgroundColor: isDarkMode ? alpha('#fff', 0.02) : alpha('#000', 0.02) }}>
          <Container maxWidth="lg">
            <Typography variant="h3" fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
              {i18n.language === 'es' ? 'Compara los Beneficios' : 'Compare Benefits'}
            </Typography>
            <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
              {i18n.language === 'es' 
                ? 'Elige la opción que mejor se adapte a tus objetivos' 
                : 'Choose the option that best fits your goals'}
            </Typography>

            <Paper 
              elevation={isDarkMode ? 0 : 2}
              sx={{ 
                p: 4, 
                backgroundColor: isDarkMode ? alpha('#fff', 0.05) : '#fff',
                border: isDarkMode ? '1px solid' : 'none',
                borderColor: 'divider',
                borderRadius: 3,
              }}
            >
              {/* Header */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6} />
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h5" fontWeight={700} color="text.secondary">
                      {i18n.language === 'es' ? 'General' : 'General'}
                    </Typography>
                    <Typography variant="h6" color="success.main" fontWeight={600}>
                      {i18n.language === 'es' ? 'Gratis' : 'Free'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: alpha(muiTheme.palette.primary.main, 0.1),
                    }}
                  >
                    <Typography variant="h5" fontWeight={700} color="primary">
                      VIP
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight={600}>
                      ${event.vipPrice}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ mb: 3 }} />

              {/* Benefits List */}
              {benefits.map((item, index) => (
                <Box key={index}>
                  <Grid container spacing={2} alignItems="center" sx={{ py: 2 }}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ color: 'primary.main' }}>
                          {item.icon}
                        </Box>
                        <Typography variant="body1">
                          {item.feature}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        {item.free ? (
                          <CheckCircle sx={{ fontSize: 28, color: 'success.main' }} />
                        ) : (
                          <Cancel sx={{ fontSize: 28, color: 'text.disabled' }} />
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        {item.vip ? (
                          <CheckCircle sx={{ fontSize: 28, color: 'success.main' }} />
                        ) : (
                          <Cancel sx={{ fontSize: 28, color: 'text.disabled' }} />
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                  {index < benefits.length - 1 && <Divider />}
                </Box>
              ))}
            </Paper>

            {/* CTA Section */}
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Typography variant="h5" gutterBottom>
                {i18n.language === 'es' 
                  ? '¿Listo para transformar tu futuro financiero?' 
                  : 'Ready to transform your financial future?'}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                sx={{ mt: 2 }}
              >
                {i18n.language === 'es' ? 'Registrarme Ahora' : 'Register Now'}
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}