'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import {
  CreditCard,
  Payment,
  CheckCircle,
  LocalOffer,
  Info,
  ArrowBack,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { getStripePublishableKey } from '@/config/environment';

// Initialize Stripe
const stripePromise = loadStripe(getStripePublishableKey());

interface CheckoutSession {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  eventName?: string;
  eventType?: string;
}

function CheckoutForm({ session }: { session: CheckoutSession }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Return URL will be handled by Stripe
          return_url: `${window.location.origin}/payment/success?session_id=${session.id}`,
        },
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed');
        toast.error(submitError.message || 'Payment failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount); // Already in dollars from API
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        {/* Payment Summary */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
              {t('checkout.orderSummary', 'Order Summary')}
            </Typography>
            <Divider />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1">
                {session.eventName || t('checkout.event', 'Event Registration')}
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary">
                {formatAmount(session.amount, session.currency)}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* BNPL Promotional Message */}
        <Alert 
          severity="info" 
          icon={<LocalOffer />}
          sx={{ 
            backgroundColor: alpha(theme.palette.info.main, 0.1),
            '& .MuiAlert-icon': {
              color: theme.palette.info.main,
            },
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            {t('checkout.bnplMessage', 'Flexible payment options available! Pay in installments with Klarna or finance with Affirm.')}
          </Typography>
        </Alert>

        {/* Payment Methods Section */}
        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {t('checkout.paymentMethod', 'Payment Method')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('checkout.selectPaymentMethod', 'Select your preferred payment method below. All payment options are displayed for your convenience.')}
          </Typography>

          {/* Stripe Payment Element */}
          <PaymentElement 
            options={{
              layout: {
                type: 'accordion',
                defaultCollapsed: false,
                radios: true,
                spacedAccordionItems: true,
              },
              paymentMethodOrder: ['card', 'klarna', 'affirm', 'afterpay_clearpay'],
            }}
          />
        </Box>

        {error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : null}

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
            disabled={isLoading}
            sx={{ minWidth: 150 }}
          >
            {t('checkout.back', 'Back')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={!stripe || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Payment />}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            {isLoading 
              ? t('checkout.processing', 'Processing...') 
              : `${t('checkout.payNow', 'Pay Now')} - ${formatAmount(session.amount, session.currency)}`
            }
          </Button>
        </Stack>

        {/* Security Notice */}
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
          <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
          <Typography variant="caption" color="text.secondary">
            {t('checkout.securePayment', 'Your payment information is secure and encrypted')}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = params.sessionId as string;

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        setError('No session ID provided');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch session details from API
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/checkout-session/${sessionId}`
        );

        const sessionData = response.data;
        
        // For now, redirect to the Stripe hosted checkout if client_secret is not available
        if (!sessionData.client_secret && sessionData.url) {
          window.location.href = sessionData.url;
          return;
        }
        
        if (!sessionData.payment_intent || typeof sessionData.payment_intent !== 'object' || !sessionData.payment_intent.client_secret) {
          // If we don't have a payment intent with client secret, redirect to hosted checkout
          window.location.href = `/api/v1/payments/checkout-redirect/${sessionId}`;
          return;
        }

        setSession({
          id: sessionData.id,
          clientSecret: sessionData.payment_intent.client_secret,
          amount: sessionData.amount_total || 0,
          currency: sessionData.currency || 'usd',
          eventName: sessionData.metadata?.eventName || sessionData.metadata?.eventRegistration === 'true' ? 'Event Registration' : 'Payment',
          eventType: sessionData.metadata?.eventType,
        });
      } catch (err: any) {
        console.error('Error fetching session:', err);
        setError(err.message || 'Failed to load checkout session');
        toast.error('Failed to load checkout session');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchSession();
  }, [sessionId]);

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !session) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="sm">
          <Card>
            <CardContent>
              <Stack spacing={3} alignItems="center" textAlign="center">
                <Typography variant="h5" color="error">
                  {t('checkout.error', 'Checkout Error')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {error || t('checkout.sessionNotFound', 'Checkout session not found')}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push('/')}
                  startIcon={<ArrowBack />}
                >
                  {t('checkout.backToHome', 'Back to Home')}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            {t('checkout.title', 'Complete Your Payment')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('checkout.subtitle', 'Choose your preferred payment method to complete your registration')}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Payment Form */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Elements 
                  stripe={stripePromise} 
                  options={{
                    clientSecret: session.clientSecret,
                    appearance: {
                      theme: theme.palette.mode === 'dark' ? 'night' : 'stripe',
                      variables: {
                        colorPrimary: theme.palette.primary.main,
                        colorBackground: theme.palette.background.paper,
                        colorText: theme.palette.text.primary,
                        colorDanger: theme.palette.error.main,
                        fontFamily: theme.typography.fontFamily,
                        spacingUnit: '4px',
                        borderRadius: '8px',
                      },
                    },
                  }}
                >
                  <CheckoutForm session={session} />
                </Elements>
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Methods Info */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Accepted Payment Methods */}
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {t('checkout.acceptedMethods', 'Accepted Payment Methods')}
                  </Typography>
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CreditCard />
                      <Typography variant="body2">
                        {t('checkout.creditDebit', 'Credit & Debit Cards')}
                      </Typography>
                    </Box>
                    <Box>
                      <Chip 
                        label="Klarna" 
                        size="small" 
                        sx={{ mr: 1, backgroundColor: '#FFB3C7' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {t('checkout.klarnaDesc', 'Pay in 4 interest-free payments')}
                      </Typography>
                    </Box>
                    <Box>
                      <Chip 
                        label="Affirm" 
                        size="small" 
                        sx={{ mr: 1, backgroundColor: '#E8F4FD' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {t('checkout.affirmDesc', 'Monthly payments up to 36 months')}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Why BNPL */}
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Info color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      {t('checkout.whyBNPL', 'Why Buy Now, Pay Later?')}
                    </Typography>
                  </Stack>
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      • {t('checkout.bnplBenefit1', 'Split your purchase into smaller payments')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • {t('checkout.bnplBenefit2', 'No impact on your credit score to apply')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • {t('checkout.bnplBenefit3', 'Instant approval decision')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • {t('checkout.bnplBenefit4', 'Manage payments through provider app')}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}