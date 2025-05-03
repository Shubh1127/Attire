const express = require('express');
const router = express.Router();
const orderController = require('../controller/Order.controller');
const authMiddleware = require('../Middlewares/auth.middleware');

// Buyer routes
router.post('/placeorder', authMiddleware, orderController.createOrder);
router.get('/buyer/:buyer_id', authMiddleware, orderController.getBuyerOrders);

// ⚠️ Move static routes above dynamic :orderId
router.get('/getorders', authMiddleware, orderController.getAllOrders);
router.get("/buyers-with-orders", authMiddleware, orderController.fetchAllBuyersWithOrders);
router.put('/:orderId/status', authMiddleware, orderController.updateOrderStatus);
router.get('/analytics/sales', authMiddleware, orderController.getSalesAnalytics);

// Razorpay and payment routes
router.post('/payment/create-order', authMiddleware, orderController.initiateRazorpayPayment);
router.post('/pay/verify', authMiddleware, orderController.processPaymentSuccess);

// Dynamic routes last!
router.get('/:orderId', authMiddleware, orderController.getOrderDetails);
router.put('/:orderId/cancel', authMiddleware, orderController.cancelOrder);

module.exports = router;
