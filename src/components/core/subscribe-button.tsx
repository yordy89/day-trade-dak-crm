'use client';

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SubscribeButton({ priceId }: { priceId: string }) {
  const handleSubscribe = async () => {
    const stripe = await stripePromise;
    const response = await fetch('/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user123', priceId }),
    });

    const sessionUrl = await response.text();
    await stripe?.redirectToCheckout({ sessionId: sessionUrl });
  };

  return <button onClick={handleSubscribe}>Subscribe</button>;
}
