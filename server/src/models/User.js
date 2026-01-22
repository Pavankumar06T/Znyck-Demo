const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    nickname: { type: String, trim: true },
    country: { type: String, trim: true },
    contact: { type: String, trim: true },
    panNumber: { type: String, trim: true, uppercase: true },
    website: { type: String, trim: true },
    bankDetails: {
        accountNumber: { type: String, trim: true },
        ifscCode: { type: String, trim: true },
        accountHolderName: { type: String, trim: true },
        bankName: { type: String, trim: true }
    },
    password: {
        type: String,
        required: true
    },
    organizations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
