const Application = require('../models/Application');

class ApplicationController {

    // POST /api/apps (Protected by User Auth)
    async createApp(req, res) {
        try {
            const { name, organizationId, environment } = req.body;

            const app = new Application({
                name,
                organization: organizationId,
                environment
            });

            await app.save();

            res.status(201).json(app);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // GET /api/apps (Protected by User Auth)
    async listApps(req, res) {
        try {
            const { organizationId } = req.query;
            const apps = await Application.find({ organization: organizationId });
            res.json(apps);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ApplicationController();
