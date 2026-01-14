const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Tenant = require('../models/Tenant');

// GET /api/config
// Returns the configuration for the current user's tenant
router.get('/', authMiddleware, async (req, res) => {
    try {
        const tenantId = req.user.tenantId; // From JWT
        const tenant = await Tenant.findOne({ tenantId });

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        res.json({
            saasType: tenant.saasType,
            theme: tenant.theme,
            features: tenant.features,
            labels: tenant.labels,
            name: tenant.name
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
