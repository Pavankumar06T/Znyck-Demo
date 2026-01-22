/**
 * Payment Adapter Interface
 * All payment gateways must implement these methods.
 */
class PaymentAdapter {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create a payment intent/order on the gateway
     * @param {Object} params - { amount, currency, currency, metadata, customer }
     * @returns {Object} Unified response { id, gatewayId, status, clientSecret, ... }
     */
    async createPayment(params) {
        throw new Error('Method not implemented');
    }

    /**
     * Verify/Capture a payment
     * @param {String} paymentId 
     */
    async verifyPayment(paymentId) {
        throw new Error('Method not implemented');
    }

    /**
     * Create a customer on the gateway
     */
    async createCustomer(user) {
        throw new Error('Method not implemented');
    }
}

module.exports = PaymentAdapter;
