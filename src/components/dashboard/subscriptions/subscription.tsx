'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation } from '@tanstack/react-query';
import API from '@/lib/axios';

// Load Stripe
const stripePromise = loadStripe('pk_test_51QvTRbJ1acFkbhNINAgp1hOzJSUmN71bYBGppWq5K3rkGFE7pTnX6jzvsXOP5Vrxz6Hr1oSMpzWMJ5jJ0uzTYQI500uJvLtZJ4');

// Define available plans with their Stripe price IDs and features
const subscriptionPlans = [
  {
    name: 'Basic',
    priceId: 'price_1QvUMYJ1acFkbhNIBE0cU9AS',
    price: '$9.99/month',
    features: ['✔ Access to basic features', '✔ Email support', '❌ No advanced reports'],
  },
  {
    name: 'Pro',
    priceId: 'price_1QvjYcJ1acFkbhNIe6LUwM4C',
    price: '$19.99/month',
    features: ['✔ Everything in Basic', '✔ Advanced reports', '✔ Priority support'],
  },
  {
    name: 'Enterprise',
    priceId: 'price_12131415',
    price: '$49.99/month',
    features: ['✔ Everything in Pro', '✔ Custom integrations', '✔ Dedicated account manager'],
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
        console.log('Stripe session response:', response);

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
        Choose Your Plan
      </Typography>

      {/* Show loading spinner when processing */}
      {processingPlan && (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CircularProgress size={80} />
        </Box>
      )}

      {/* Subscription Plans */}
      <Box sx={{ display: 'flex', gap: 3, width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
        {subscriptionPlans.map(({ name, priceId, price, features }) => (
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
                {name}
              </Typography>
              <Typography variant="h6" sx={{ color: 'yellow', mb: 2 }}>
                {price}
              </Typography>

              {/* Features List */}
              {features.map((feature, index) => (
                <Typography key={index} sx={{ mb: 1 }}>
                  {feature}
                </Typography>
              ))}

              {userSubscriptions.includes(name) ? (
                <Typography color="success.main">Active</Typography>
              ) : (
                <Button
                  variant="contained"
                  sx={{ mt: 2,color: 'white' }}
                  disabled={processingPlan === name}
                  onClick={() => subscribe({ plan: name, priceId })}
                >
                  {processingPlan === name ? 'Processing...' : `Upgrade to ${name}`}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
