const PaymentService = require('../services/PaymentService');
const Transaction = require('../models/Transaction'); // Direct access for list optimization

class PaymentController {

    // POST /v1/orders
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
