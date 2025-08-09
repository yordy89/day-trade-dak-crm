'use client';

import * as React from 'react';
import { useClientAuth } from '@/hooks/use-client-auth';
import { Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation } from '@tanstack/react-query';

import { SubscriptionPlan } from '@/types/user';
import API from '@/lib/axios';
import { getStripePublishableKey } from '@/config/environment';

// Load Stripe
const stripePromise = loadStripe(getStripePublishableKey());

// Define available plans with their Stripe price IDs and features
const subscriptionPlans = [
  {
    name: SubscriptionPlan.LiveRecorded,
    title: 'Mentorías',
    priceId: 'price_1RTnbQE0taYR7njRttjfaMqy', //This is Prod
    // priceId: 'price_1Qy0JcJ1acFkbhNI4q0axjLX', // This is dev
    price: '$499.99/mes',
    features: ['✔ Acceso a mentorías'],
    type: 'subscription',
  },
  {
    name: SubscriptionPlan.CLASSES,
    title: 'Clases',
    priceId: 'price_1R5wSRE0taYR7njRd270eE8O', //This is prod
    // priceId: 'price_1R5bWkJ1acFkbhNIFMuDqkMj', // This is dev
    price: '$52.99/mes',
    features: ['✔ Acceso a las clases diarias grabadas'],
    type: 'subscription',
  },
  {
    name: SubscriptionPlan.PSICOTRADING,
    title: 'PsicoTrading',
    priceId: 'price_1RMx9KE0taYR7njRSoew9Cq1', //This is Prod
    // priceId: 'price_1RNIS6J1acFkbhNIyPeQVOAS', //This is dev
    price: '$29.99/mes',
    features: ['✔ Acceso a las mentorias de PsicoTrading'],
    type: 'subscription',
  },
  {
    name: SubscriptionPlan.PeaceWithMoney,
    title: 'Paz con el Dinero',
    description: 'Acceso disponible durante 60 días a partir de la fecha de suscripción.',
    priceId: 'price_1RX5z8E0taYR7njRaC7mXbqn', //This is Prod
    // priceId: 'price_1RX2hDJ1acFkbhNIq4mDa1Js', //This is dev
    price: '$199.99',
    features: ['✔ Acceso al curso de Paz con el dinero.'],
    type: 'fixed',
  },
];

export function SubscriptionManager(): React.JSX.Element {
  const { user } = useClientAuth();
  const userSubscriptions = user?.subscriptions || [];
  const userId = user?._id; // Fetch user ID from auth hook

  // Local state to track which plan is being processed
  const [processingPlan, setProcessingPlan] = React.useState<string | null>(null);

  // React Query mutation for subscribing
  const { mutate: subscribe } = useMutation({
    mutationFn: async ({ plan, priceId }: { plan: string; priceId: string }) => {
      setProcessingPlan(plan); // Set loading state for this plan
      try {
        const response = await API.post('/payments/checkout', { userId, plan, priceId });

        if (!response.data.sessionId) {
          throw new Error('Stripe session creation failed');
        }
        return response.data.sessionId;
      } catch (error) {
        console.error('Error creating subscription:', error);
        throw error;
      }
    },
    onSuccess: async (sessionId) => {
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    },
    onError: (error) => {
      console.error('Subscription error:', error);
    },
    onSettled: () => {
      setProcessingPlan(null); // Reset loading state after completion
    },
  });

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ mb: 3, color: 'white' }}>
        Elige tu Plan
      </Typography>

      {/* Subscription Plans */}
      <Box sx={{ display: 'flex', gap: 3, width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
        {['subscription', 'fixed'].map((planType) => {
          const groupTitle = planType === 'subscription' ? 'Suscripciones Mensuales' : 'Planes Fijos';

          const plansToShow = subscriptionPlans.filter((plan) => plan.type === planType);

          return (
            <Box key={planType} sx={{ width: '100%', mb: 5 }}>
              <Typography variant="h5" sx={{ mb: 2, color: 'black', textAlign: 'left' }}>
                {groupTitle}
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, width: '100%', flexWrap: 'wrap' }}>
                {plansToShow.map(({ name, title, description, priceId, price, features }) => {
                  const isActive = userSubscriptions.includes(name);

                  return (
                    <Card
                      key={name}
                      sx={{
                        width: '100%',
                        maxWidth: 350,
                        textAlign: 'center',
                        backgroundColor: 'black',
                        color: 'white',
                        borderRadius: 3,
                        p: 3,
                        boxShadow: 3,
                      }}
                    >
                      <CardContent>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {title}
                        </Typography>

                        <Typography variant="h6" sx={{ color: 'yellow', mb: 2 }}>
                          {price}
                        </Typography>

                        {features.map((feature) => (
                          <Typography key={feature} sx={{ mb: 1 }}>
                            {feature}
                          </Typography>
                        ))}
                        {description ? <Typography sx={{ color: 'error.main', mt: 1, fontStyle: 'italic' }}>
                            {description}
                          </Typography> : null}

                        {isActive ? (
                          <Typography sx={{ color: 'success.main', mt: 2, fontWeight: 'bold' }}>✅ Activa</Typography>
                        ) : (
                          <Button
                            variant="contained"
                            sx={{ mt: 2, color: 'white', minWidth: 160 }}
                            disabled={processingPlan === name}
                            onClick={() => subscribe({ plan: name, priceId })}
                          >
                            {processingPlan === name ? (
                              <CircularProgress size={24} sx={{ color: 'white' }} />
                            ) : (
                              `Mejorar a ${title}`
                            )}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
