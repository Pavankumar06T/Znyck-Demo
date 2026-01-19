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

const ProductController = require('./modules/payment/controllers/ProductController');
const AuthController = require('./modules/core/controllers/AuthController');
console.log('AuthController loaded:', AuthController);
console.log('AuthController proto:', Object.getPrototypeOf(AuthController));
console.log('AuthController.login type:', typeof AuthController.login);

// Auth Routes - Registered directly to ensure precedence
app.post('/api/v1/auth/signup', AuthController.signup);
app.post('/api/v1/auth/login', AuthController.login);

// 1. Management API (For Dashboard)
// In a real app, this would be protected by User Auth (JWT)
const apiRouter = express.Router();
apiRouter.use((req, res, next) => {
    console.log(`[API Router] Checking: ${req.method} ${req.path}`);
    next();
});

// Auth Routes
apiRouter.post('/auth/signup', AuthController.signup);
apiRouter.post('/auth/login', AuthController.login);

apiRouter.post('/orgs', OrganizationController.createOrg);
apiRouter.get('/orgs', OrganizationController.listOrgs);
apiRouter.post('/apps', ApplicationController.createApp);
apiRouter.get('/apps', ApplicationController.listApps);
apiRouter.get('/transactions', PaymentController.listTransactions);

// Product Management
apiRouter.post('/products', ProductController.createProduct);
apiRouter.get('/products', ProductController.listProducts);

// Demo Payment Route (Public for this demo)
// Demo Payment Route (Public for this demo)
apiRouter.post('/payments/demo-order', PaymentController.createDemoOrder);
apiRouter.post('/payments/verify-demo-order', PaymentController.verifyDemoOrder);

app.use('/api/v1', apiRouter);

// 2. Payment API (For Client Apps / SDKs)
// Protected by API Key ('x-api-key' header)
const paymentRouter = express.Router();
// paymentRouter.use(authenticateApp); // Access control moved to specific routes

paymentRouter.post('/orders', authenticateApp, PaymentController.createOrder);
paymentRouter.get('/orders/:id', authenticateApp, PaymentController.getOrder);

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
            // Check for legacy demo app and remove it (Clean up from previous runs)
            await Application.deleteOne({ name: 'Demo SaaS App' });

            // Ensure Organization Exists
            let org = await Organization.findOne();
            if (!org) {
                console.log('⚠️ No Organization found. Creating default Org...');
                // Try to find a user to assign owner, or create one
                let user = await User.findOne();
                if (!user) {
                    user = await User.create({ name: 'Demo Admin', email: 'admin@znyck.com', password: 'hashed_secret' });
                }
                org = await Organization.create({ name: 'Acme Corp (Demo)', owner: user._id, members: [{ user: user._id, role: 'admin' }] });
            }

            // Check if our new apps exist
            const ebookApp = await Application.findOne({ name: 'Znyck E-Books' });
            if (!ebookApp) {
                console.log('🌱 Seeding missing Demo Apps...');
                await seedApps(org._id);
                console.log('✨ Seed Complete: Added E-Books, Freelance, and Gear Apps');
            }
        }

        // --- SEED PRODUCTS ---
        const Product = require('./modules/payment/models/Product');

        // Always re-seed for this demo to ensure we have the correct data
        try {
            await Product.deleteMany({});
            console.log('🧹 Cleared existing products for re-seeding');
        } catch (e) {
            console.log('⚠️ Could not clear products', e);
        }

        console.log('🌱 Seeding Products...');
        // Find the Demo Admin Org
        const demoAdmin = await User.findOne({ email: 'admin@znyck.com' });
        let seedOrgId = null;
        if (demoAdmin) {
            const demoOrg = await Organization.findOne({ owner: demoAdmin._id });
            if (demoOrg) seedOrgId = demoOrg._id;
        }

        // If we found the demo org, seed products for it
        if (seedOrgId) {
            const productsToSeed = [
                // E-Book Category (5 Items)
                { name: "The Art of Code", description: "A comprehensive guide to clean code principles.", price: 2900, currency: "INR", category: "E-Book", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800", organization: seedOrgId },
                { name: "Advanced React Patterns", description: "Master modern React architecture.", price: 4900, currency: "INR", category: "E-Book", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800", organization: seedOrgId },
                { name: "System Design Interview", description: "Crack the system design interview.", price: 3500, currency: "INR", category: "E-Book", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800", organization: seedOrgId },
                { name: "The Pragmatic Programmer", description: "From journeyman to master.", price: 4200, currency: "INR", category: "E-Book", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800", organization: seedOrgId },
                { name: "Microservices Patterns", description: "With examples in Java.", price: 5500, currency: "INR", category: "E-Book", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800", organization: seedOrgId },

                // Freelance Category (5 Items)
                { name: "Full Stack Consultancy", description: "1-hour consultation session for your project.", price: 15000, currency: "INR", category: "Freelance", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", organization: seedOrgId },
                { name: "UI/UX Design Review", description: "Expert review of your application design.", price: 9900, currency: "INR", category: "Freelance", image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800", organization: seedOrgId },
                { name: "Code Review Session", description: "In-depth code analysis and feedback.", price: 8000, currency: "INR", category: "Freelance", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800", organization: seedOrgId },
                { name: "Mentorship Call", description: "30-minute career guidance call.", price: 5000, currency: "INR", category: "Freelance", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800", organization: seedOrgId },
                { name: "Database Optimization", description: "Performance tuning for your database.", price: 12000, currency: "INR", category: "Freelance", image: "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800", organization: seedOrgId },

                // Product Category (5 Items) - Note: Category name is 'Product' (Singular) to match frontend
                { name: "Developer Mechanical Keycaps", description: "Set of 12 custom keycaps for coding.", price: 1200, currency: "INR", category: "Product", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800", organization: seedOrgId },
                { name: "Ergonomic Mouse", description: "Vertical mouse for reduced strain.", price: 2500, currency: "INR", category: "Product", image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800", organization: seedOrgId },
                { name: "Noise Cancelling Headphones", description: "Focus on your code in silence.", price: 18000, currency: "INR", category: "Product", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800", organization: seedOrgId },
                { name: "Laptop Stand", description: "Aluminum stand for better posture.", price: 1500, currency: "INR", category: "Product", image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=800", organization: seedOrgId },
                { name: "Desk Mat", description: "Large extended gaming mouse pad.", price: 900, currency: "INR", category: "Product", image: "https://images.unsplash.com/photo-1629904832560-6425979bb8c1?auto=format&fit=crop&q=80&w=800", organization: seedOrgId }
            ];

            await Product.insertMany(productsToSeed);
            console.log('✨ Seed Complete: Added 15 Default Products (5 per category)');
        } else {
            console.log('⚠️ Skipping Product Seed: Demo Admin Org not found');
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
