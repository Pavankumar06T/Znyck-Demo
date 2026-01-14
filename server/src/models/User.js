const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tenantId: { type: String, required: true }, // Simple string for now, could be ObjectId ref to Tenant
    saasType: { type: String, required: true }, // Denormalized from Tenant
    role: { type: String, enum: ['admin', 'user'], default: 'admin' }, // First user is usually admin of their tenant
    plan: { type: String, enum: ['free', 'premium'], default: 'free' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
