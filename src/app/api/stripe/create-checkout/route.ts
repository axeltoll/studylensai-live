import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Omitting apiVersion to use the default from Stripe
});

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId, email, yearlyUpsell } = await req.json();

    if (!priceId || !userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a new checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // The price ID from Stripe dashboard
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: yearlyUpsell ? 0 : 3, // Skip trial for yearly upsell
        metadata: {
          userId, // Store user ID in subscription metadata
        },
      },
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?checkout_success=true${yearlyUpsell ? '&yearly=true' : ''}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?checkout_cancelled=true`,
      metadata: {
        userId, // Store userId in the checkout metadata
        yearlyUpsell: yearlyUpsell ? 'true' : 'false'
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Helper function to create a Pro subscription product and price
// This would typically be run once during setup
export async function GET() {
  try {
    // Check if we already have a StudyLens Pro product
    const products = await stripe.products.list({
      active: true,
    });
    
    const existingProduct = products.data.find(
      (product) => product.name === 'StudyLens Pro'
    );
    
    let productId: string;
    
    // Create product if it doesn't exist
    if (!existingProduct) {
      const product = await stripe.products.create({
        name: 'StudyLens Pro',
        description: 'Premium plan with higher usage limits and additional features',
      });
      productId = product.id;
    } else {
      productId = existingProduct.id;
    }
    
    // Check for existing monthly price
    const monthlyPrices = await stripe.prices.list({
      product: productId,
      active: true,
      type: 'recurring',
      lookup_keys: ['monthly_pro_subscription'],
    });
    
    let monthlyPriceId: string;
    
    // Create monthly price if it doesn't exist
    if (monthlyPrices.data.length === 0) {
      const price = await stripe.prices.create({
        product: productId,
        unit_amount: 999, // $9.99 in cents
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        nickname: 'Early Bird Launch Price',
        lookup_key: 'monthly_pro_subscription'
      });
      monthlyPriceId = price.id;
    } else {
      monthlyPriceId = monthlyPrices.data[0].id;
    }
    
    // Check for existing yearly price
    const yearlyPrices = await stripe.prices.list({
      product: productId,
      active: true,
      type: 'recurring',
      lookup_keys: ['yearly_pro_subscription'],
    });
    
    let yearlyPriceId: string;
    
    // Create yearly price if it doesn't exist
    if (yearlyPrices.data.length === 0) {
      const price = await stripe.prices.create({
        product: productId,
        unit_amount: 5999, // $59.99 in cents
        currency: 'usd',
        recurring: {
          interval: 'year',
        },
        nickname: 'Yearly Pro Subscription (50% OFF)',
        lookup_key: 'yearly_pro_subscription'
      });
      yearlyPriceId = price.id;
    } else {
      yearlyPriceId = yearlyPrices.data[0].id;
    }
    
    return NextResponse.json({
      productId,
      monthlyPriceId,
      yearlyPriceId,
      message: 'Pro plan configuration retrieved successfully',
    });
  } catch (error) {
    console.error('Error setting up Stripe products:', error);
    return NextResponse.json(
      { error: 'Failed to set up Stripe products' },
      { status: 500 }
    );
  }
} 