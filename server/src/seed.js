const mongoose = require('mongoose');
const User = require('./modules/core/models/User');
const Organization = require('./modules/core/models/Organization');
const Application = require('./modules/app/models/Application');
require('dotenv').config();

const seed = async () => {
    // This logic is now embedded in index.js for auto-start,
    // but we will update it to create specific apps.
};

// Copy this logic to index.js
/*
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log('🌱 Seeding Initial Data...');
            const user = await User.create({ name: 'Demo Admin', email: 'admin@znyck.com', password: 'hashed_secret' });
            const org = await Organization.create({ name: 'Acme Corp (Demo)', owner: user._id, members: [{ user: user._id, role: 'admin' }] });
            
            const apps = [
                { name: 'Znyck E-Books', env: 'production', type: 'digital' },
                { name: 'Znyck Freelance', env: 'production', type: 'service' },
                { name: 'Znyck Gear', env: 'test', type: 'physical' }
            ];

            for (const app of apps) {
                await Application.create({ 
                   name: app.name, 
                   organization: org._id, 
                   environment: app.env,
                   publicKey: `pk_${app.env}_${app.type}_${Math.random().toString(36).substr(2, 6)}`,
                   secretKey: `sk_${app.env}_${app.type}_${Math.random().toString(36).substr(2, 6)}`,
                   settings: { theme: app.type } // Use this to toggle UI
                });
            }
            console.log('✨ Seed Complete: Created 3 Demo Apps');
        }
*/
