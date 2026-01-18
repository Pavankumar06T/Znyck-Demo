const StripeAdapter = require('../adapters/StripeAdapter');
const RazorpayAdapter = require('../adapters/RazorpayAdapter');

class PaymentFactory {
    /**
     * Get the appropriate payment adapter based on request context
     * @param {Object} context - { currency, country }
     * @returns {PaymentAdapter}
     */
    static getAdapter(context) {
        const { currency, country } = context;

        // Routing Logic:
        // If currency is INR -> Razorpay
        // Else -> Stripe

        // Note: In a real system, we'd also check if the merchant has valid keys for that provider.
        // Here we assume global platform keys or we'd fetch app-specific keys.
        // For Znyck Pay (Platform), we might use Platform keys or connected accounts.
        // For this prototype, we'll use environment variables for the "Platform's" accounts.

        if (currency && currency.toUpperCase() === 'INR') {
            return new RazorpayAdapter({
                publicKey: process.env.RAZORPAY_KEY_ID,
                secretKey: process.env.RAZORPAY_KEY_SECRET
            });
        } else {
            return new StripeAdapter({
                publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
                secretKey: process.env.STRIPE_SECRET_KEY
            });
        }
    }
}

module.exports = PaymentFactory;
