const Razorpay = require('razorpay');
const PaymentAdapter = require('./PaymentAdapter');
const crypto = require('crypto');

class RazorpayAdapter extends PaymentAdapter {
    constructor(config) {
        super(config);
        this.razorpay = new Razorpay({
            key_id: config.publicKey,
            key_secret: config.secretKey
        });
    }

    async createPayment({ amount, currency, metadata }) {
        // Razorpay expects amount in paise (like cents).

        try {
            const options = {
                amount: amount, // input should already be in smallest unit
                currency: currency.toUpperCase(),
                receipt: `rcpt_${Date.now()}`,
                notes: metadata
            };

            const order = await this.razorpay.orders.create(options);

            return {
                success: true,
                gatewayId: order.id,
                status: order.status, // 'created'
                orderId: order.id, // Razorpay specific
                amount: order.amount,
                currency: order.currency,
                provider: 'razorpay'
            };
        } catch (error) {
            console.error('Razorpay Create Order Error:', error);
            throw error;
        }
    }

    async verifyPayment({ orderId, paymentId, signature }) {
        // Razorpay verification requires hmac of order_id + | + payment_id
        const generated_signature = crypto
            .createHmac('sha256', this.config.secretKey)
            .update(orderId + '|' + paymentId)
            .digest('hex');

        if (generated_signature === signature) {
            return {
                status: 'succeeded',
                paymentId,
                orderId
            };
        } else {
            throw new Error('Invalid Razorpay Signature');
        }
    }
}

module.exports = RazorpayAdapter;
