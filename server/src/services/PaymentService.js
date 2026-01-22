const PaymentFactory = require('../payment/factories/PaymentFactory');
const Transaction = require('../models/Transaction');
const Application = require('../models/Application');

class PaymentService {
    /**
     * Initialize a unified payment order
     * @param {Object} params 
     * @param {String} params.appId - The Application ID invoking this
     * @param {Number} params.amount - Amount in smallest unit
     * @param {String} params.currency - Currency code (USD, INR)
     * @param {Object} params.customer - { email, name, country }
     * @param {Object} params.metadata - Key-value pairs
     */
    async createOrder({ appId, amount, currency, customer, metadata }) {
        // 1. Verify Application
        const app = await Application.findById(appId);
        if (!app) {
            throw new Error('Invalid Application ID');
        }

        // 2. Tax Calculation Logic
        // Amount passed is Subtotal
        const subtotal = amount;
        let taxRate = 0;
        if (currency.toUpperCase() === 'INR') {
            taxRate = 0.18; // 18% GST
        } else {
            taxRate = 0.10; // 10% International Tax
        }

        const tax = Math.round(subtotal * taxRate);
        const total = subtotal + tax;

        // 3. Determine Gateway
        const adapter = PaymentFactory.getAdapter({ currency, country: customer.country });

        // 4. Create Order on Gateway
        // We charge the Total Amount
        const gatewayMetadata = { ...metadata, appId: app._id.toString(), orgId: app.organization.toString() };

        const gatewayResponse = await adapter.createPayment({
            amount: total,
            currency,
            metadata: gatewayMetadata,
            customerId: null
        });

        // 5. Persist Transaction in Znyck DB
        const transaction = new Transaction({
            application: app._id,
            organization: app.organization,
            amount: total, // We store the total charged
            subtotal: subtotal,
            tax: tax,
            total: total,
            currency: gatewayResponse.currency,
            status: 'pending',
            customer: customer,
            gateway: {
                provider: gatewayResponse.provider,
                transactionId: gatewayResponse.gatewayId,
                originalResponse: gatewayResponse
            },
            metadata: metadata
        });

        await transaction.save();

        // 6. Return Unified Response to Client
        return {
            orderId: transaction._id,
            subtotal: transaction.subtotal,
            tax: transaction.tax,
            total: transaction.total,
            currency: transaction.currency,
            status: transaction.status,

            // Gateway Configs
            provider: gatewayResponse.provider,
            // CRITICAL FIX: The frontend SDK needs the GATEWAY'S Public Key (e.g. rzp_test_...), not the App's Znyck Key.
            // In a real platform, this might be the Merchant's connect key. For this demo, it's our env key.
            key: (() => {
                const key = gatewayResponse.provider === 'razorpay' ? process.env.RAZORPAY_KEY_ID : process.env.STRIPE_PUBLISHABLE_KEY;
                if (!key) console.error(`⚠️ MISSING KEY FOR ${gatewayResponse.provider.toUpperCase()}! Check .env`);
                return key;
            })(),

            // Provider Specific
            razorpay: gatewayResponse.provider === 'razorpay' ? {
                orderId: gatewayResponse.orderId
            } : null,

            stripe: gatewayResponse.provider === 'stripe' ? {
                clientSecret: gatewayResponse.clientSecret
            } : null
        };
    }

    /**
     * Fetch transaction by ID
     */
    async getTransaction(id) {
        return await Transaction.findById(id).populate('application', 'name');
    }
}

module.exports = new PaymentService();
