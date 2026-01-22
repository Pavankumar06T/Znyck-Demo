const PaymentService = require('../../services/PaymentService');
const Transaction = require('../../models/Transaction');
const Product = require('../../models/Product');
// Explicitly require Application model to ensure it is registered for populate
const Application = require('../../models/Application');
const mongoose = require('mongoose');

class PaymentController {

    // POST /v1/orders
    // POST /api/v1/payments/demo-order
    async createDemoOrder(req, res) {
        try {
            const { productId, productDetails, preferredProvider } = req.body;

            let product = null;
            let isMock = false;

            // 1. Try to find product in DB if ID looks valid
            if (mongoose.Types.ObjectId.isValid(productId)) {
                product = await Product.findById(productId);
            }

            // 2. If not found or invalid ID (mock), use provided details
            if (!product) {
                if (productDetails) {
                    console.log(`Product ${productId} not found in DB, using fallback details.`);
                    product = {
                        _id: productId || new mongoose.Types.ObjectId(), // Use provided ID or generate one
                        name: productDetails.name || 'Demo Product',
                        price: productDetails.price || 1000,
                        currency: productDetails.currency || 'INR',
                        description: productDetails.description || 'Demo Item'
                    };
                    isMock = true; // Flag to skip DB updates if needed
                } else {
                    return res.status(404).json({ error: 'Product not found and no details provided' });
                }
            }

            // In a real scenario, we'd fetch the App ID dynamically.
            // Here we just use a hardcoded or env-based Key ID for the response
            // and use the Adapter to create the order on Razorpay.

            const PaymentFactory = require('../../payment/factories/PaymentFactory');
            const adapter = PaymentFactory.getAdapter({
                currency: product.currency,
                provider: preferredProvider
            });

            // Create Order on Gateway
            const gatewayResponse = await adapter.createPayment({
                amount: product.price, // already in smallest unit
                currency: product.currency,
                metadata: {
                    productId: product._id.toString(),
                    productName: product.name,
                    isMockOrder: isMock ? 'true' : 'false'
                }
            });

            // Return details to frontend to open checkout
            const responsePayload = {
                success: true,
                amount: product.price,
                currency: product.currency,
                provider: gatewayResponse.provider, // 'stripe' or 'razorpay'
                product: {
                    name: product.name,
                    description: product.description
                }
            };

            if (gatewayResponse.provider === 'stripe') {
                responsePayload.key = process.env.STRIPE_PUBLISHABLE_KEY;
                responsePayload.stripe = {
                    clientSecret: gatewayResponse.clientSecret,
                    paymentIntentId: gatewayResponse.gatewayId
                };
            } else {
                // Default to Razorpay
                responsePayload.keyId = process.env.RAZORPAY_KEY_ID;
                responsePayload.orderId = gatewayResponse.orderId;
            }

            res.json(responsePayload);

        } catch (error) {
            console.error('Demo Order Error:', error);
            res.status(500).json({
                error: 'Failed to create demo order',
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    // POST /api/v1/payments/verify-demo-order
    async verifyDemoOrder(req, res) {
        try {
            const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                paymentIntentId, // Stripe
                productId,
                user // { name, email }
            } = req.body;

            let product = null;
            // 1. Try to find product
            if (mongoose.Types.ObjectId.isValid(productId)) {
                product = await Product.findById(productId);
            }

            // If mock or not found, we still verify signature but might skip loose relational linking
            const currency = 'INR'; // Default for demo if product unknown

            // Determine Provider based on input fields
            const provider = paymentIntentId ? 'stripe' : 'razorpay';

            const PaymentFactory = require('../../payment/factories/PaymentFactory');
            const adapter = PaymentFactory.getAdapter({
                currency: product ? product.currency : currency,
                provider: provider
            });

            // 1. Verify Signature / Payment Status
            if (provider === 'razorpay') {
                await adapter.verifyPayment({
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    signature: razorpay_signature
                });
            } else {
                // Stripe Verification
                const verification = await adapter.verifyPayment(paymentIntentId);
                if (verification.status !== 'succeeded') {
                    throw new Error(`Stripe Payment not succeeded: ${verification.status}`);
                }
            }

            // 2. Resolve Merchant Context from Product
            let merchantOrgId = null;
            if (product) {
                merchantOrgId = product.organization;
            } else {
                // If it was a mock product, try to assign to the demo org
                const Organization = require('../../models/Organization');
                // Find the Org that actually owns the seeded apps (to avoid duplicate Org issues)
                const apps = await Application.findOne({ name: 'E-Book' });
                if (apps) {
                    merchantOrgId = apps.organization;
                    console.log('[VerifyOrder] Auto-detected Org ID from valid App:', merchantOrgId);
                } else {
                    const demoOrg = await Organization.findOne({ name: 'Acme Corp' });
                    if (demoOrg) merchantOrgId = demoOrg._id;
                }
            }

            // App context: Match Product Category to App Name
            // Refactored to Single App Model as per requirements
            const Application = require('../../models/Application');
            let app = null;

            if (merchantOrgId) {
                // Map Product Category to App Name (Exact Match)
                let targetAppName = 'E-Book'; // Default
                if (product) {
                    if (product.category === 'Freelance') targetAppName = 'Freelance';
                    if (product.category === 'Product') targetAppName = 'Product';
                }

                console.log(`[VerifyOrder] OrgID: ${merchantOrgId}, TargetApp: ${targetAppName}`);

                app = await Application.findOne({
                    organization: merchantOrgId,
                    name: targetAppName
                });
                console.log(`[VerifyOrder] Found App by Name? ${app ? app._id : 'NO'}`);
            }

            if (!app) {
                console.log('[VerifyOrder] App not found by name, attempting fallback...');
                // Fallback: try finding any of the known demo apps, or just the first one
                app = await Application.findOne({ organization: merchantOrgId });
                console.log(`[VerifyOrder] Fallback App: ${app ? app.name : 'NONE'}`);
            }

            // 3. Create Transaction Record
            const transaction = new Transaction({
                application: app ? app._id : new mongoose.Types.ObjectId(),
                organization: merchantOrgId || (app ? app.organization : null),
                amount: product ? product.price : 0, // ideally should pass amount from frontend if mock, but we'll assume 0 or look up order? 
                // Note: In a real system we'd verify amount from provider. For demo, if product missing, we might log 0 or generic.
                currency: product ? product.currency : currency,
                status: 'succeeded',
                customer: {
                    name: user?.name || 'Guest Customer',
                    email: user?.email || 'guest@example.com',
                    country: 'IN'
                },
                gateway: {
                    provider: provider,
                    transactionId: provider === 'razorpay' ? razorpay_order_id : paymentIntentId,
                    paymentId: provider === 'razorpay' ? razorpay_payment_id : paymentIntentId
                },
                metadata: {
                    productName: product ? product.name : 'Unknown Product (Demo)',
                    productId: productId
                }
            });

            await transaction.save();

            res.json({ success: true, transactionId: transaction._id });
        } catch (error) {
            console.error('Verification Error:', error);
            res.status(500).json({ error: 'Payment verification failed', details: error.message });
        }
    }

    async createOrder(req, res) {
        try {
            const { amount, currency, customer, metadata } = req.body;
            const appId = req.appContext.appId; // Assumes middleware sets this

            const result = await PaymentService.createOrder({
                appId,
                amount,
                currency,
                customer,
                metadata
            });

            res.status(201).json(result);
        } catch (error) {
            console.error('Create Order Error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // GET /v1/orders/:id
    async getOrder(req, res) {
        try {
            const transaction = await PaymentService.getTransaction(req.params.id);
            if (!transaction) return res.status(404).json({ error: 'Order not found' });

            // Security check: Ensure transaction belongs to the calling app
            if (transaction.application.toString() !== req.appContext.appId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            res.json(transaction);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // GET /api/v1/transactions (Dashboard API)
    async listTransactions(req, res) {
        try {
            const { organizationId, appId } = req.query;
            let query = {};

            if (organizationId) query.organization = organizationId;
            if (appId) query.application = appId;

            const transactions = await Transaction.find(query)
                .sort({ createdAt: -1 })
                .limit(50)
                .populate('application', 'name appId');

            console.log(`[API] listTransactions found ${transactions.length} records`);

            // Fallback: If populate failed (application is null), try to manually fetch
            // But we can't easily iterate and modify since 'transactions' contains Mongoose docs.
            // We need to verify if validation works now.

            if (transactions.length > 0) {
                console.log('[API] First TX Application:', transactions[0].application);
                if (!transactions[0].application) {
                    console.log('[API] Populated application is NULL. Verifying raw ID...');
                    const rawTx = await Transaction.findById(transactions[0]._id);
                    console.log('[API] Raw TX Application ID:', rawTx ? rawTx.application : 'N/A');

                    if (rawTx && rawTx.application) {
                        const foundApp = await Application.findById(rawTx.application);
                        console.log('[API] Manual Find Application:', foundApp ? foundApp.name : 'Does Not Exist');
                    }
                }
            }

            res.json(transactions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PaymentController();
