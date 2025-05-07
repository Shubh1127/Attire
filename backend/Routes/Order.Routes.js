const express = require('express');
const router = express.Router();
const orderController = require('../controller/Order.controller');
const authMiddleware = require('../Middlewares/auth.middleware');

// Payment routes (most specific first)
router.post('/payment/create-order', authMiddleware, orderController.initiateRazorpayPayment);
router.post('/pay/verify', authMiddleware, orderController.processPaymentSuccess);

// Analytics route
router.get('/analytics/sales', authMiddleware, orderController.getSalesAnalytics);

// Buyer-specific routes
router.get('/buyer/:buyer_id', authMiddleware, orderController.getBuyerOrders);
router.get("/buyers-with-orders", authMiddleware, orderController.fetchAllBuyersWithOrders);

// Order operations routes
router.post('/placeorder', authMiddleware, orderController.createOrder);
router.get('/orders/:ownerId', authMiddleware, orderController.getAllOrders);

// Status update routes
router.put('/status/:orderId', authMiddleware, orderController.updateOrderStatus);
router.put('/cancel/:orderId', authMiddleware, orderController.cancelOrder);

// Order details (keep this last)
router.get('/:orderId', authMiddleware, orderController.getOrderDetails);

module.exports = router;