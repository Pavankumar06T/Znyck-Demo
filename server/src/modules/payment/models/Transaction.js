const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    // Breakdown
    subtotal: Number,
    tax: Number,
    total: Number,
    currency: {
        type: String,
        required: true,
        uppercase: true,
        minlength: 3,
        maxlength: 3
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded'],
        default: 'pending',
        index: true
    },
    customer: {
        email: { type: String, required: true },
        name: String,
        country: String
    },
    // Gateway specific details
    gateway: {
        provider: { type: String, enum: ['stripe', 'razorpay'], required: true },
        transactionId: String, // The Stripe PI ID or Razorpay Order ID
        paymentId: String, // The capture ID
        originalResponse: mongoose.Schema.Types.Mixed // Store raw JSON from gateway for audit
    },
    metadata: {
        type: Map,
        of: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

transactionSchema.index({ application: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
