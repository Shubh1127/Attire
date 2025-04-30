const express = require('express');
const router = express.Router();
const orderController = require('../controller/Order.controller');
const authMiddleware=require('../Middlewares/auth.middleware');

// Buyer routes
router.post('/placeorder', authMiddleware, orderController.createOrder);
router.get('/buyer/:buyer_id', authMiddleware, orderController.getBuyerOrders);
router.get('/:orderId', authMiddleware, orderController.getOrderDetails);
router.put('/:orderId/cancel', authMiddleware, orderController.cancelOrder);
router.post('/payment/create-order',authMiddleware, orderController.initiateRazorpayPayment);
router.post('/pay/verify', authMiddleware,orderController.processPaymentSuccess);
// Admin routes
router.get('/getorders', authMiddleware, orderController.getAllOrders);
router.put('/:orderId/status', authMiddleware, orderController.updateOrderStatus);
router.get('/analytics/sales', authMiddleware, orderController.getSalesAnalytics);

// Payment webhook

module.exports = router;