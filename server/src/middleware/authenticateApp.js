const Application = require('../models/Application');

const authenticateApp = async (req, res, next) => {
    try {
        console.log(`[AuthMiddleware] Hit by: ${req.method} ${req.path}`);
        const apiKey = req.headers['x-api-key'];

        if (!apiKey) {
            return res.status(401).json({ error: 'Missing x-api-key header' });
        }

        // Naive implementation: Find app by raw secret key
        // In production: Key should be hashed. We would find by public ID (pk_...) and verify secret.
        // However, our model has `secretKey` raw for MVP.
        const app = await Application.findOne({ secretKey: apiKey });

        if (!app) {
            return res.status(401).json({ error: 'Invalid API Key' });
        }

        // Attach app context
        req.appContext = {
            appId: app._id.toString(),
            orgId: app.organization.toString(),
            environment: app.environment
        };

        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = authenticateApp;
