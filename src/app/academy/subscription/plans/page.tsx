'use client';

import React, { useState, useEffect, cloneElement } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Divider,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as Check,
  Lightning,
  Crown,
  VideoCamera,
  Brain,
  BookOpen,
  Certificate,
  Clock,
  Calendar,
  CurrencyDollar,
  Info,
  TrendUp,
} from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useClientAuth } from '@/hooks/use-client-auth';
import { SubscriptionPlan } from '@/types/user';
import API from '@/lib/axios';
import { loadStripe } from '@stripe/stripe-js';
import { getStripePublishableKey } from '@/config/environment';

const stripePromise = loadStripe(getStripePublishableKey());

interface PlanFeature {
  text: string;
  included: boolean;
  tooltip?: string;
}

interface PricingPlan {
  id: SubscriptionPlan;
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  billingCycle: 'one_time' | 'weekly' | 'monthly' | 'yearly';
  description: string;
  icon: React.ReactNode;
  color: string;
  popular?: boolean;
  features: PlanFeature[];
  duration?: string;
  tag?: string;
}

const getLivePlans = (t: any): PricingPlan[] => [
  {
    id: SubscriptionPlan.LiveWeeklyManual,
    name: t('subscriptions.plans.liveWeekly.name'),
    price: 53.99,
    period: t('subscriptions.perWeek'),
    billingCycle: 'weekly',
    description: t('subscriptions.plans.liveWeekly.description'),
    icon: <Lightning size={32} />,
    color: '#ef4444',
    features: [
      { text: t('subscriptions.planFeatures.liveDailySession'), included: true },
      { text: t('subscriptions.planFeatures.realtimeAnalysis'), included: true },
      { text: t('subscriptions.planFeatures.liveTradingSignals'), included: true },
      { text: t('subscriptions.planFeatures.professionalChat'), included: true },
      { text: t('subscriptions.planFeatures.weeklyManualRenewal'), included: true },
      { text: t('subscriptions.cancelAnytime'), included: true },
    ],
    duration: t('subscriptions.daysOfAccess', { days: 7 }),
  },
  {
    id: SubscriptionPlan.LiveWeeklyRecurring,
    name: t('subscriptions.plans.liveWeeklyAuto.name'),
    price: 53.99,
    originalPrice: undefined,
    period: t('subscriptions.perWeek'),
    billingCycle: 'weekly',
    description: t('subscriptions.plans.liveWeeklyAuto.description'),
    icon: <Lightning size={32} />,
    color: '#ef4444',
    popular: true,
    features: [
      { text: t('subscriptions.planFeatures.liveDailySession'), included: true },
      { text: t('subscriptions.planFeatures.realtimeAnalysis'), included: true },
      { text: t('subscriptions.planFeatures.liveTradingSignals'), included: true },
      { text: t('subscriptions.planFeatures.professionalChat'), included: true },
      { text: t('subscriptions.planFeatures.automaticRenewal'), included: true },
      { text: t('subscriptions.planFeatures.noInterruptions'), included: true },
      { text: t('subscriptions.cancelAnytime'), included: true },
    ],
    duration: t('subscriptions.automaticRenewal'),
    tag: t('subscriptions.bestOption'),
  },
];

const getMonthlyPlans = (t: any): PricingPlan[] => [
  {
    id: SubscriptionPlan.MasterClases,
    name: t('subscriptions.plans.masterClasses.name'),
    price: 199.99,
    period: t('subscriptions.perMonth'),
    billingCycle: 'monthly',
    description: t('subscriptions.plans.masterClasses.description'),
    icon: <Crown size={32} />,
    color: '#8b5cf6',
    popular: true,
    features: [
      { text: t('subscriptions.planFeatures.weeklyMasterClasses'), included: true },
      { text: t('subscriptions.planFeatures.institutionalAnalysis'), included: true },
      { text: t('subscriptions.planFeatures.marketIndicators'), included: true },
      { text: t('subscriptions.planFeatures.orderFlowAnalysis'), included: true },
      { text: t('subscriptions.planFeatures.riskManagement'), included: true },
      { text: t('subscriptions.planFeatures.realTimeDecisions'), included: true },
      { text: t('subscriptions.planFeatures.exclusiveCommunity'), included: true },
    ],
  },
  {
    id: SubscriptionPlan.LiveRecorded,
    name: t('subscriptions.plans.liveRecorded.name'),
    price: 52.99,
    period: t('subscriptions.perMonth'),
    billingCycle: 'monthly',
    description: t('subscriptions.plans.liveRecorded.description'),
    icon: <VideoCamera size={32} />,
    color: '#3b82f6',
    features: [
      { text: t('subscriptions.planFeatures.accessAllRecorded'), included: true },
      { text: t('subscriptions.planFeatures.newDailyContent'), included: true },
      { text: t('subscriptions.planFeatures.prePostMarketAnalysis'), included: true },
      { text: t('subscriptions.planFeatures.indicatorAnalysis'), included: true },
      { text: t('subscriptions.planFeatures.realOperations'), included: true },
      { text: t('subscriptions.planFeatures.patternIdentification'), included: true },
      { text: t('subscriptions.planFeatures.freeWithLive'), included: true, tooltip: t('subscriptions.includedNoCost') },
    ],
  },
  {
    id: SubscriptionPlan.PSICOTRADING,
    name: t('subscriptions.plans.psicoTrading.name'),
    price: 29.99,
    period: t('subscriptions.perMonth'),
    billingCycle: 'monthly',
    description: t('subscriptions.plans.psicoTrading.description'),
    icon: <Brain size={32} />,
    color: '#16a34a',
    features: [
      { text: t('subscriptions.planFeatures.tradingPsychology'), included: true },
      { text: t('subscriptions.planFeatures.emotionalControlTrading'), included: true },
      { text: t('subscriptions.planFeatures.disciplineDevelopment'), included: true },
      { text: t('subscriptions.planFeatures.fearGreedManagement'), included: true },
      { text: t('subscriptions.planFeatures.lossManagement'), included: true },
      { text: t('subscriptions.planFeatures.mentalConsistency'), included: true },
    ],
  },
  // Hidden for now - will be enabled in the future
  // {
  //   id: SubscriptionPlan.Stocks,
  //   name: t('subscriptions.plans.stocks.name'),
  //   price: 99.99,
  //   period: t('subscriptions.perMonth'),
  //   billingCycle: 'monthly',
  //   description: t('subscriptions.plans.stocks.description'),
  //   icon: <TrendUp size={32} />,
  //   color: '#ec4899',
  //   popular: true,
  //   features: [
  //     { text: t('subscriptions.planFeatures.stocksContent'), included: true },
  //     { text: t('subscriptions.planFeatures.fundamentalAnalysis'), included: true },
  //     { text: t('subscriptions.planFeatures.technicalAnalysis'), included: true },
  //     { text: t('subscriptions.planFeatures.portfolioManagement'), included: true },
  //     { text: t('subscriptions.planFeatures.optionsTradingAnalysis'), included: true },
  //     { text: t('subscriptions.planFeatures.marketIndicators'), included: true },
  //   ],
  // },
];

const getFixedPlans = (t: any): PricingPlan[] => [
  {
    id: SubscriptionPlan.CLASSES,
    name: t('subscriptions.plans.classes.name'),
    price: 500.00,
    period: t('subscriptions.oneTimePayment'),
    billingCycle: 'one_time',
    description: t('subscriptions.plans.classes.description'),
    icon: <BookOpen size={32} />,
    color: '#f59e0b',
    popular: true,
    features: [
      { text: t('subscriptions.planFeatures.15DaysAccess'), included: true },
      { text: t('subscriptions.planFeatures.40HoursContent'), included: true },
      { text: t('subscriptions.planFeatures.6StructuredModules'), included: true },
      { text: t('subscriptions.planFeatures.practicalExercises'), included: true },
      { text: t('subscriptions.planFeatures.downloadableMaterial'), included: true },
      { text: t('subscriptions.planFeatures.completionCertificate'), included: true },
    ],
    duration: t('subscriptions.daysOfAccess', { days: 15 }),
    tag: t('subscriptions.popularTag'),
  },
  {
    id: SubscriptionPlan.PeaceWithMoney,
    name: t('subscriptions.plans.peaceWithMoney.name'),
    price: 199.99,
    period: t('subscriptions.oneTimePayment'),
    billingCycle: 'one_time',
    description: t('subscriptions.plans.peaceWithMoney.description'),
    icon: <CurrencyDollar size={32} />,
    color: '#06b6d4',
    features: [
      { text: t('subscriptions.planFeatures.60DaysAccess'), included: true },
      { text: t('subscriptions.planFeatures.financialEducation'), included: true },
      { text: t('subscriptions.planFeatures.personalFinanceManagement'), included: true },
      { text: t('subscriptions.planFeatures.financialFreedom'), included: true },
      { text: t('subscriptions.planFeatures.downloadableMaterial'), included: true },
      { text: t('subscriptions.planFeatures.completionCertificate'), included: true },
    ],
    duration: t('subscriptions.daysOfAccess', { days: 60 }),
  },
];

export default function PlansPage() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const _isDarkMode = theme.palette.mode === 'dark';
  const { user, authToken } = useClientAuth();
  const { t } = useTranslation('academy');
  const [selectedView, setSelectedView] = useState<'all' | 'live' | 'monthly' | 'fixed'>('all');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_billingPeriod, _setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  // Get translated plans
  const LIVE_PLANS = getLivePlans(t);
  const MONTHLY_PLANS = getMonthlyPlans(t);
  const FIXED_PLANS = getFixedPlans(t);
  
  // Get the highlighted plan from URL params
  const highlightedPlan = searchParams.get('highlight') as SubscriptionPlan | null;
  
  // Scroll to highlighted plan on mount
  useEffect(() => {
    if (highlightedPlan) {
      // Small delay to ensure the page is fully loaded
      setTimeout(() => {
        const element = document.getElementById(`plan-${highlightedPlan}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [highlightedPlan]);

  // Get user's active subscriptions
  const activeSubscriptions = user?.subscriptions || [];
  const hasLiveSubscription = activeSubscriptions.some(
    (sub: any) => {
      if (!sub) return false; // Handle null/undefined subscriptions
      if (typeof sub === 'string') {
        return sub === (SubscriptionPlan.LiveWeeklyManual as string) || sub === (SubscriptionPlan.LiveWeeklyRecurring as string);
      }
      return (sub.plan === SubscriptionPlan.LiveWeeklyManual || sub.plan === SubscriptionPlan.LiveWeeklyRecurring) &&
             (!sub.status || sub.status === 'active') &&
             (!sub.expiresAt || new Date(sub.expiresAt) > new Date()) &&
             (!sub.currentPeriodEnd || new Date(sub.currentPeriodEnd) > new Date());
    }
  );

  // Fetch dynamic prices
  useEffect(() => {
    const fetchPrices = async () => {
      // Only fetch prices if user is authenticated
      if (!user) {
        setLoadingPrices(false);
        return;
      }
      
      try {
        const response = await API.get('/payments/plan-prices', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const pricesData = response.data;
        
        // Convert to a map for easy lookup
        const priceMap: Record<string, number> = {};
        pricesData.forEach((item: any) => {
          priceMap[item.plan] = item.finalPrice;
        });
        
        setPrices(priceMap);
      } catch (err) {
        console.error('Error fetching prices:', err);
        // Don&apos;t show error for non-authenticated users
        if (user) {
          setError(t('subscriptions.errorLoadingPrices'));
        }
      } finally {
        setLoadingPrices(false);
      }
    };

    void fetchPrices();
  }, [user, authToken, t]);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user) {
      router.push('/auth/sign-in?returnUrl=/academy/subscription/plans');
      return;
    }

    // Check if user already has this subscription
    const hasSubscription = activeSubscriptions.some((sub: any) => {
      if (!sub) return false; // Handle null/undefined subscriptions
      if (typeof sub === 'string') {
        return sub === (plan as string);
      }
      return sub.plan === (plan as string) &&
             (!sub.status || sub.status === 'active') &&
             (!sub.expiresAt || new Date(sub.expiresAt) > new Date()) &&
             (!sub.currentPeriodEnd || new Date(sub.currentPeriodEnd) > new Date());
    });
    
    if (hasSubscription) {
      setError(t('subscriptions.alreadyHaveSubscription'));
      return;
    }

    setLoadingPlan(plan);
    setError(null);

    try {
      const response = await API.post('/payments/checkout/enhanced', {
        plan,
        metadata: {
          userId: user._id,
          planName: MONTHLY_PLANS.find(p => p.id === plan)?.name || 
                     LIVE_PLANS.find(p => p.id === plan)?.name || 
                     FIXED_PLANS.find(p => p.id === plan)?.name,
        },
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        const stripe = await stripePromise;
        if (!stripe) throw new Error('Stripe not loaded');

        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });

        if (stripeError) throw new Error(stripeError.message || 'Stripe checkout error');
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.response?.data?.message || t('subscriptions.paymentError'));
    } finally {
      setLoadingPlan(null);
    }
  };

  const getDisplayPrice = (plan: PricingPlan) => {
    if (loadingPrices || !user) return plan.price;
    
    // Use dynamic price if available
    if (prices[plan.id]) {
      return prices[plan.id];
    }
    
    // Apply manual discounts for specific cases
    if ((plan.id as string) === (SubscriptionPlan.MasterClases as string) && hasLiveSubscription) {
      return 22.99; // Special community price
    }
    
    if ((plan.id as string) === (SubscriptionPlan.LiveRecorded as string) && hasLiveSubscription) {
      return 0; // Free with Live subscription
    }
    
    return plan.price;
  };

  const renderPlanCard = (plan: PricingPlan) => {
    const displayPrice = getDisplayPrice(plan);
    const isCurrentPlan = activeSubscriptions.some((sub: any) => {
      if (!sub) return false; // Handle null/undefined subscriptions
      if (typeof sub === 'string') {
        return sub === (plan.id as string);
      }
      return sub.plan === (plan.id as string) &&
             (!sub.status || sub.status === 'active') &&
             (!sub.expiresAt || new Date(sub.expiresAt) > new Date()) &&
             (!sub.currentPeriodEnd || new Date(sub.currentPeriodEnd) > new Date());
    });
    const isFree = displayPrice === 0;
    const isHighlighted = highlightedPlan === plan.id;
    
    // Check if this is Live Recorded and user has Live Weekly (auto access)
    const isLiveRecordedWithAccess = plan.id === SubscriptionPlan.LiveRecorded && 
      hasLiveSubscription && !isCurrentPlan;
    
    // Check Live Weekly access permission
    const isLiveWeeklyPlan = [
      SubscriptionPlan.LiveWeeklyManual,
      SubscriptionPlan.LiveWeeklyRecurring,
    ].includes(plan.id);
    const needsPermission = isLiveWeeklyPlan && !user?.allowLiveWeeklyAccess;
    
    // Check if Master Classes needs Live subscription
    const isMasterClasses = plan.id === SubscriptionPlan.MasterClases;
    const needsLiveSubscription = isMasterClasses && !hasLiveSubscription;

    return (
      <Box
        key={plan.id}
        id={`plan-${plan.id}`}
        sx={{ 
          position: 'relative', 
          height: '100%',
          pt: (needsPermission || needsLiveSubscription || plan.popular || plan.tag || isHighlighted) ? 2 : 0,
        }}
      >
        {/* Badge - Outside the Card */}
        {needsPermission ? (
          <Chip
            label={t('subscriptions.requiresPermission')}
            size="small"
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'grey.600',
              color: 'white',
              fontWeight: 600,
              px: 2,
              zIndex: 10,
            }}
          />
        ) : needsLiveSubscription ? (
          <Chip
            label={t('subscriptions.requiresCommunity', 'Requiere Membresía Live')}
            size="small"
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'warning.main',
              color: 'white',
              fontWeight: 600,
              px: 2,
              zIndex: 10,
            }}
          />
        ) : (plan.popular || plan.tag || isHighlighted) ? (
          <Chip
            label={isHighlighted ? '✨ RECOMENDADO PARA TI' : plan.tag || 'MÁS POPULAR'}
            size="small"
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: isHighlighted ? plan.color : plan.color,
              color: 'white',
              fontWeight: 600,
              px: 2,
              zIndex: 10,
              animation: isHighlighted ? 'shake 0.5s ease-in-out 3' : 'none',
              '@keyframes shake': {
                '0%, 100%': { transform: 'translateX(-50%) rotate(0deg)' },
                '25%': { transform: 'translateX(-50%) rotate(-5deg)' },
                '75%': { transform: 'translateX(-50%) rotate(5deg)' },
              },
            }}
          />
        ) : null}
        
        <Card
          elevation={0}
          sx={{
            height: '100%',
            borderRadius: 3,
            border: '2px solid',
            borderColor: (needsPermission || needsLiveSubscription) ? 'grey.400' : (isHighlighted ? plan.color : plan.popular ? plan.color : 'divider'),
            position: 'relative',
            transition: 'all 0.3s ease',
            backgroundColor: theme.palette.background.paper,
            opacity: (needsPermission || needsLiveSubscription) ? 0.7 : (isCurrentPlan ? 0.8 : 1),
            boxShadow: isHighlighted && !needsPermission && !needsLiveSubscription ? `0 0 20px ${alpha(plan.color, 0.3)}` : 'none',
            animation: isHighlighted && !needsPermission && !needsLiveSubscription ? 'pulse 2s ease-in-out infinite' : 'none',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
                boxShadow: `0 0 20px ${alpha(plan.color, 0.3)}`,
              },
              '50%': {
                transform: 'scale(1.02)',
                boxShadow: `0 0 30px ${alpha(plan.color, 0.5)}`,
              },
              '100%': {
                transform: 'scale(1)',
                boxShadow: `0 0 20px ${alpha(plan.color, 0.3)}`,
              },
            },
            '&:hover': {
              transform: isCurrentPlan ? 'none' : 'translateY(-4px)',
              borderColor: plan.color,
              boxShadow: isCurrentPlan ? theme.shadows[2] : `0 12px 24px ${alpha(plan.color, 0.2)}`,
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Stack spacing={{ xs: 2, sm: 3 }}>
            {/* Header */}
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Box sx={{ color: plan.color, mb: 2 }}>
                {cloneElement(plan.icon as React.ReactElement, { size: 48 })}
              </Box>
              <Typography variant="h5" fontWeight={700}>
                {plan.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {plan.description}
              </Typography>
              {plan.duration ? <Chip
                  icon={<Clock size={16} />}
                  label={plan.duration}
                  size="small"
                  variant="outlined"
                /> : null}
            </Stack>

            {/* Price */}
            <Stack direction="row" alignItems="baseline" justifyContent="center">
              {isFree ? (
                <Stack alignItems="center">
                  <Typography variant="h3" fontWeight={800} color="success.main">
                    {t('subscriptions.free')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('subscriptions.withLiveSubscription')}
                  </Typography>
                </Stack>
              ) : (
                <>
                  {plan.originalPrice && displayPrice < plan.originalPrice ? <Typography
                      variant="h5"
                      color="text.disabled"
                      sx={{ textDecoration: 'line-through', mr: 1 }}
                    >
                      ${plan.originalPrice}
                    </Typography> : null}
                  <Typography variant="h3" fontWeight={800}>
                    ${typeof displayPrice === 'number' ? displayPrice.toFixed(2) : displayPrice}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" ml={1}>
                    {plan.period}
                  </Typography>
                </>
              )}
            </Stack>

            <Divider />

            {/* Features */}
            <List dense sx={{ py: 0 }}>
              {plan.features.map((feature, _index) => (
                <ListItem key={feature.text} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Check
                      size={20}
                      weight="bold"
                      color={feature.included ? theme.palette.success.main : theme.palette.text.disabled}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      feature.tooltip ? (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography
                            variant="body2"
                            color={feature.included ? 'text.primary' : 'text.disabled'}
                          >
                            {feature.text}
                          </Typography>
                          <Tooltip title={feature.tooltip}>
                            <Info size={16} color={theme.palette.info.main} />
                          </Tooltip>
                        </Stack>
                      ) : (
                        feature.text
                      )
                    }
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: feature.included ? 'text.primary' : 'text.disabled',
                        textDecoration: feature.included ? 'none' : 'line-through',
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>

            {/* CTA Button or Access Message */}
            {isLiveRecordedWithAccess ? (
              <Stack spacing={1}>
                <Alert 
                  severity="success" 
                  icon={<Check size={20} />}
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiAlert-message': {
                      width: '100%',
                      textAlign: 'center'
                    }
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {t('subscriptions.alreadyHaveAccess', '¡Ya tienes acceso!')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('subscriptions.includedWithLiveCommunity', 'Incluido con tu membresía Live')}
                  </Typography>
                </Alert>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => window.location.href = '/academy/live-sessions'}
                  sx={{
                    backgroundColor: plan.color,
                    color: 'white',
                    py: 1.5,
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: plan.color,
                      filter: 'brightness(1.1)',
                    },
                  }}
                >
                  {t('subscriptions.goToVideos', 'Ir a los Videos')}
                </Button>
              </Stack>
            ) : (
              <Button
                fullWidth
                variant={(needsPermission || needsLiveSubscription) ? 'outlined' : (plan.popular || isFree ? 'contained' : 'outlined')}
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrentPlan || loadingPlan === plan.id || needsPermission || needsLiveSubscription}
                sx={{
                  borderColor: (needsPermission || needsLiveSubscription) ? 'grey.400' : plan.color,
                  color: (needsPermission || needsLiveSubscription) ? 'text.disabled' : (plan.popular || isFree ? 'white' : plan.color),
                  backgroundColor: (needsPermission || needsLiveSubscription) ? 'transparent' : (plan.popular || isFree ? plan.color : 'transparent'),
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: (needsPermission || needsLiveSubscription) ? 'grey.400' : plan.color,
                    backgroundColor: (needsPermission || needsLiveSubscription) ? 'transparent' : (plan.popular || isFree ? plan.color : alpha(plan.color, 0.08)),
                  },
                  '&.Mui-disabled': {
                    borderColor: (needsPermission || needsLiveSubscription) ? 'grey.400' : undefined,
                    color: (needsPermission || needsLiveSubscription) ? 'text.disabled' : undefined,
                  },
                }}
              >
                {loadingPlan === plan.id
                  ? t('subscriptions.processing')
                  : isCurrentPlan
                  ? t('subscriptions.currentPlan')
                  : needsPermission
                  ? t('subscriptions.contactSupportForAccess')
                  : needsLiveSubscription
                  ? t('subscriptions.joinCommunityFirst', 'Únete a Live Primero')
                  : isFree
                  ? t('subscriptions.activateFree')
                  : t('subscriptions.startNow')}
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
      </Box>
    );
  };

  const filteredPlans = (() => {
    // Filter out CLASSES plan temporarily
    const filteredFixedPlans = FIXED_PLANS.filter(plan => plan.id !== SubscriptionPlan.CLASSES);
    
    switch (selectedView) {
      case 'live':
        return LIVE_PLANS;
      case 'monthly':
        return MONTHLY_PLANS;
      case 'fixed':
        return filteredFixedPlans;
      default:
        return [...LIVE_PLANS, ...MONTHLY_PLANS, ...filteredFixedPlans];
    }
  })();

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', pt: { xs: 6, sm: 8, md: 12 }, pb: { xs: 4, sm: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              letterSpacing: 1.5,
              display: 'block',
              mb: 2,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
            }}
          >
            {t('subscriptions.pricingAndSubscriptions')}
          </Typography>
          <Typography variant="h2" fontWeight={800} sx={{ mb: 3, fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' } }}>
            {t('subscriptions.investInYour', 'Invest in your')}{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('subscriptions.financialEducation', 'Financial Education')}
            </span>
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto', fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }, px: { xs: 2, sm: 0 } }}>
            {t('subscriptions.subtitle')}
          </Typography>
        </Container>
      </Box>

      {/* Filter Section */}
      <Container maxWidth="xl" sx={{ mb: { xs: 3, sm: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', px: { xs: 1, sm: 0 } }}>
          <ToggleButtonGroup
            value={selectedView}
            exclusive
            onChange={(e, value) => value && setSelectedView(value)}
            sx={{
              backgroundColor: theme.palette.action.hover,
              borderRadius: 2,
              p: 0.5,
              minWidth: 'fit-content',
              '& .MuiToggleButton-root': {
                px: { xs: 1.5, sm: 2, md: 3 },
                py: { xs: 1, sm: 1.5 },
                borderRadius: 1.5,
                border: 'none',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  boxShadow: theme.shadows[2],
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                },
              },
            }}
          >
            <ToggleButton value="all" aria-label="todos">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {t('subscriptions.allPlans')}
              </Box>
            </ToggleButton>
            <ToggleButton value="live" aria-label="live">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Lightning size={20} style={{ marginRight: 8 }} />
                <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>{t('subscriptions.liveTrading')}</Box>
              </Box>
            </ToggleButton>
            <ToggleButton value="monthly" aria-label="mensual">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Calendar size={20} style={{ marginRight: 8 }} />
                <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>{t('subscriptions.monthlyBilling')}</Box>
              </Box>
            </ToggleButton>
            <ToggleButton value="fixed" aria-label="fijo">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Certificate size={20} style={{ marginRight: 8 }} />
                <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>{t('account.oneTimePayment')}</Box>
              </Box>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Container>

      {/* Error Alert */}
      {error ? <Container maxWidth="lg" sx={{ mb: 2 }}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Container> : null}

      {/* Pricing Cards */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        {loadingPrices ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Individual Services */}
            <Typography variant="h4" fontWeight={700} sx={{ mb: 4, textAlign: 'center' }}>
              {selectedView === 'all' ? t('subscriptions.allServices') : 
               selectedView === 'live' ? t('subscriptions.liveTradingPlans') :
               selectedView === 'monthly' ? t('subscriptions.monthlySubscriptions') : t('account.oneTimePayment')}
            </Typography>
            <Box sx={{ mt: 4, mb: 2, overflow: 'visible' }}>
              <Grid container spacing={{ xs: 2, sm: 3, md: 3 }} sx={{ overflow: 'visible' }}>
                {filteredPlans.map((plan) => (
                  <Grid 
                    item 
                    xs={12} 
                    md={6}
                    lg={4}
                    key={plan.id}
                    sx={{ overflow: 'visible' }}
                  >
                    {renderPlanCard(plan)}
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        )}

        {/* Conditional Pricing Info */}
        {hasLiveSubscription ? <Alert severity="info" sx={{ mt: 4 }}>
            <Typography variant="body2">
              <strong>¡Beneficios de tu suscripción Live activa!</strong>
              <br />
              • Master Clases: Precio especial de $22.99 (normalmente $199.99)
              <br />
              • Live Grabados: Acceso GRATIS incluido
            </Typography>
          </Alert> : null}

        {/* Trust Indicators */}
        <Box sx={{ mt: { xs: 6, sm: 8, md: 10 }, textAlign: 'center' }}>
          <Grid container spacing={{ xs: 3, sm: 4 }}>
            <Grid item xs={12} md={4}>
              <Certificate size={48} color={theme.palette.primary.main} style={{ marginBottom: 16 }} />
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                {t('subscriptions.trustedByTraders')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('subscriptions.trustedByTradersDesc')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Calendar size={48} color={theme.palette.primary.main} style={{ marginBottom: 16 }} />
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                {t('subscriptions.flexibleAccess')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('subscriptions.flexibleAccessDesc')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Lightning size={48} color={theme.palette.primary.main} style={{ marginBottom: 16 }} />
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                {t('subscriptions.cancelAnytime')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('subscriptions.noContracts')}
              </Typography>
            </Grid>
          </Grid>
        </Box>

      </Container>
    </Box>
  );
}