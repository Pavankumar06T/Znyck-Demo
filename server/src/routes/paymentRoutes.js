const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Razorpay
// NOTE: We wrap this in a lazy initializer or just use process.env directly
// to avoid errors if env vars aren't set yet during require time.
const getRazorpayInstance = () => {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
};

// Create Order
router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency = 'INR', items } = req.body;

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency,
            receipt: `receipt_${Date.now()}`
        };

        const instance = getRazorpayInstance();
        const razorpayOrder = await instance.orders.create(options);

        if (!razorpayOrder) {
            return res.status(500).json({ error: 'Some error occurred' });
        }

        // Save initial order to DB
        const newOrder = new Order({
            items,
            totalAmount: amount,
            razorpayOrderId: razorpayOrder.id,
            status: 'pending',
            paymentGateway: 'razorpay'
        });
        await newOrder.save();

        res.json({
            id: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: razorpayOrder.amount,
            orderId: newOrder._id
        });

    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create Stripe Payment Intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'inr', items } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // amount in smallest currency unit
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        const newOrder = new Order({
            items,
            totalAmount: amount,
            stripePaymentIntentId: paymentIntent.id,
            paymentGateway: 'stripe',
            status: 'pending'
        });
        await newOrder.save();

        res.json({
            clientSecret: paymentIntent.client_secret,
            orderId: newOrder._id
        });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify Payment
router.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, paymentGateway } = req.body;

        if (paymentGateway === 'stripe') {
            // Stripe verification usually happens via webhook or client-side confirmation result
            // Here we can just double check the intent status if needed, 
            // but for simplicity we rely on the client telling us success for this demo
            // or we can fetch the intent:
            const { paymentIntentId } = req.body;
            const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

            if (intent.status === 'succeeded') {
                await Order.findByIdAndUpdate(orderId, { status: 'paid' });
                return res.json({ status: 'success', message: 'Payment successful' });
            } else {
                return res.status(400).json({ status: 'failure', message: 'Payment not succeeded' });
            }
        }

        // Razorpay Verification
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Update order status
            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    status: 'paid',
                    razorpayPaymentId: razorpay_payment_id
                }
            );

            res.json({ status: 'success', message: 'Payment verification successful' });
        } else {
            res.status(400).json({ status: 'failure', message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Verify Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
