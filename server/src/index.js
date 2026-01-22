require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const crypto = require('crypto');

// Import Config
const connectDB = require('./config/db');

// Import Routes
const routes = require('./routes');

// Import Models for Seeding
const User = require('./models/User');
const Organization = require('./models/Organization');
const Application = require('./models/Application');
const Product = require('./models/Product');

// Initialize App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Static serve for uploads (if any)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.use('/api/v1', routes);

// Mock Test Route
app.get('/', (req, res) => {
    res.send({ message: 'Znyck Pay API is running 🚀', version: '1.0.0' });
});

// Connect to DB and Start Server
connectDB().then(async () => {
    // SEEDING LOGIC (Kept inline for now, but imports updated)
    try {
        console.log('🌱 Seeding missing Demo Apps...');

        let demoOrg = await Organization.findOne({ name: 'Znyck demo' });
        if (!demoOrg) {
            // Create if missing (simplified)
            const user = await User.findOne({});
            if (user) {
                demoOrg = await Organization.create({
                    name: 'Znyck demo',
                    owner: user._id,
                    members: [{ user: user._id, role: 'admin' }]
                });
            }
        }

        if (demoOrg) {
            await seedApps(demoOrg._id);
            await seedProducts(demoOrg._id);
        }

        async function seedProducts(orgId) {
            const count = await Product.countDocuments();
            if (count > 0) return;

            const categories = ['E-Book', 'Freelance', 'Product'];

            for (const cat of categories) {
                for (let i = 1; i <= 5; i++) {
                    await Product.create({
                        name: `${cat} Item ${i}`,
                        description: `A sample ${cat} for demo purposes.`,
                        price: (Math.random() * 100 + 10).toFixed(2) * 100, // cents
                        currency: 'INR',
                        category: cat,
                        organization: orgId,
                        imageUrl: `https://placehold.co/400?text=${cat}+${i}`
                    });
                }
            }
            console.log('✨ Seed Complete: Added 15 Default Products (5 per category)');
        }

        async function seedApps(orgId) {
            const generateKey = (prefix) => `${prefix}_${crypto.randomBytes(24).toString('hex')}`;

            // MIGRATION: Drop legacy indexes if they exist
            try {
                await Application.collection.dropIndex('publicKey_1');
            } catch (e) { /* Ignore */ }

            try {
                await Application.collection.dropIndex('secretKey_1');
            } catch (e) { /* Ignore */ }

            // Define the 3 apps to restore matches EXACTLY the dashboard cards
            // STATIC IDs prevent 404s on frontend refreshes during demo
            const appsToSeed = [
                { name: 'E-Book', type: 'digital', staticId: 'app_ebook_demo_123' },
                { name: 'Freelance', type: 'service', staticId: 'app_freelance_demo_456' },
                { name: 'Product', type: 'physical', staticId: 'app_product_demo_789' }
            ];

            const appIds = appsToSeed.map(a => a.staticId);

            // Clean up ONLY legacy apps (by name) that conflict but don't match our static IDs
            // Do NOT delete by appId, as that wipes the good data!
            await Application.deleteMany({
                organization: orgId,
                name: { $in: ['Znyck Demo App', 'Znyck E-Books', 'Znyck Freelance', 'Znyck Gear'] },
                appId: { $nin: appIds } // Safety: only delete if it's NOT one of our static ones
            });

            for (const app of appsToSeed) {
                // Check if app exists by static ID
                const existing = await Application.findOne({ appId: app.staticId });

                if (existing) {
                    console.log(`✨ App exists: ${app.name} (${app.staticId}) - Preserving ID: ${existing._id}`);
                    continue;
                }

                // Create only if missing
                await Application.create({
                    name: app.name,
                    organization: orgId,
                    type: app.type,
                    appId: app.staticId,
                    apiKeys: {
                        test: {
                            publicKey: generateKey('pk_test'),
                            secretKey: generateKey('sk_test')
                        },
                        live: {
                            publicKey: generateKey('pk_live'),
                            secretKey: generateKey('sk_live')
                        }
                    },
                    settings: { theme: 'dark' }
                });
                console.log(`✨ Seeded App: ${app.name} (${app.staticId})`);
            }
            console.log('✨ Seed Complete: Ensured 3 Apps exist with STATIC IDs');
        }

        app.listen(PORT, () => {
            console.log(`🚀 Znyck Pay Server running on port ${PORT}`);
        });

    } catch (e) {
        console.error('Seeding Error:', e);
    }
});
