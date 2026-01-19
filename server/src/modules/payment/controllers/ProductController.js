const Product = require('../models/Product');

class ProductController {

    // POST /api/v1/products (Admin only)
    async createProduct(req, res) {
        try {
            const { name, description, price, currency, category, image } = req.body;
            // req.user is set by authenticateToken middleware
            const organization = req.user.orgId;

            if (!organization) {
                return res.status(400).json({ error: 'Organization context required' });
            }

            const product = new Product({
                name,
                description,
                price,
                currency,
                category,
                image,
                organization
            });

            await product.save();
            res.status(201).json(product);
        } catch (error) {
            console.error('Create Product Error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // GET /api/v1/products (Public/Protected)
    async listProducts(req, res) {
        try {
            const { category, organizationId } = req.query;
            let query = {};

            // If accessed by an Admin (authenticated), default to showing their own products
            // unless they are browsing the public marketplace (in which case organizationId might be passed or null)

            // For Dashboard: Filter by organizationId param if provided, or req.user.orgId if implicit
            if (organizationId) {
                query.organization = organizationId;
            } else if (req.user && req.user.role === 'admin') {
                // If admin is listing products without specifying org, assume they want THEIR products
                query.organization = req.user.orgId;
            }

            // Category filter
            if (category && category !== 'All') {
                query.category = category;
            }

            const products = await Product.find(query).sort({ createdAt: -1 });
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ProductController();
