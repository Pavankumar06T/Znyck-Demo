const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Application = require('./modules/app/models/Application');

const listApps = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const apps = await Application.find({});
        console.log(`\nFound ${apps.length} Apps:`);
        apps.forEach(app => {
            console.log(`- Name: ${app.name}`);
            console.log(`  _id: ${app._id}`);
            console.log(`  appId: ${app.appId}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

listApps();
