const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['admin', 'developer', 'viewer'], default: 'viewer' }
    }],
    billing_email: {
        type: String,
        trim: true,
        lowercase: true
    },
    billing_email: {
        type: String,
        trim: true,
        lowercase: true
    },
    settings: {
        saasType: { type: String, default: 'generic' },
        theme: { type: String, default: 'digital' }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Organization', organizationSchema);
