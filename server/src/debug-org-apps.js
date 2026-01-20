const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Application = require('./modules/app/models/Application');
const Organization = require('./modules/core/models/Organization');

const debugOrgApps = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const orgs = await Organization.find({});
        console.log(`\nFound ${orgs.length} Organizations:`);
        orgs.forEach(org => {
            console.log(`- Name: ${org.name}`);
            console.log(`  _id: ${org._id}`);
        });

        const apps = await Application.find({});
        console.log(`\nFound ${apps.length} Apps:`);
        apps.forEach(app => {
            console.log(`- Name: ${app.name}`);
            console.log(`  _id: ${app._id}`);
            console.log(`  organization: ${app.organization}`);
        });

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

debugOrgApps();
