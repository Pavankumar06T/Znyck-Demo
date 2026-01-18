const Organization = require('../models/Organization');
const User = require('../models/User');

class OrganizationController {

    // POST /api/orgs
    async createOrg(req, res) {
        try {
            const { name, ownerId } = req.body;

            const org = new Organization({
                name,
                owner: ownerId,
                members: [{ user: ownerId, role: 'admin' }]
            });

            await org.save();

            // Update user 
            await User.findByIdAndUpdate(ownerId, { $push: { organizations: org._id } });

            res.status(201).json(org);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // GET /api/orgs
    async listOrgs(req, res) {
        try {
            // Assuming userId comes from some Auth Middleware for Dashboard Users
            const { userId } = req.query;
            const orgs = await Organization.find({ 'members.user': userId });
            res.json(orgs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new OrganizationController();
