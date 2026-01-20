const Application = require('../models/Application');
const crypto = require('crypto');

class ApplicationController {

    // POST /api/v1/apps (Protected by User Auth)
    async createApp(req, res) {
        try {
            const { name, organizationId, type, description } = req.body;

            // Basic validation
            if (!name || !organizationId) {
                return res.status(400).json({ error: 'Name and Organization ID are required' });
            }

            // Generate Keys
            const generateKey = (prefix) => `${prefix}_${crypto.randomBytes(24).toString('hex')}`;

            const app = new Application({
                name,
                organization: organizationId,
                type: type || 'web',
                description: description || '',
                // Generate short ID
                appId: `app_${crypto.randomBytes(6).toString('hex')}`,
                apiKeys: {
                    test: {
                        publicKey: generateKey('pk_test'),
                        secretKey: generateKey('sk_test')
                    },
                    live: {
                        publicKey: generateKey('pk_live'),
                        secretKey: generateKey('sk_live')
                    }
                }
            });

            await app.save();

            res.status(201).json(app);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // GET /api/v1/apps (Protected by User Auth)
    async listApps(req, res) {
        try {
            const { organizationId, type, status } = req.query;

            if (!organizationId) {
                return res.status(400).json({ error: 'Organization ID is required' });
            }

            let query = { organization: organizationId };
            if (type) query.type = type;
            if (status) query.status = status;

            const apps = await Application.find(query).sort({ createdAt: -1 });
            res.json(apps);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // GET /api/v1/apps/:id
    async getApp(req, res) {
        try {
            const { id } = req.params;

            // Try finding by _id first, then appId
            let app;
            if (id.match(/^[0-9a-fA-F]{24}$/)) {
                app = await Application.findById(id);
            }

            if (!app) {
                app = await Application.findOne({ appId: id });
            }

            if (!app) {
                return res.status(404).json({ error: 'Application not found' });
            }

            res.json(app);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ApplicationController();
