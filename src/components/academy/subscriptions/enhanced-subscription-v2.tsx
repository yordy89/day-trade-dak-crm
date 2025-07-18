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
  Skeleton,
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
  MenuBook,
  Groups,
} from '@mui/icons-material';
import { useClientAuth } from '@/hooks/use-client-auth';
import { SubscriptionPlan } from '@/types/user';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation, useQuery } from '@tanstack/react-query';
import API from '@/lib/axios';
import { subscriptionService, type SubscriptionPlanData, type CalculatedPrice } from '@/services/api/subscription.service';
import { useTranslation } from 'react-i18next';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Icon mapping
const iconComponents = {
  LiveTv,
  Loop,
  School,
  VideoLibrary,
  Star,
  Psychology,
  MoneyOff,
  Groups,
  MenuBook,
};

export function EnhancedSubscriptionManagerV2() {
  const { user } = useClientAuth();
  const { i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'es';
  const userSubscriptions = user?.subscriptions || [];
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch plans from API
  const { data: plansData, isLoading: plansLoading, error: plansError } = useQuery({
    queryKey: ['subscription-plans', lang],
    queryFn: () => subscriptionService.getPublicPlans(lang),
  });

  // Fetch user-specific pricing if authenticated
  const { data: pricingData, isLoading: pricingLoading } = useQuery({
    queryKey: ['subscription-pricing', user?._id],
    queryFn: () => subscriptionService.getPlansWithPricing(),
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

  const getIcon = (iconName: string) => {
    const IconComponent = iconComponents[iconName as keyof typeof iconComponents] || Star;
    return IconComponent;
  };

  const getPlanPrice = (planId: string): CalculatedPrice | undefined => {
    return pricingData?.pricing.find(p => (p.plan as string) === planId);
  };

  const isSubscribed = (planId: string) => {
    return userSubscriptions.includes(planId as unknown as SubscriptionPlan);
  };

  const hasLiveSubscription = (): boolean => {
    return userSubscriptions.includes(SubscriptionPlan.LiveWeeklyManual as string) ||
           userSubscriptions.includes(SubscriptionPlan.LiveWeeklyRecurring as string);
  };

  const renderPriceTag = (plan: SubscriptionPlanData, price?: CalculatedPrice) => {
    if (!price && pricingLoading) {
      return <Skeleton variant="text" width={100} height={40} />;
    }

    if (!price) {
      // No user-specific pricing available, show base price
      const amount = subscriptionService.formatPrice(plan.pricing.baseAmount, plan.pricing.currency);
      const period = subscriptionService.getBillingPeriod(plan.pricing.interval, plan.pricing.intervalCount, lang);
      
      return (
        <Stack spacing={0.5}>
          <Stack direction="row" alignItems="baseline">
            <Typography variant="h4" fontWeight="bold">
              {amount}
            </Typography>
            <Typography variant="body1" color="text.secondary" ml={0.5}>
              {period}
            </Typography>
          </Stack>
        </Stack>
      );
    }

    if (price.isFree) {
      return (
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight="bold" color="success.main">
            FREE
          </Typography>
          <Typography variant="caption" color="success.dark">
            {price.discountReason}
          </Typography>
        </Stack>
      );
    }

    const period = subscriptionService.getBillingPeriod(plan.pricing.interval, plan.pricing.intervalCount, lang);

    return (
      <Stack spacing={0.5}>
        {price.discount > 0 && (
          <Typography
            variant="body2"
            sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
          >
            ${price.originalPrice}
          </Typography>
        )}
        <Stack direction="row" alignItems="baseline">
          <Typography variant="h4" fontWeight="bold">
            ${price.finalPrice}
          </Typography>
          <Typography variant="body1" color="text.secondary" ml={0.5}>
            {period}
          </Typography>
        </Stack>
        {price.discountReason ? <Chip
            label={price.discountReason}
            size="small"
            color="success"
            variant="outlined"
          /> : null}
      </Stack>
    );
  };

  if (plansLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" mt={2}>Loading subscription plans...</Typography>
      </Box>
    );
  }

  if (plansError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load subscription plans. Please try again later.
        </Alert>
      </Box>
    );
  }

  const plans = plansData || [];
  const livePlans = plans.filter(p => p.planId.includes('Live'));
  const monthlyPlans = plans.filter(p => p.pricing.interval === 'monthly');
  const fixedPlans = plans.filter(p => p.pricing.interval === 'once');

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
        {livePlans.length > 0 ? (
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight="600" mb={2}>
              Live Trading Access
            </Typography>
            <Grid container spacing={3}>
              {livePlans.map((plan) => {
                const price = getPlanPrice(plan.planId);
                const subscribed = isSubscribed(plan.planId);
                const IconComponent = getIcon(plan.uiMetadata.icon);
                
                return (
                  <Grid item xs={12} md={6} key={plan.planId}>
                    <Card
                      sx={{
                        height: '100%',
                        position: 'relative',
                        border: plan.uiMetadata.popular ? '2px solid' : '1px solid',
                        borderColor: plan.uiMetadata.popular ? plan.uiMetadata.color : 'divider',
                      }}
                    >
                      {plan.uiMetadata.badge ? (
                        <Chip
                          label={plan.uiMetadata.badge}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: -12,
                            right: 20,
                            backgroundColor: plan.uiMetadata.color,
                            color: 'white',
                          }}
                        />
                      ) : null}
                      
                      <CardContent>
                        <Stack spacing={3}>
                          <Box>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Box sx={{ color: plan.uiMetadata.color }}>
                                <IconComponent />
                              </Box>
                              <Typography variant="h6" fontWeight="600">
                                {plan.displayName}
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
                                key={`${plan.planId}-feature-${feature}`}
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 1 }}
                              >
                                <CheckCircle 
                                  sx={{ 
                                    fontSize: 16, 
                                    color: 'text.secondary' 
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
                              onClick={() => subscribe({ plan: plan.planId as SubscriptionPlan })}
                              disabled={processingPlan === plan.planId || !user}
                              sx={{
                                backgroundColor: plan.uiMetadata.color,
                                '&:hover': {
                                  backgroundColor: plan.uiMetadata.color,
                                  filter: 'brightness(0.9)',
                                },
                              }}
                            >
                              {processingPlan === plan.planId ? (
                                <CircularProgress size={24} sx={{ color: 'white' }} />
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
        ) : null}

        {/* Monthly Subscriptions */}
        {monthlyPlans.length > 0 ? (
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight="600" mb={2}>
              Monthly Subscriptions
            </Typography>
            <Grid container spacing={3}>
              {monthlyPlans.map((plan) => {
                const price = getPlanPrice(plan.planId);
                const subscribed = isSubscribed(plan.planId);
                const IconComponent = getIcon(plan.uiMetadata.icon);
                
                return (
                  <Grid item xs={12} sm={6} lg={3} key={plan.planId}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Stack spacing={3}>
                          <Box>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Box sx={{ color: plan.uiMetadata.color }}>
                                <IconComponent />
                              </Box>
                              <Typography variant="h6" fontWeight="600">
                                {plan.displayName}
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
                                key={`${plan.planId}-feature-${feature}`}
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
                              onClick={() => subscribe({ plan: plan.planId as SubscriptionPlan })}
                              disabled={processingPlan === plan.planId || Boolean(price?.isFree) || !user}
                              sx={{
                                backgroundColor: plan.uiMetadata.color,
                                '&:hover': {
                                  backgroundColor: plan.uiMetadata.color,
                                  filter: 'brightness(0.9)',
                                },
                              }}
                            >
                              {processingPlan === plan.planId ? (
                                <CircularProgress size={20} sx={{ color: 'white' }} />
                              ) : (price?.isFree ? (
                                'Included with Live'
                              ) : (
                                'Subscribe'
                              ))}
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
        ) : null}

        {/* Fixed-Term Courses */}
        {fixedPlans.length > 0 ? (
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight="600" mb={2}>
              Special Courses
            </Typography>
            <Grid container spacing={3}>
              {fixedPlans.map((plan) => {
                const price = getPlanPrice(plan.planId);
                const subscribed = isSubscribed(plan.planId);
                const IconComponent = getIcon(plan.uiMetadata.icon);
                
                return (
                  <Grid item xs={12} md={6} key={plan.planId}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Stack spacing={3}>
                          <Box>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Box sx={{ color: plan.uiMetadata.color }}>
                                <IconComponent />
                              </Box>
                              <Typography variant="h6" fontWeight="600">
                                {plan.displayName}
                              </Typography>
                              {plan.uiMetadata.badge ? (
                                <Chip
                                  label={plan.uiMetadata.badge}
                                  size="small"
                                  color="warning"
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
                                key={`${plan.planId}-feat-${feature}`}
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
                              onClick={() => subscribe({ plan: plan.planId as SubscriptionPlan })}
                              disabled={processingPlan === plan.planId || !user}
                              sx={{
                                backgroundColor: plan.uiMetadata.color,
                                '&:hover': {
                                  backgroundColor: plan.uiMetadata.color,
                                  filter: 'brightness(0.9)',
                                },
                              }}
                            >
                              {processingPlan === plan.planId ? (
                                <CircularProgress size={24} sx={{ color: 'white' }} />
                              ) : (
                                'Get Access'
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
        ) : null}
      </Grid>

      {!user ? (
        <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body1" gutterBottom>
            Please sign in to subscribe to a plan
          </Typography>
          <Button variant="contained" href="/auth/login" sx={{ mt: 1 }}>
            Sign In
          </Button>
        </Box>
      ) : null}
    </Box>
  );
}