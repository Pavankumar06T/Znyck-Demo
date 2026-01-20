const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Organization = require('./modules/core/models/Organization');
const Application = require('./modules/app/models/Application');

const cleanupOrgs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find the org that owns the apps
        const appOrgId = '696f4236125f69735ded00ec';
        const correctOrg = await Organization.findById(appOrgId);

        if (!correctOrg) {
            console.log('❌ Could not find the org that owns apps');
            process.exit(1);
        }

        console.log(`\n✅ Keeping org: ${correctOrg.name} (${correctOrg._id})`);

        // Delete all other orgs
        const result = await Organization.deleteMany({ _id: { $ne: appOrgId } });
        console.log(`✅ Deleted ${result.deletedCount} duplicate organizations`);

        // Verify
        const remaining = await Organization.countDocuments();
        console.log(`\n✅ ${remaining} organization(s) remaining`);

        const apps = await Application.find({});
        console.log(`✅ ${apps.length} apps still linked correctly`);

        process.exit(0);
    } catch (e) {
        console.error('❌ Error:', e);
        process.exit(1);
    }
};

cleanupOrgs();
