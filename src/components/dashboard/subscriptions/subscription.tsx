'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation } from '@tanstack/react-query';

import { SubscriptionPlan } from '@/types/user';
import API from '@/lib/axios';

// Load Stripe
const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);

// Define available plans with their Stripe price IDs and features
const subscriptionPlans = [
  {
    name: SubscriptionPlan.MENTORSHIP,
    title: 'Mentorías',
    priceId: 'price_1Qz2KuE0taYR7njR00NmGEJu', //This is Prod
    // priceId: 'price_1Qy0JcJ1acFkbhNI4q0axjLX',
    price: '$22.99/mes',
    features: ['✔ Acceso a mentorías'],
  },
  {
    name: SubscriptionPlan.CLASS,
    title: 'Clases',
    priceId: 'price_1R5wSRE0taYR7njRd270eE8O',
    price: '$53.99/mes',
    features: ['✔ Acceso a las clases diarias grabadas'],
  },
];

export function SubscriptionManager(): React.JSX.Element {
  const userSubscriptions = useAuthStore((state) => state.user?.subscriptions || []);
  const userId = useAuthStore((state) => state.user?._id); // Fetch user ID from Zustand store

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
        {subscriptionPlans.map(({ name, title, priceId, price, features }) => {
          const isActive = userSubscriptions.includes(name);

          return (
            <Card
              key={name}
              sx={{
                width: '100%', // Full width
                maxWidth: 350,
                textAlign: 'center',
                backgroundColor: 'black', // Black background
                color: 'white', // White text
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

                {/* Features List */}
                {features.map((feature) => (
                  <Typography key={feature} sx={{ mb: 1 }}>
                    {feature}
                  </Typography>
                ))}

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
}
