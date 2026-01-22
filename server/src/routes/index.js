const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const orgRoutes = require('./orgs');
const appRoutes = require('./apps');
const productRoutes = require('./products');
const transactionRoutes = require('./transactions');
const paymentRoutes = require('./payments');
const orderRoutes = require('./orders');

// Management API Routes
router.use('/auth', authRoutes);
router.use('/orgs', orgRoutes);
router.use('/apps', appRoutes);
router.use('/products', productRoutes);
router.use('/transactions', transactionRoutes);
router.use('/payments', paymentRoutes);

// Payment API Routes 
// Note: In original code, /orders was on same /api/v1 prefix, so we can mount it here too.
router.use('/orders', orderRoutes);

module.exports = router;
