import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  // Initialize Stripe inside the function to avoid build-time errors
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeSecretKey) {
    console.error('Stripe secret key not configured');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }
  
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-08-27.basil',
  });
  try {
    const body = await request.json();
    const { priceId, mode, successUrl, cancelUrl, metadata, paymentMethodTypes } = body;

    // Configure payment method types including BNPL options
    const configuredPaymentMethods = paymentMethodTypes || ['card'];
    
    // Add BNPL options if available for the customer's location
    const bnplMethods: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = [];
    
    // Klarna is available in many countries
    if (configuredPaymentMethods.includes('klarna')) {
      bnplMethods.push('klarna');
    }
    
    // Afterpay/Clearpay is available in US, CA, AU, NZ, UK
    if (configuredPaymentMethods.includes('afterpay_clearpay')) {
      bnplMethods.push('afterpay_clearpay');
    }
    
    // Affirm is available in US and CA
    if (configuredPaymentMethods.includes('affirm')) {
      bnplMethods.push('affirm');
    }

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card', ...bnplMethods],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode || 'subscription',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/academy/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/academy/subscription/plans`,
      metadata: metadata || {},
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_email: metadata?.email,
      // Enable BNPL-specific options
      payment_intent_data: mode === 'payment' ? {
        capture_method: 'automatic',
      } : undefined,
      subscription_data: mode === 'subscription' ? {
        trial_period_days: metadata?.trial_days || 0,
        metadata: {
          ...metadata,
          source: 'web_checkout',
        },
      } : undefined,
    };

    // Add shipping for physical products if needed
    if (metadata?.requiresShipping) {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ['US', 'CA', 'MX', 'ES', 'GB', 'FR', 'DE', 'IT'],
      };
      sessionConfig.shipping_options = [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}