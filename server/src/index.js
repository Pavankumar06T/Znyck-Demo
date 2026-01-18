require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Controllers
const PaymentController = require('./modules/payment/controllers/PaymentController');
const ApplicationController = require('./modules/app/controllers/ApplicationController');
const OrganizationController = require('./modules/core/controllers/OrganizationController');

// Middleware
const authenticateApp = require('./middleware/authenticateApp');

const app = express();

app.use(cors());
app.use(express.json());

// --- ROUTES ---

app.get('/', (req, res) => res.send('Znyck Pay API Running 🚀'));

// 1. Management API (For Dashboard)
// In a real app, this would be protected by User Auth (JWT)
const apiRouter = express.Router();
apiRouter.post('/orgs', OrganizationController.createOrg);
apiRouter.get('/orgs', OrganizationController.listOrgs);
apiRouter.post('/apps', ApplicationController.createApp);
apiRouter.get('/apps', ApplicationController.listApps);
apiRouter.get('/transactions', PaymentController.listTransactions);

app.use('/api/v1', apiRouter);

// 2. Payment API (For Client Apps / SDKs)
// Protected by API Key ('x-api-key' header)
const paymentRouter = express.Router();
paymentRouter.use(authenticateApp);

paymentRouter.post('/orders', PaymentController.createOrder);
paymentRouter.get('/orders/:id', PaymentController.getOrder);

app.use('/api/v1', paymentRouter);


const PORT = process.env.PORT || 5000;

const startServer = async () => {
    let mongoUri = process.env.MONGO_URI;

    try {
        // Fallback to Memory Server if no URI or explicit 'memory' request
        if (!mongoUri || mongoUri === 'memory') {
            const mongod = await MongoMemoryServer.create();
            mongoUri = mongod.getUri();
            console.log('⚠️ Using In-Memory MongoDB at:', mongoUri);
        }

        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // --- SEED DATA (For Demo) ---
        const User = require('./modules/core/models/User');
        const Organization = require('./modules/core/models/Organization');
        const Application = require('./modules/app/models/Application');

        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log('🌱 Seeding Initial Data...');
            const user = await User.create({ name: 'Demo Admin', email: 'admin@znyck.com', password: 'hashed_secret' });
            const org = await Organization.create({ name: 'Acme Corp (Demo)', owner: user._id, members: [{ user: user._id, role: 'admin' }] });

            await seedApps(org._id);
            console.log('✨ Seed Complete: Created User, Org, and Apps');
        } else {
            // Check for legacy demo app and remove it
            await Application.deleteOne({ name: 'Demo SaaS App' });

            // Check if our new apps exist
            const ebookApp = await Application.findOne({ name: 'Znyck E-Books' });
            if (!ebookApp) {
                console.log('🌱 Seeding missing Demo Apps...');
                const org = await Organization.findOne();
                if (org) {
                    await seedApps(org._id);
                    console.log('✨ Seed Complete: Added E-Books, Freelance, and Gear Apps');
                }
            }
        }

        async function seedApps(orgId) {
            const apps = [
                { name: 'Znyck E-Books', env: 'production', type: 'digital' },
                { name: 'Znyck Freelance', env: 'production', type: 'service' },
                { name: 'Znyck Gear', env: 'test', type: 'physical' }
            ];

            for (const app of apps) {
                // Idempotent check
                const exists = await Application.findOne({ name: app.name, organization: orgId });
                if (!exists) {
                    await Application.create({
                        name: app.name,
                        organization: orgId,
                        environment: app.env,
                        publicKey: `pk_${app.env}_${app.type}_${Math.random().toString(36).substr(2, 6)}`,
                        secretKey: `sk_${app.env}_${app.type}_${Math.random().toString(36).substr(2, 6)}`,
                        settings: { theme: app.type }
                    });
                }
            }
        }

        app.listen(PORT, () => {
            console.log(`🚀 Znyck Pay Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
    }
};

startServer();
