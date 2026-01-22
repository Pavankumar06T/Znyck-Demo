const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/public/PaymentController');

router.get('/', PaymentController.listTransactions);

module.exports = router;
