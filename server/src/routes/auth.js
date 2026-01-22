const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth/AuthController');
const authenticateUser = require('../middleware/authenticateUser');

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.get('/me', authenticateUser, AuthController.getMe);

module.exports = router;
