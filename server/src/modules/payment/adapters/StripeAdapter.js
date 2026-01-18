const Stripe = require('stripe');
const PaymentAdapter = require('./PaymentAdapter');

class StripeAdapter extends PaymentAdapter {
    constructor(config) {
        super(config);
        this.stripe = new Stripe(config.secretKey);
    }

    async createPayment({ amount, currency, metadata, customerId }) {
        // Znyck Pay unified amount is usually in smallest unit (cents), but let's assume input is standard and handle logic here.
        // If input is 1000 (cents) -> stripe expects cents.

        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency: currency.toLowerCase(),
                metadata,
                // customer: customerId, // Optional: if we want to attach to a stripe customer
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            return {
                success: true,
                gatewayId: paymentIntent.id,
                status: paymentIntent.status, // e.g. 'requires_payment_method'
                clientSecret: paymentIntent.client_secret,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                provider: 'stripe'
            };
        } catch (error) {
            console.error('Stripe Create Payment Error:', error);
            throw error;
        }
    }

    async verifyPayment(paymentIntentId) {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        return {
            status: paymentIntent.status === 'succeeded' ? 'succeeded' : paymentIntent.status,
            amount: paymentIntent.amount,
            raw: paymentIntent
        };
    }
}

module.exports = StripeAdapter;
