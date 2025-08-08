'use client';

import React from 'react';
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
  Chip,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  CheckCircle,
  ArrowForward,
  LiveTv,
  School,
  Groups,
} from '@mui/icons-material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/theme/theme-provider';
import { useRouter } from 'next/navigation';
import { useClientAuth } from '@/hooks/use-client-auth';
import { SubscriptionPlan } from '@/types/user';

// Based on actual prices from academy page
const pricingPlans = [
  {
    id: 'LiveSemanal',
    subscriptionPlan: SubscriptionPlan.LiveWeeklyRecurring,
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
    subscriptionPlan: SubscriptionPlan.MasterClases, 
    name: 'Master Clases',
    nameES: 'Master Clases',
    description: 'Professional trading master classes',
    descriptionES: 'Clases magistrales de trading profesional',
    price: 199.99,
    interval: 'mes',
    intervalEN: 'month',
    badge: null,
    badgeEN: null,
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
    subscriptionPlan: SubscriptionPlan.PSICOTRADING,
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

export function DayTradeDakPricingV2() {
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t, i18n } = useTranslation(['landing']);
  const isSpanish = i18n.language === 'es';
  const router = useRouter();
  const { isAuthenticated } = useClientAuth();

  const handleSubscribe = (subscriptionPlan: SubscriptionPlan) => {
    if (!isAuthenticated) {
      // Redirect to login with return URL that includes the highlight parameter
      const returnUrl = `/academy/subscription/plans?highlight=${subscriptionPlan}`;
      router.push(`/auth/sign-in?returnUrl=${encodeURIComponent(returnUrl)}`);
    } else {
      // Redirect directly to subscription plans with highlight parameter
      router.push(`/academy/subscription/plans?highlight=${subscriptionPlan}`);
    }
  };

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
            {isSpanish ? 'PLANES DE PRECIOS' : 'PRICING PLANS'}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 3,
              color: muiTheme.palette.text.primary,
            }}
          >
            {isSpanish ? 'Elige Tu ' : 'Choose Your '}
            <span style={{ 
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {isSpanish ? 'Plan de Trading' : 'Trading Journey'}
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
            {isSpanish 
              ? 'Planes de suscripción flexibles para adaptarse a tu estilo y objetivos de aprendizaje.'
              : 'Flexible subscription plans to fit your learning style and goals.'}
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
                    borderColor: plan.id === 'MasterClases'
                      ? plan.color
                      : isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    borderRadius: 3,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    transform: plan.id === 'MasterClases' ? 'scale(1.02)' : 'scale(1)',
                    '&:hover': {
                      transform: plan.id === 'MasterClases' ? 'scale(1.05)' : 'scale(1.02)',
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

                    {/* Duration Info */}
                    {planDuration && (
                      <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Chip
                          label={planDuration}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            borderColor: plan.color,
                            color: plan.color,
                          }}
                        />
                      </Box>
                    )}

                    {/* Features */}
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
                              color: 'text.primary',
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    {/* CTA */}
                    <Button
                      onClick={() => handleSubscribe(plan.subscriptionPlan)}
                      fullWidth
                      variant={plan.id === 'MasterClases' ? 'contained' : 'outlined'}
                      size="large"
                      endIcon={<ArrowForward />}
                      sx={{
                        ...(plan.id === 'MasterClases'
                          ? {
                              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                              color: 'white',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
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
                      {isSpanish ? 'Ver Detalles' : 'View Details'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Additional Info */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {isSpanish 
              ? 'Explora nuestros planes de suscripción y elige el que mejor se adapte a tus objetivos de trading.'
              : 'Explore our subscription plans and choose the one that best fits your trading goals.'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {isSpanish ? '¿Necesitas ayuda para elegir? ' : 'Need help choosing? '}
            <Link href="/contact" style={{ color: '#16a34a' }}>
              {isSpanish ? 'Contacta a nuestro equipo' : 'Contact our team'}
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}