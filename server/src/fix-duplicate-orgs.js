
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Organization = require('./modules/core/models/Organization');
const Application = require('./modules/app/models/Application');

const fixDuplicateOrgs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const orgs = await Organization.find({ name: 'Acme Corp' });
        console.log(`Found ${orgs.length} Organizations named 'Acme Corp'`);

        for (const org of orgs) {
            const appCount = await Application.countDocuments({ organization: org._id });
            console.log(`- Org ID: ${org._id}, Apps: ${appCount}`);

            if (appCount === 0) {
                console.log(`⚠️  Org ${org._id} has 0 apps. DELETING NOW...`);
                await Organization.deleteOne({ _id: org._id });
                console.log('✅ Deleted ' + org._id);
            } else {
                console.log(`✅ Org ${org._id} has ${appCount} apps. Keeping.`);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

fixDuplicateOrgs();
