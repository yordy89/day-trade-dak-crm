import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  // Initialize Stripe inside the function to avoid build-time errors
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!stripeSecretKey || !webhookSecret) {
    console.error('Stripe configuration missing');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }
  
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-08-27.basil',
  });
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const failedPayment = event.data.object;
        await handlePaymentIntentFailed(failedPayment);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await handleSubscriptionChange(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const deletedSubscription = event.data.object;
        await handleSubscriptionDeleted(deletedSubscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);
  
  // Extract payment method information
  const paymentMethodType = session.payment_method_types?.[0] || 'unknown';
  const isBNPL = ['klarna', 'afterpay_clearpay', 'affirm'].includes(paymentMethodType);
  
  // Forward to backend API
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'internal-forward', // Signal this is an internal forward
      },
      body: JSON.stringify({
        type: 'checkout.session.completed',
        data: { object: session },
      }),
    });

    if (!response.ok) {
      console.error('Failed to forward webhook to backend:', response.statusText);
    }
  } catch (error) {
    console.error('Error forwarding webhook:', error);
  }
  
  console.log({
    sessionId: session.id,
    customerId: session.customer,
    customerEmail: session.customer_email,
    paymentStatus: session.payment_status,
    paymentMethod: paymentMethodType,
    isBNPL,
    amount: session.amount_total,
    currency: session.currency,
    metadata: session.metadata,
    plan: session.metadata?.plan,
    billingCycle: session.metadata?.billingCycle,
  });
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id);
  
  // Extract BNPL information if available
  const paymentMethod = paymentIntent.payment_method_types?.[0] || 'unknown';
  
  // TODO: Update transaction records
  // TODO: Trigger fulfillment for one-time purchases
  
  console.log({
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    paymentMethod,
    metadata: paymentIntent.metadata,
  });
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent failed:', paymentIntent.id);
  
  // TODO: Handle failed payment
  // TODO: Notify customer
  // TODO: Update transaction status
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log('Subscription changed:', subscription.id);
  
  // Forward to backend API for weekly/monthly recurring handling
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'internal-forward',
      },
      body: JSON.stringify({
        type: 'customer.subscription.updated',
        data: { object: subscription },
      }),
    });

    if (!response.ok) {
      console.error('Failed to forward subscription update:', response.statusText);
    }
  } catch (error) {
    console.error('Error forwarding subscription update:', error);
  }
  
  const interval = subscription.items.data[0]?.price?.recurring?.interval;
  const isWeekly = interval === 'week';
  
  console.log({
    subscriptionId: subscription.id,
    customerId: subscription.customer,
    status: subscription.status,
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    billingInterval: interval,
    isWeekly,
    metadata: subscription.metadata,
    items: subscription.items.data.map(item => ({
      productId: item.price.product,
      priceId: item.price.id,
      quantity: item.quantity,
      interval: item.price.recurring?.interval,
    })),
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  // TODO: Revoke user access
  // TODO: Send cancellation confirmation
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id);
  
  // TODO: Update payment records
  // TODO: Send receipt
}