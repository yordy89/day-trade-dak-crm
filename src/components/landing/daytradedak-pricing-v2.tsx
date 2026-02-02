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
  alpha,
} from '@mui/material';
import {
  CheckCircle,
  ArrowForward,
  LiveTv,
  School,
  Groups,
  Star,
  Bolt,
} from '@mui/icons-material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/theme/theme-provider';
import { useRouter } from 'next/navigation';
import { useClientAuth } from '@/hooks/use-client-auth';
import { SubscriptionPlan } from '@/types/user';

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
    badge: 'POPULAR',
    badgeEN: 'POPULAR',
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
      const returnUrl = `/academy/subscription/plans?highlight=${subscriptionPlan}`;
      router.push(`/auth/sign-in?returnUrl=${encodeURIComponent(returnUrl)}`);
    } else {
      router.push(`/academy/subscription/plans?highlight=${subscriptionPlan}`);
    }
  };

  return (
    <Box
      sx={{
        py: 12,
        position: 'relative',
        overflow: 'hidden',
        background: isDarkMode
          ? `linear-gradient(180deg, #0d1117 0%, #161b22 30%, #1a1f26 50%, #161b22 70%, #0d1117 100%)`
          : `linear-gradient(180deg, #ffffff 0%, #f8fafc 30%, #f1f5f9 50%, #f8fafc 70%, #ffffff 100%)`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: isDarkMode
            ? `radial-gradient(ellipse at 10% 30%, ${alpha('#8b5cf6', 0.1)} 0%, transparent 50%),
               radial-gradient(ellipse at 90% 70%, ${alpha('#16a34a', 0.08)} 0%, transparent 50%),
               radial-gradient(ellipse at 50% 50%, ${alpha('#ef4444', 0.05)} 0%, transparent 40%)`
            : `radial-gradient(ellipse at 10% 30%, ${alpha('#8b5cf6', 0.06)} 0%, transparent 50%),
               radial-gradient(ellipse at 90% 70%, ${alpha('#16a34a', 0.05)} 0%, transparent 50%),
               radial-gradient(ellipse at 50% 50%, ${alpha('#ef4444', 0.03)} 0%, transparent 40%)`,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          backgroundImage: isDarkMode
            ? `radial-gradient(circle at center, transparent 0%, ${alpha('#0d1117', 0.3)} 100%)`
            : `radial-gradient(circle at center, transparent 0%, ${alpha('#ffffff', 0.5)} 100%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 10 }}>
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
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              color: muiTheme.palette.text.primary,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
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

        {/* Premium Pricing Cards */}
        <Grid container spacing={4} alignItems="stretch">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon;
            const planName = isSpanish ? plan.nameES : plan.name;
            const planDescription = isSpanish ? plan.descriptionES : plan.description;
            const planFeatures = isSpanish ? plan.featuresES : plan.features;
            const planInterval = isSpanish ? plan.interval : plan.intervalEN;
            const planBadge = plan.badge ? (isSpanish ? plan.badge : plan.badgeEN) : null;
            const planDuration = plan.duration ? (isSpanish ? plan.duration : plan.durationEN) : null;
            const isFeatured = plan.id === 'MasterClases';

            return (
              <Grid item xs={12} md={4} key={plan.id}>
                <Box sx={{ position: 'relative', height: '100%' }}>
                  {/* Popular Badge */}
                  {planBadge && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -14,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        background: `linear-gradient(135deg, ${plan.color} 0%, ${alpha(plan.color, 0.8)} 100%)`,
                        color: 'white',
                        fontWeight: 700,
                        px: 3,
                        py: 1,
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        letterSpacing: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        boxShadow: `0 8px 24px ${alpha(plan.color, 0.4)}`,
                      }}
                    >
                      <Star sx={{ fontSize: 16 }} />
                      {planBadge}
                    </Box>
                  )}

                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '24px',
                      border: '2px solid',
                      borderColor: isFeatured ? plan.color : alpha(plan.color, 0.2),
                      background: isDarkMode
                        ? `linear-gradient(145deg, ${alpha(plan.color, 0.08)} 0%, ${alpha('#0d1117', 0.95)} 50%, ${alpha(plan.color, 0.05)} 100%)`
                        : `linear-gradient(145deg, ${alpha(plan.color, 0.05)} 0%, #ffffff 50%, ${alpha(plan.color, 0.03)} 100%)`,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isFeatured
                        ? `0 20px 60px ${alpha(plan.color, 0.25)}, inset 0 1px 0 ${alpha(plan.color, 0.1)}`
                        : `0 10px 40px ${alpha('#000000', 0.1)}`,
                      transform: isFeatured ? { xs: 'none', md: 'scale(1.02)' } : 'none',
                      '&:hover': {
                        transform: isFeatured ? { md: 'scale(1.05) translateY(-8px)' } : { md: 'translateY(-8px)' },
                        borderColor: plan.color,
                        boxShadow: `0 30px 80px ${alpha(plan.color, 0.35)}, inset 0 1px 0 ${alpha(plan.color, 0.2)}`,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${alpha(plan.color, 0.5)}, ${plan.color}, ${alpha(plan.color, 0.5)})`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                      {/* Icon Header */}
                      <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '20px',
                            background: `linear-gradient(135deg, ${plan.color} 0%, ${alpha(plan.color, 0.7)} 100%)`,
                            mx: 'auto',
                            mb: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 12px 30px ${alpha(plan.color, 0.4)}`,
                            border: '3px solid',
                            borderColor: alpha('#ffffff', 0.2),
                          }}
                        >
                          <Icon sx={{ fontSize: 40, color: 'white' }} />
                        </Box>
                        <Typography variant="h5" fontWeight="700" sx={{ mb: 0.5 }}>
                          {planName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          {planDescription}
                        </Typography>

                        {/* Duration Badge */}
                        {planDuration && (
                          <Chip
                            icon={<Bolt sx={{ fontSize: '16px !important', color: plan.color }} />}
                            label={planDuration}
                            size="small"
                            sx={{
                              backgroundColor: alpha(plan.color, 0.1),
                              color: plan.color,
                              fontWeight: 600,
                              borderRadius: '12px',
                              border: '1px solid',
                              borderColor: alpha(plan.color, 0.2),
                            }}
                          />
                        )}
                      </Box>

                      {/* Features List */}
                      <List sx={{ mb: 4 }}>
                        {planFeatures.map((feature, idx) => (
                          <ListItem
                            key={idx}
                            sx={{
                              px: 1.5,
                              py: 1,
                              mb: 0.5,
                              borderRadius: '10px',
                              transition: 'all 0.2s ease',
                              '&:hover': { backgroundColor: alpha(plan.color, 0.05) },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Box
                                sx={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: '6px',
                                  backgroundColor: alpha(plan.color, 0.15),
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <CheckCircle sx={{ fontSize: 14, color: plan.color }} />
                              </Box>
                            </ListItemIcon>
                            <ListItemText
                              primary={feature.text}
                              primaryTypographyProps={{ variant: 'body2', fontWeight: 500, fontSize: '0.9rem' }}
                            />
                          </ListItem>
                        ))}
                      </List>

                      {/* CTA Button */}
                      <Button
                        onClick={() => handleSubscribe(plan.subscriptionPlan)}
                        fullWidth
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForward />}
                        sx={{
                          background: `linear-gradient(135deg, ${plan.color} 0%, ${alpha(plan.color, 0.8)} 100%)`,
                          color: 'white',
                          py: 1.8,
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '1rem',
                          borderRadius: '14px',
                          boxShadow: `0 8px 24px ${alpha(plan.color, 0.35)}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: `linear-gradient(135deg, ${plan.color} 0%, ${alpha(plan.color, 0.9)} 100%)`,
                            boxShadow: `0 12px 32px ${alpha(plan.color, 0.5)}`,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        {isSpanish ? 'Ver Detalles' : 'View Details'}
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {/* Additional Info */}
        <Box sx={{ mt: 10, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {isSpanish
              ? 'Explora nuestros planes de suscripción y elige el que mejor se adapte a tus objetivos de trading.'
              : 'Explore our subscription plans and choose the one that best fits your trading goals.'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isSpanish ? '¿Necesitas ayuda para elegir? ' : 'Need help choosing? '}
            <Link href="/contact" style={{ color: '#16a34a', fontWeight: 600 }}>
              {isSpanish ? 'Contacta a nuestro equipo' : 'Contact our team'}
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
