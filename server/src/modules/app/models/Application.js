const mongoose = require('mongoose');
const crypto = require('crypto');

const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    environment: {
        type: String,
        enum: ['test', 'production'],
        default: 'test'
    },
    // Public Key (Safe to expose)
    publicKey: {
        type: String,
        unique: true,
        default: () => 'pk_' + crypto.randomBytes(12).toString('hex')
    },
    // Secret Key (Hashed? For now storing raw for MVP display/simplicity, strict security would hash it)
    // In a real expanded prod env, we'd only show this once. 
    secretKey: {
        type: String,
        unique: true,
        default: () => 'sk_' + crypto.randomBytes(24).toString('hex')
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
