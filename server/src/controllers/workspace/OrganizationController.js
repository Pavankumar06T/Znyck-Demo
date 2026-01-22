const Organization = require('../../models/Organization');
const User = require('../../models/User');

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
            let query = {};
            if (userId && userId !== 'undefined') {
                query = { 'members.user': userId };
            }
            // For Demo: If no userId, return all (or just return first found)
            const orgs = await Organization.find(query);
            res.json(orgs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // PUT /api/v1/orgs/:id
    async updateOrg(req, res) {
        try {
            const { id } = req.params;
            const { name, email, website } = req.body;

            // 1. Update Organization
            const org = await Organization.findByIdAndUpdate(
                id,
                { name, website },
                { new: true }
            );

            if (!org) {
                return res.status(404).json({ error: 'Organization not found' });
            }

            // 2. Update User (Owner) - specific for this use case where user wants sync
            // In a real app, we might handle this differently (separate user profile update)
            // But here the requirements imply syncing "What they fill in signup"
            if (email) {
                await User.findByIdAndUpdate(org.owner, { email, website });
            }

            res.json(org);
        } catch (error) {
            console.error('Update Org Error:', error);
            res.status(500).json({ error: 'Failed to update settings' });
        }
    }
}

module.exports = new OrganizationController();
