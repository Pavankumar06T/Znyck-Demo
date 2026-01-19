const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true }, // in smallest unit (e.g., paise, cents)
    currency: { type: String, required: true, default: 'INR' },
    category: {
        type: String,
        required: true,
        enum: ['E-Book', 'Freelance', 'Product']
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
        index: true
    },
    image: { type: String }, // URL or placeholder
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
