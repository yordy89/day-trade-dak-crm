import { loadStripe, Stripe, StripeElementsOptions } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export interface CreateCheckoutSessionParams {
  priceId: string;
  mode?: 'payment' | 'subscription';
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
  paymentMethodTypes?: string[];
  customerEmail?: string;
  trialDays?: number;
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  const data = await response.json();
  return data;
}

export async function redirectToCheckout(sessionId: string) {
  const stripe = await getStripe();
  if (!stripe) throw new Error('Stripe not loaded');

  const { error } = await stripe.redirectToCheckout({ sessionId });
  
  if (error) {
    console.error('Stripe redirect error:', error);
    throw error;
  }
}

export function getStripeElementsOptions(theme: 'dark' | 'light'): StripeElementsOptions {
  return {
    appearance: {
      theme: theme === 'dark' ? 'night' : 'stripe',
      variables: {
        colorPrimary: '#16a34a',
        colorBackground: theme === 'dark' ? '#141414' : '#ffffff',
        colorText: theme === 'dark' ? '#ffffff' : '#000000',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '8px',
      },
      rules: {
        '.Label': {
          marginBottom: '8px',
        },
        '.Input': {
          padding: '12px',
          boxShadow: 'none',
          border: '1px solid',
          borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        },
        '.Input:focus': {
          borderColor: '#16a34a',
          boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)',
        },
      },
    },
  };
}

// BNPL-specific configurations
export const BNPL_PAYMENT_METHODS = {
  klarna: {
    name: 'Klarna',
    description: 'Buy now, pay later with Klarna',
    countries: ['US', 'CA', 'GB', 'DE', 'AT', 'NL', 'BE', 'ES', 'IT', 'FR', 'FI', 'SE', 'NO', 'DK'],
    minAmount: 3500, // $35.00 in cents
    maxAmount: 100000, // $1,000.00 in cents
  },
  afterpay_clearpay: {
    name: 'Afterpay',
    description: 'Split your purchase into 4 interest-free payments',
    countries: ['US', 'CA', 'AU', 'NZ', 'GB'],
    minAmount: 100, // $1.00 in cents
    maxAmount: 200000, // $2,000.00 in cents
  },
  affirm: {
    name: 'Affirm',
    description: 'Monthly payments with Affirm',
    countries: ['US', 'CA'],
    minAmount: 5000, // $50.00 in cents
    maxAmount: 3000000, // $30,000.00 in cents
  },
};

export function getAvailableBNPLMethods(amount: number, country: string): string[] {
  const available: string[] = [];

  Object.entries(BNPL_PAYMENT_METHODS).forEach(([key, config]) => {
    if (
      config.countries.includes(country) &&
      amount >= config.minAmount &&
      amount <= config.maxAmount
    ) {
      available.push(key);
    }
  });

  return available;
}