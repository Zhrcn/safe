const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const orderController = require('../controllers/order.controller');

router.use(protect);

// Pharmacist or distributor creates an order
router.post('/', authorize('pharmacist', 'distributor'), orderController.createOrder);
// Pharmacist views their orders
router.get('/', authorize('pharmacist'), orderController.getPharmacistOrders);

// Distributor routes FIRST
router.get('/distributor', authorize('distributor'), orderController.getDistributorOrders);
router.patch('/distributor/:orderId/status', authorize('distributor'), orderController.updateOrderStatus);
router.get('/distributor/accepted', authorize('distributor'), orderController.getAcceptedOrders);
router.patch('/distributor/:orderId/send-to-driver', authorize('distributor'), orderController.sendOrderToDriver);

// Parameterized pharmacist routes AFTER distributor routes
// Get order by ID
router.get('/:orderId', authorize('pharmacist'), orderController.getOrderById);
// Pharmacist cancels an order
router.patch('/:orderId/cancel', authorize('pharmacist'), orderController.cancelOrder);
// Pharmacist marks an order as completed
router.patch('/:orderId/complete', authorize('pharmacist'), orderController.completeOrder);

module.exports = router; 