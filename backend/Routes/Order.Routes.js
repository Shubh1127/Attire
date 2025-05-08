const express = require('express');
const router = express.Router();
const orderController = require('../controller/Order.controller');
const authMiddleware = require('../Middlewares/auth.middleware');

// Specific routes
router.get('/getorders', authMiddleware, orderController.getAllOrders);
router.get('/buyers-with-orders', authMiddleware, orderController.fetchAllBuyersWithOrders);
router.post('/payment/create-order', authMiddleware, orderController.initiateRazorpayPayment);
router.post('/pay/verify', authMiddleware, orderController.processPaymentSuccess);
router.get('/analytics/sales', authMiddleware, orderController.getSalesAnalytics);
router.get('/buyer/:buyer_id', authMiddleware, orderController.getBuyerOrders);
router.post('/placeorder', authMiddleware, orderController.createOrder);
router.put('/status/:orderId', authMiddleware, orderController.updateOrderStatus);
router.put('/cancel/:orderId', authMiddleware, orderController.cancelOrder);

// Dynamic route (keep this last)
router.get('/:orderId', authMiddleware, orderController.getOrderDetails);

module.exports = router;