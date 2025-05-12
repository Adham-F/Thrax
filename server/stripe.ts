import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key. Please set STRIPE_SECRET_KEY in your environment variables.');
}

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil', // Use the latest API version
});

// Create a payment intent for a one-time payment
export async function createPaymentIntent(amount: number, currency: string = 'usd', metadata: Record<string, any> = {}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

// Create a customer in Stripe
export async function createStripeCustomer(email: string, name?: string, metadata: Record<string, any> = {}) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    });

    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
}

// Retrieve a customer from Stripe
export async function retrieveStripeCustomer(customerId: string) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  } catch (error) {
    console.error('Error retrieving Stripe customer:', error);
    throw error;
  }
}

// Create a product in Stripe
export async function createStripeProduct(name: string, description: string, metadata: Record<string, any> = {}) {
  try {
    const product = await stripe.products.create({
      name,
      description,
      metadata,
    });

    return product;
  } catch (error) {
    console.error('Error creating Stripe product:', error);
    throw error;
  }
}

// Create a price for a product in Stripe
export async function createStripePrice(productId: string, unitAmount: number, currency: string = 'usd') {
  try {
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: Math.round(unitAmount * 100), // Convert to cents
      currency,
    });

    return price;
  } catch (error) {
    console.error('Error creating Stripe price:', error);
    throw error;
  }
}

// Handle webhook events from Stripe
export async function handleStripeWebhook(rawBody: string, signature: string) {
  try {
    // In a production environment, you'd use a webhook secret
    // const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    const event = JSON.parse(rawBody);

    // Handle different types of events
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        // Handle successful payment (update order status, send confirmation email, etc.)
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        console.log(`Payment failed: ${failedPaymentIntent.last_payment_error?.message}`);
        // Handle failed payment
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    throw error;
  }
}

export default stripe;