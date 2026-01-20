const mongoose = require('mongoose');
const crypto = require('crypto');

const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    // Public User-Friendly ID (e.g. app_x8s7d)
    appId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    type: {
        type: String,
        enum: ['web', 'mobile', 'backend', 'saas'],
        default: 'web',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'archived'],
        default: 'active'
    },
    // Dual Environment Keys
    apiKeys: {
        test: {
            publicKey: { type: String, required: true },
            secretKey: { type: String, required: true }
        },
        live: {
            publicKey: { type: String, required: true },
            secretKey: { type: String, required: true }
        }
    },
    webhookUrl: {
        type: String,
        trim: true
    },
    webhookSecret: {
        type: String,
        default: () => 'whsec_' + crypto.randomBytes(16).toString('hex')
    },
    settings: {
        allowedOrigins: [String],
        themeColor: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure unique app names per organization if desired
applicationSchema.index({ organization: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
