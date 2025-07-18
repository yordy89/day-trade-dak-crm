'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  Star,
  Loop,
  MoneyOff,
  School,
  Psychology,
  VideoLibrary,
  LiveTv,
  Timer,
} from '@mui/icons-material';
import { useClientAuth } from '@/hooks/use-client-auth';
import { SubscriptionPlan } from '@/types/user';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation, useQuery } from '@tanstack/react-query';
import API from '@/lib/axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PlanPrice {
  plan: SubscriptionPlan;
  originalPrice: number;
  finalPrice: number;
  discount: number;
  discountReason?: string;
  currency: string;
  isFree: boolean;
}

interface SubscriptionPlanConfig {
  id: SubscriptionPlan;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  billingType: 'monthly' | 'weekly' | 'fixed';
  duration?: string;
  popular?: boolean;
  badge?: string;
}

const subscriptionPlans: SubscriptionPlanConfig[] = [
  {
    id: SubscriptionPlan.LiveWeeklyManual,
    name: 'Live Trading - Weekly',
    description: 'Access daily live trading sessions for 7 days',
    icon: <LiveTv />,
    color: '#ef4444',
    billingType: 'weekly',
    duration: '7 days',
    features: [
      'Daily live trading sessions',
      'Real-time market analysis',
      'Q&A with professional traders',
      'Trading signals',
      'Manual renewal required',
    ],
  },
  {
    id: SubscriptionPlan.LiveWeeklyRecurring,
    name: 'Live Trading - Auto Renew',
    description: 'Continuous access to daily live trading sessions',
    icon: <Loop />,
    color: '#f59e0b',
    billingType: 'weekly',
    popular: true,
    badge: 'BEST VALUE',
    features: [
      'All Live Trading features',
      'Auto-renews every week',
      'Never miss a session',
      'Cancel anytime',
      'Priority support',
    ],
  },
  {
    id: SubscriptionPlan.MasterClases,
    name: 'Master Class',
    description: 'Comprehensive trading education program',
    icon: <School />,
    color: '#8b5cf6',
    billingType: 'monthly',
    features: [
      'All trading courses',
      'Weekly group mentoring',
      'Trading strategies library',
      'Market analysis tools',
      'Community access',
    ],
  },
  {
    id: SubscriptionPlan.CLASSES,
    name: 'Recorded Classes',
    description: 'Access to all recorded trading classes',
    icon: <VideoLibrary />,
    color: '#3b82f6',
    billingType: 'monthly',
    features: [
      'All recorded classes',
      'New classes added weekly',
      'Download for offline viewing',
      'Class notes and materials',
      'Free with Live subscription!',
    ],
  },
  {
    id: SubscriptionPlan.LiveRecorded,
    name: 'Personal Mentorship',
    description: 'One-on-one guidance from expert traders',
    icon: <Star />,
    color: '#10b981',
    billingType: 'monthly',
    features: [
      '1-on-1 weekly sessions',
      'Personalized trading plan',
      'Portfolio review',
      'Direct mentor support',
      'Advanced strategies',
    ],
  },
  {
    id: SubscriptionPlan.PSICOTRADING,
    name: 'Trading Psychology',
    description: 'Master your emotions and mindset',
    icon: <Psychology />,
    color: '#06b6d4',
    billingType: 'monthly',
    features: [
      'Psychology workshops',
      'Emotional control techniques',
      'Mindfulness for traders',
      'Stress management',
      'Performance coaching',
    ],
  },
  {
    id: SubscriptionPlan.PeaceWithMoney,
    name: 'Peace with Money',
    description: '60-day transformational program',
    icon: <MoneyOff />,
    color: '#16a34a',
    billingType: 'fixed',
    duration: '60 days',
    features: [
      'Complete financial mindset course',
      'Daily exercises and meditations',
      'Money relationship healing',
      'Abundance mindset training',
      '60-day access',
    ],
  },
];

export function EnhancedSubscriptionManager() {
  const { user } = useClientAuth();
  const userSubscriptions = user?.subscriptions || [];
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [_selectedPaymentMethods, _setSelectedPaymentMethods] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch plan prices with conditional pricing
  const { data: planPrices, isLoading: pricesLoading } = useQuery({
    queryKey: ['plan-prices'],
    queryFn: async () => {
      const response = await API.get('/payments/plan-prices');
      return response.data as PlanPrice[];
    },
    enabled: Boolean(user),
  });

  // Subscribe mutation
  const { mutate: subscribe } = useMutation({
    mutationFn: async ({ 
      plan, 
      paymentMethods 
    }: { 
      plan: SubscriptionPlan; 
      paymentMethods?: string[] 
    }) => {
      setProcessingPlan(plan);
      
      const response = await API.post('/payments/checkout/enhanced', {
        plan,
        paymentMethods: paymentMethods || ['card'],
      });

      if (!response.data.sessionId) {
        throw new Error('Failed to create checkout session');
      }
      
      return response.data;
    },
    onSuccess: async (data) => {
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
    },
    onError: (err) => {
      console.error('Subscription error:', err);
      setError('Failed to create subscription. Please try again.');
    },
    onSettled: () => {
      setProcessingPlan(null);
      setError(null);
    },
  });

  const getPlanPrice = (planId: SubscriptionPlan) => {
    return planPrices?.find(p => p.plan === planId);
  };

  const isSubscribed = (planId: SubscriptionPlan) => {
    return userSubscriptions.includes(planId);
  };

  const hasLiveSubscription = () => {
    return userSubscriptions.includes(SubscriptionPlan.LiveWeeklyManual) ||
           userSubscriptions.includes(SubscriptionPlan.LiveWeeklyRecurring);
  };

  const renderPriceTag = (plan: SubscriptionPlanConfig, price?: PlanPrice) => {
    if (!price) {
      return (
        <CircularProgress size={20} />
      );
    }

    if (price.isFree) {
      return (
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight="bold" color="success.main">
            FREE
          </Typography>
          <Typography variant="caption" color="success.dark">
            with Live subscription
          </Typography>
        </Stack>
      );
    }

    const billingPeriod = plan.billingType === 'weekly' ? '/week' : 
                         plan.billingType === 'monthly' ? '/month' : '';

    return (
      <Stack spacing={0.5}>
        {price.discount > 0 ? (
          <Typography
            variant="body2"
            sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
          >
            ${price.originalPrice}
          </Typography>
        ) : null}
        <Stack direction="row" alignItems="baseline">
          <Typography variant="h4" fontWeight="bold">
            ${price.finalPrice}
          </Typography>
          <Typography variant="body1" color="text.secondary" ml={0.5}>
            {billingPeriod}
          </Typography>
        </Stack>
        {price.discountReason ? (
          <Chip
            label={price.discountReason}
            size="small"
            color="success"
            variant="outlined"
          />
        ) : null}
      </Stack>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Choose Your Trading Journey
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {hasLiveSubscription() ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          <strong>Live Subscriber Benefits:</strong> You get special pricing on Master Class 
          and FREE access to Recorded Classes!
        </Alert>
      ) : null}

      <Grid container spacing={3}>
        {/* Live Trading Section */}
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight="600" mb={2}>
            Live Trading Access
          </Typography>
          <Grid container spacing={3}>
            {subscriptionPlans
              .filter(plan => plan.id.includes('LIVE'))
              .map((plan) => {
                const price = getPlanPrice(plan.id);
                const subscribed = isSubscribed(plan.id);
                
                return (
                  <Grid item xs={12} md={6} key={plan.id}>
                    <Card
                      sx={{
                        height: '100%',
                        position: 'relative',
                        border: plan.popular ? '2px solid' : '1px solid',
                        borderColor: plan.popular ? plan.color : 'divider',
                      }}
                    >
                      {plan.badge ? (
                        <Chip
                          label={plan.badge}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: -12,
                            right: 20,
                            backgroundColor: plan.color,
                            color: 'white',
                          }}
                        />
                      ) : null}
                      
                      <CardContent>
                        <Stack spacing={3}>
                          <Box>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Box sx={{ color: plan.color }}>
                                {plan.icon}
                              </Box>
                              <Typography variant="h6" fontWeight="600">
                                {plan.name}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                              {plan.description}
                            </Typography>
                          </Box>

                          {renderPriceTag(plan, price)}

                          <Box>
                            {plan.features.map((feature) => (
                              <Stack
                                key={`${plan.id}-feature-${feature}`}
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 1 }}
                              >
                                <CheckCircle 
                                  sx={{ 
                                    fontSize: 16, 
                                    color: (plan.id as string) === (SubscriptionPlan.CLASSES as string) && hasLiveSubscription() 
                                      ? 'success.main' 
                                      : 'text.secondary' 
                                  }} 
                                />
                                <Typography variant="body2">
                                  {feature}
                                </Typography>
                              </Stack>
                            ))}
                          </Box>

                          {subscribed ? (
                            <Button
                              variant="contained"
                              disabled
                              fullWidth
                              sx={{ backgroundColor: 'success.main' }}
                            >
                              ✓ Active
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => subscribe({ plan: plan.id })}
                              disabled={processingPlan === plan.id || pricesLoading}
                              sx={{
                                backgroundColor: plan.color,
                                '&:hover': {
                                  backgroundColor: plan.color,
                                  filter: 'brightness(0.9)',
                                },
                              }}
                            >
                              {processingPlan === plan.id ? (
                                <CircularProgress size={24} sx={{ color: 'white' }} />
                              ) : (
                                `Subscribe${plan.duration ? ` - ${plan.duration}` : ''}`
                              )}
                            </Button>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </Grid>

        {/* Monthly Subscriptions */}
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight="600" mb={2}>
            Monthly Subscriptions
          </Typography>
          <Grid container spacing={3}>
            {subscriptionPlans
              .filter(plan => plan.billingType === 'monthly')
              .map((plan) => {
                const price = getPlanPrice(plan.id);
                const subscribed = isSubscribed(plan.id);
                
                return (
                  <Grid item xs={12} sm={6} lg={3} key={plan.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Stack spacing={3}>
                          <Box>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Box sx={{ color: plan.color }}>
                                {plan.icon}
                              </Box>
                              <Typography variant="h6" fontWeight="600">
                                {plan.name}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                              {plan.description}
                            </Typography>
                          </Box>

                          {renderPriceTag(plan, price)}

                          <Box>
                            {plan.features.slice(0, 3).map((feature) => (
                              <Stack
                                key={`${plan.id}-f-${feature}`}
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 0.5 }}
                              >
                                <CheckCircle sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption">
                                  {feature}
                                </Typography>
                              </Stack>
                            ))}
                          </Box>

                          {subscribed ? (
                            <Button
                              variant="outlined"
                              disabled
                              fullWidth
                              size="small"
                            >
                              ✓ Active
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              fullWidth
                              size="small"
                              onClick={() => subscribe({ plan: plan.id })}
                              disabled={processingPlan === plan.id || pricesLoading || price?.isFree}
                              sx={{
                                backgroundColor: plan.color,
                                '&:hover': {
                                  backgroundColor: plan.color,
                                  filter: 'brightness(0.9)',
                                },
                              }}
                            >
                              {processingPlan === plan.id ? (
                                <CircularProgress size={20} sx={{ color: 'white' }} />
                              ) : price?.isFree ? (
                                'Included with Live'
                              ) : (
                                'Subscribe'
                              )}
                            </Button>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </Grid>

        {/* Fixed-Term Courses */}
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight="600" mb={2}>
            Special Courses
          </Typography>
          <Grid container spacing={3}>
            {subscriptionPlans
              .filter(plan => plan.billingType === 'fixed')
              .map((plan) => {
                const price = getPlanPrice(plan.id);
                const subscribed = isSubscribed(plan.id);
                
                return (
                  <Grid item xs={12} md={6} key={plan.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Stack spacing={3}>
                          <Box>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Box sx={{ color: plan.color }}>
                                {plan.icon}
                              </Box>
                              <Typography variant="h6" fontWeight="600">
                                {plan.name}
                              </Typography>
                              {plan.duration ? (
                                <Chip
                                  label={plan.duration}
                                  size="small"
                                  icon={<Timer fontSize="small" />}
                                />
                              ) : null}
                            </Stack>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                              {plan.description}
                            </Typography>
                          </Box>

                          {renderPriceTag(plan, price)}

                          <Box>
                            {plan.features.map((feature) => (
                              <Stack
                                key={`${plan.id}-feat-${feature}`}
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 1 }}
                              >
                                <CheckCircle sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2">
                                  {feature}
                                </Typography>
                              </Stack>
                            ))}
                          </Box>

                          {subscribed ? (
                            <Button
                              variant="contained"
                              disabled
                              fullWidth
                              sx={{ backgroundColor: 'success.main' }}
                            >
                              ✓ Active
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => subscribe({ plan: plan.id })}
                              disabled={processingPlan === plan.id || pricesLoading}
                              sx={{
                                backgroundColor: plan.color,
                                '&:hover': {
                                  backgroundColor: plan.color,
                                  filter: 'brightness(0.9)',
                                },
                              }}
                            >
                              {processingPlan === plan.id ? (
                                <CircularProgress size={24} sx={{ color: 'white' }} />
                              ) : (
                                `Get Access - ${plan.duration}`
                              )}
                            </Button>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}

            {/* Master Course Card */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }}
              >
                <CardContent>
                  <Stack spacing={3}>
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <School />
                        <Typography variant="h6" fontWeight="600">
                          Master Trading Course
                        </Typography>
                        <Chip
                          label="NEW"
                          size="small"
                          color="warning"
                        />
                      </Stack>
                      <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                        Comprehensive professional trading program
                      </Typography>
                    </Box>

                    <Stack spacing={0.5}>
                      <Typography variant="h4" fontWeight="bold">
                        $999
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        One-time payment
                      </Typography>
                    </Stack>

                    <Box>
                      {[
                        'Lifetime access',
                        'Professional strategies',
                        'Live trading labs',
                        'Certificate of completion',
                        'BNPL options available',
                      ].map((feature) => (
                        <Stack
                          key={feature}
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          <CheckCircle sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            {feature}
                          </Typography>
                        </Stack>
                      ))}
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      href="/master-course"
                      sx={{
                        backgroundColor: 'white',
                        color: '#667eea',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}