const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/public/PaymentController');
const authenticateApp = require('../middleware/authenticateApp');

router.post('/', authenticateApp, PaymentController.createOrder);
router.get('/:id', authenticateApp, PaymentController.getOrder);

module.exports = router;
