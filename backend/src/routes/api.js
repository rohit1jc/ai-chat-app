const express = require('express');
const AuthController = require('../controllers/AuthController');
const PaymentController = require('../controllers/PaymentController');

const router = express.Router();

const authController = new AuthController();
const paymentController = new PaymentController();

// Auth routes
router.post('/auth/google', (req, res) => authController.googleLogin(req, res));

// Payment routes
router.post('/payment/create-order', (req, res) => paymentController.createOrder(req, res));
router.post('/payment/verify', (req, res) => paymentController.verifyPayment(req, res));

module.exports = router;
