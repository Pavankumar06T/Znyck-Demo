const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/public/PaymentController');

router.post('/demo-order', PaymentController.createDemoOrder);
router.post('/verify-demo-order', PaymentController.verifyDemoOrder);

module.exports = router;
