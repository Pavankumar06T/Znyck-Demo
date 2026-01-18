const PaymentFactory = require('../factories/PaymentFactory');
const Transaction = require('../models/Transaction');
const Application = require('../../app/models/Application');

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

        // 2. Determine Gateway
        const adapter = PaymentFactory.getAdapter({ currency, country: customer.country });

        // 3. Create Order on Gateway
        // We add appId to metadata so we can track it on webhook return if needed
        const gatewayMetadata = { ...metadata, appId: app._id.toString(), orgId: app.organization.toString() };

        const gatewayResponse = await adapter.createPayment({
            amount,
            currency,
            metadata: gatewayMetadata,
            customerId: null // We could store/retrieve customers if we wanted recurring
        });

        // 4. Persist Transaction in Znyck DB
        const transaction = new Transaction({
            application: app._id,
            organization: app.organization,
            amount: gatewayResponse.amount,
            currency: gatewayResponse.currency,
            status: 'pending', // or gatewayResponse.status
            customer: customer,
            gateway: {
                provider: gatewayResponse.provider,
                transactionId: gatewayResponse.gatewayId, // PaymentIntent ID or Order ID
                originalResponse: gatewayResponse
            },
            metadata: metadata
        });

        await transaction.save();

        // 5. Return Unified Response to Client
        return {
            orderId: transaction._id,
            amount: transaction.amount,
            currency: transaction.currency,
            status: transaction.status,
            // Return gateway specific configs needed for frontend SDKs
            clientSecret: gatewayResponse.clientSecret, // Stripe specific
            razorpayOrderId: gatewayResponse.orderId,   // Razorpay specific
            provider: gatewayResponse.provider
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
