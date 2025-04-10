import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Using a valid API version
});

// Set webhook secret from environment variables
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    // Verify the webhook event
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle different webhook events
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(checkoutSession);
        break;
      case 'customer.subscription.created':
        const subscriptionCreated = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscriptionCreated);
        break;
      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscriptionUpdated);
        break;
      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscriptionDeleted);
        break;
      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(failedInvoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Helper functions to handle different webhook events

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  // Extract customer details from the session
  const customerId = session.customer as string;
  const userEmail = session.customer_email;
  const subscriptionId = session.subscription as string;
  
  // Update user in database with subscription info
  // This is where you'd update your Firebase or other database
  console.log(`User ${userEmail} (${customerId}) started subscription ${subscriptionId}`);
  
  // TODO: Update user record in Firebase with subscription status
  // Example: await updateUserSubscription(userId, subscriptionId, 'active', new Date());
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;
  const planId = subscription.items.data[0].plan.id;
  
  console.log(`Subscription created for customer ${customerId}: ${planId} (${status})`);
  
  // TODO: Update user record in database with subscription details
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;
  const planId = subscription.items.data[0].plan.id;
  
  console.log(`Subscription updated for customer ${customerId}: ${planId} (${status})`);
  
  // TODO: Update user subscription status in database
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  console.log(`Subscription deleted for customer ${customerId}`);
  
  // TODO: Update user subscription status to 'canceled' in database
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string | undefined;
  
  console.log(`Payment succeeded for invoice ${invoice.id} (customer: ${customerId}, subscription: ${subscriptionId || 'none'})`);
  
  // TODO: Update user subscription payment status
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string | undefined;
  
  console.log(`Payment failed for invoice ${invoice.id} (customer: ${customerId}, subscription: ${subscriptionId || 'none'})`);
  
  // TODO: Handle failed payment (notify user, etc.)
} 