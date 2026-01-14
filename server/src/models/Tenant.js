const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tenantId: { type: String, required: true, unique: true }, // e.g., 'company-a'
    saasType: { type: String, required: true, enum: ['ebook-saas', 'freelance-saas', 'project-saas'] },
    theme: {
        primary: String,
        accent: String
    },
    features: {
        ebooks: Boolean,
        exporting: Boolean,
        jobs: Boolean,
        projects: Boolean
    },
    labels: {
        itemName: String,
        actionBtn: String
    },
    subscriptionStatus: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Tenant', tenantSchema);
