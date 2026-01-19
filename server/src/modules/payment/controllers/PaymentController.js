const PaymentService = require('../services/PaymentService');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const mongoose = require('mongoose');

class PaymentController {

    // POST /v1/orders
    // POST /api/v1/payments/demo-order
    async createDemoOrder(req, res) {
        try {
            const { productId, productDetails } = req.body;

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

            const PaymentFactory = require('../factories/PaymentFactory');
            const adapter = PaymentFactory.getAdapter({ currency: product.currency });

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
            res.json({
                success: true,
                orderId: gatewayResponse.orderId, // Razorpay Order ID
                amount: product.price,
                currency: product.currency,
                keyId: process.env.RAZORPAY_KEY_ID, // Send public key to frontend
                product: {
                    name: product.name,
                    description: product.description
                }
            });

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

            const PaymentFactory = require('../factories/PaymentFactory');
            const adapter = PaymentFactory.getAdapter({ currency: product ? product.currency : currency });

            // 1. Verify Signature
            await adapter.verifyPayment({
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature
            });

            // 2. Resolve Merchant Context from Product
            let merchantOrgId = null;
            if (product) {
                merchantOrgId = product.organization;
            } else {
                // If it was a mock product, try to assign to the demo org
                const Organization = require('../../core/models/Organization');
                const demoOrg = await Organization.findOne({ name: 'Acme Corp (Demo)' });
                if (demoOrg) merchantOrgId = demoOrg._id;
            }

            // App context is optional for Demo, but Transaction model might require it.
            const Application = require('../../app/models/Application');
            let app = null;
            if (merchantOrgId) {
                app = await Application.findOne({ organization: merchantOrgId });
            }

            if (!app) {
                app = await Application.findOne(); // Fallback to any app
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
                    provider: 'razorpay',
                    transactionId: razorpay_order_id,
                    paymentId: razorpay_payment_id
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
                .populate('application', 'name');

            res.json(transactions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PaymentController();
