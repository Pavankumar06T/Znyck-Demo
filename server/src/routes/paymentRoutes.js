const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const tenantMiddleware = require('../middleware/tenantMiddleware');
const User = require('../models/User');

// Mock Upgrade to Premium
router.post('/upgrade', authMiddleware, tenantMiddleware, async (req, res) => {
    try {
        const { paymentMethod } = req.body; // 'stripe', 'razorpay', 'paypal'

        // Simulate payment processing
        console.log(`Processing payment via ${paymentMethod} for user ${req.user.userId}`);

        // Update user plan
        // IMPORTANT: Note how we use tenantId in the query to enforce isolation!
        const user = await User.findOneAndUpdate(
            { _id: req.user.userId, tenantId: req.tenantId },
            { plan: 'premium' },
            { new: true }
        );

        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
