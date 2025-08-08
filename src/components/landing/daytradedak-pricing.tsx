'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Chip,
  useTheme as useMuiTheme,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Star,
  ArrowForward,
  LiveTv,
  School,
  Groups,
  Close,
  CalendarMonth,
  EventAvailable,
  VideoLibrary,
} from '@mui/icons-material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/theme/theme-provider';

// Based on actual prices from academy page
const pricingPlans = [
  {
    id: 'LiveSemanal',
    name: 'Live Semanal',
    nameES: 'Live Semanal',
    description: 'Access to weekly live trading sessions',
    descriptionES: 'Acceso semanal al trading en vivo',
    price: 53.99,
    interval: 'semana',
    intervalEN: 'week',
    badge: null,
    features: [
      { text: 'Live trading sessions every day', included: true },
      { text: 'Real-time market analysis', included: true },
      { text: 'Live trading signals', included: true },
      { text: 'Chat with professional traders', included: true },
      { text: 'Manual renewal each week', included: true },
      { text: 'Cancel anytime', included: true },
    ],
    featuresES: [
      { text: 'Sesiones de trading en vivo diarias', included: true },
      { text: 'Análisis de mercado en tiempo real', included: true },
      { text: 'Señales de trading en vivo', included: true },
      { text: 'Chat con traders profesionales', included: true },
      { text: 'Renovación manual cada semana', included: true },
      { text: 'Cancela cuando quieras', included: true },
    ],
    color: '#ef4444',
    icon: LiveTv,
    duration: '7 días de acceso',
    durationEN: '7 days access',
  },
  {
    id: 'MasterClases', 
    name: 'Master Clases',
    nameES: 'Master Clases',
    description: 'Professional trading master classes',
    descriptionES: 'Clases magistrales de trading profesional',
    price: 199.99,
    interval: 'mes',
    intervalEN: 'month',
    badge: 'MÁS POPULAR',
    badgeEN: 'MOST POPULAR',
    features: [
      { text: 'Weekly master classes live', included: true },
      { text: 'Advanced trading strategies', included: true },
      { text: 'Professional technical analysis', included: true },
      { text: 'Exclusive trader community', included: true },
      { text: 'Downloadable study material', included: true },
      { text: 'Participation certificate', included: true },
      { text: 'Special price for community', included: true },
    ],
    featuresES: [
      { text: 'Master clases semanales en vivo', included: true },
      { text: 'Estrategias avanzadas de trading', included: true },
      { text: 'Análisis técnico profesional', included: true },
      { text: 'Comunidad exclusiva de traders', included: true },
      { text: 'Material de estudio descargable', included: true },
      { text: 'Certificado de participación', included: true },
      { text: 'Precio especial para comunidad', included: true },
    ],
    color: '#8b5cf6',
    icon: School,
  },
  {
    id: 'PsicoTrading',
    name: 'PsicoTrading',
    nameES: 'PsicoTrading',
    description: 'Trading psychology',
    descriptionES: 'Psicología de trading',
    price: 29.99,
    interval: 'mes',
    intervalEN: 'month',
    badge: null,
    features: [
      { text: 'Psychology sessions', included: true },
      { text: 'Emotional control', included: true },
      { text: 'Trading mindfulness', included: true },
      { text: 'Personalized mental plan', included: true },
      { text: 'Monthly progress evaluation', included: true },
      { text: 'Support group', included: true },
    ],
    featuresES: [
      { text: 'Sesiones de psicología', included: true },
      { text: 'Control emocional', included: true },
      { text: 'Mindfulness para trading', included: true },
      { text: 'Plan mental personalizado', included: true },
      { text: 'Evaluación mensual de progreso', included: true },
      { text: 'Grupo de apoyo', included: true },
    ],
    color: '#10b981',
    icon: Groups,
  },
];


export function DayTradeDakPricing() {
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t, i18n } = useTranslation(['landing']);
  const isSpanish = i18n.language === 'es';

  return (
    <Box
      sx={{
        py: 10,
        backgroundColor: muiTheme.palette.background.default,
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            sx={{
              color: '#16a34a',
              fontWeight: 600,
              letterSpacing: 1.5,
              mb: 2,
              display: 'block',
            }}
          >
            PRICING PLANS
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 3,
              color: muiTheme.palette.text.primary,
            }}
          >
            Choose Your{' '}
            <span style={{ 
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Trading Journey
            </span>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: muiTheme.palette.text.secondary,
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.8,
            }}
          >
            Flexible subscription plans and one-time purchases to fit your learning style and goals.
          </Typography>
        </Box>

        {/* Subscription Plans */}
        <Grid container spacing={4} alignItems="stretch" justifyContent="center">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon;
            const planName = isSpanish ? plan.nameES : plan.name;
            const planDescription = isSpanish ? plan.descriptionES : plan.description;
            const planFeatures = isSpanish ? plan.featuresES : plan.features;
            const planInterval = isSpanish ? plan.interval : plan.intervalEN;
            const planBadge = plan.badge ? (isSpanish ? plan.badge : plan.badgeEN) : null;
            const planDuration = plan.duration ? (isSpanish ? plan.duration : plan.durationEN) : null;

            return (
              <Grid item xs={12} md={4} key={plan.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    backgroundColor: muiTheme.palette.background.paper,
                    border: '2px solid',
                    borderColor: plan.badge
                      ? plan.color
                      : isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 3,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    transform: plan.badge ? 'scale(1.05)' : 'scale(1)',
                    '&:hover': {
                      transform: plan.badge ? 'scale(1.07)' : 'scale(1.02)',
                      borderColor: plan.color,
                    },
                  }}
                >
                  {planBadge && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: plan.color,
                        color: 'white',
                        px: 3,
                        py: 0.5,
                        borderRadius: 20,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      {planBadge}
                    </Box>
                  )}

                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Icon sx={{ fontSize: 48, color: plan.color, mb: 2 }} />
                      <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
                        {planName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {planDescription}
                      </Typography>
                    </Box>

                    {/* Pricing */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                        <Typography variant="h3" fontWeight="800">
                          ${plan.price}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                          /{planInterval}
                        </Typography>
                      </Box>
                      {planDuration && (
                        <Chip
                          label={planDuration}
                          size="small"
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>

                    {/* Features */}
                    <List sx={{ flex: 1, mb: 4 }}>
                      {planFeatures.map((feature, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            {feature.included ? (
                              <CheckCircle sx={{ fontSize: 20, color: '#16a34a' }} />
                            ) : (
                              <Close sx={{ fontSize: 20, color: muiTheme.palette.text.disabled }} />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={feature.text}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: feature.included ? 'text.primary' : 'text.disabled',
                              sx: { textDecoration: feature.included ? 'none' : 'line-through' },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    {/* CTA */}
                    <Button
                      component={Link}
                      href="/auth/sign-up"
                      fullWidth
                      variant={plan.badge ? 'contained' : 'outlined'}
                      size="large"
                      endIcon={<ArrowForward />}
                      sx={{
                        ...(plan.badge
                          ? {
                              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                              color: 'white',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                              },
                            }
                          : {
                              borderColor: plan.color,
                              color: plan.color,
                              '&:hover': {
                                borderColor: plan.color,
                                backgroundColor: `${plan.color}10`,
                              },
                            }),
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Additional Info - Commented out until additionalPlans is defined */}
        {/* <Box sx={{ mt: 10 }}>
          <Typography variant="h4" fontWeight="700" sx={{ mb: 4, textAlign: 'center' }}>
            {isSpanish ? 'Suscripciones Mensuales Adicionales' : 'Additional Monthly Subscriptions'}
          </Typography>
          <Grid container spacing={4} sx={{ mb: 10 }}>
            {additionalPlans.map((plan) => {
              const Icon = plan.icon;
              const planName = isSpanish ? plan.nameES : plan.name;
              const planDescription = isSpanish ? plan.descriptionES : plan.description;
              const planFeatures = isSpanish ? plan.featuresES : plan.features;

              return (
                <Grid item xs={12} md={6} key={plan.id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      backgroundColor: muiTheme.palette.background.paper,
                      border: '2px solid',
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      borderRadius: 3,
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: plan.color,
                      },
                    }}
                  >
                    {plan.badge && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -12,
                          right: 20,
                          backgroundColor: plan.color,
                          color: 'white',
                          px: 3,
                          py: 0.5,
                          borderRadius: 20,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        {plan.badge}
                      </Box>
                    )}
                    <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Icon sx={{ fontSize: 48, color: plan.color, mb: 2 }} />
                        <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
                          {planName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {planDescription}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                          {plan.freeWithLive ? (
                            <>
                              <Typography
                                variant="h5"
                                color="text.disabled"
                                sx={{ textDecoration: 'line-through', mr: 1 }}
                              >
                                ${plan.price}
                              </Typography>
                              <Typography variant="h3" fontWeight="800" color="success.main">
                                FREE
                              </Typography>
                            </>
                          ) : (
                            <>
                              <Typography variant="h3" fontWeight="800">
                                ${plan.price}
                              </Typography>
                              <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                                / {plan.interval}
                              </Typography>
                            </>
                          )}
                        </Box>
                        {plan.freeWithLive && (
                          <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                            with Live subscription
                          </Typography>
                        )}
                      </Box>
                      <List sx={{ flex: 1, mb: 4 }}>
                        {planFeatures.map((feature, index) => (
                          <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircle sx={{ fontSize: 20, color: '#16a34a' }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={feature.text}
                              primaryTypographyProps={{
                                variant: 'body2',
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Button
                        component={Link}
                        href="/auth/sign-up"
                        fullWidth
                        variant={plan.freeWithLive ? 'contained' : 'outlined'}
                        size="large"
                        endIcon={<ArrowForward />}
                        sx={{
                          borderColor: plan.color,
                          color: plan.freeWithLive ? 'white' : plan.color,
                          backgroundColor: plan.freeWithLive ? plan.color : 'transparent',
                          py: 1.5,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: plan.color,
                            backgroundColor: plan.freeWithLive ? plan.color : `${plan.color}10`,
                          },
                        }}
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box> */}

        {/* Master Course Event - Special Section - Commented out until eventPricing is defined */}
        {/* <Box sx={{ mt: 10 }}>
          <Divider sx={{ mb: 8 }}>
            <Chip label="EXCLUSIVE EVENT" sx={{ backgroundColor: '#ef4444', color: 'white' }} />
          </Divider>
          
          <Card
            elevation={0}
            sx={{
              backgroundColor: muiTheme.palette.background.paper,
              border: '2px solid',
              borderColor: eventPricing.color,
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <Grid container>
              <Grid item xs={12} md={6} sx={{ p: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <EventAvailable sx={{ fontSize: 48, color: eventPricing.color }} />
                  <Box>
                    <Typography variant="h4" fontWeight="700">
                      {eventPricing.name}
                    </Typography>
                    <Chip
                      label={eventPricing.badge}
                      size="small"
                      sx={{
                        backgroundColor: eventPricing.color,
                        color: 'white',
                        fontWeight: 600,
                        mt: 1,
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                  {eventPricing.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 4 }}>
                  <Typography variant="h3" fontWeight="800" sx={{ color: eventPricing.color }}>
                    ${eventPricing.price}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                    all inclusive
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  href="/master-course"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    background: `linear-gradient(135deg, ${eventPricing.color} 0%, #dc2626 100%)`,
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    },
                  }}
                >
                  Learn More About Master Course
                </Button>
              </Grid>
              <Grid item xs={12} md={6} sx={{ p: 6, backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)' }}>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  What\'s Included:
                </Typography>
                <List>
                  {eventPricing.features.map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Star sx={{ fontSize: 20, color: eventPricing.color }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature}
                        primaryTypographyProps={{
                          variant: 'body1',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Card>
        </Box> */}

        {/* Additional Info */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            All prices in USD. Subscriptions auto-renew until cancelled. Cancel anytime.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Need help choosing? <Link href="/contact" style={{ color: '#16a34a' }}>Contact our team</Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}