const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const orderController = require('../controllers/order.controller');

router.use(protect);

// Pharmacist creates an order to a distributor
router.post('/', authorize('pharmacist'), orderController.createOrder);
// Pharmacist views their orders
router.get('/', authorize('pharmacist'), orderController.getPharmacistOrders);
// Get order by ID
router.get('/:orderId', authorize('pharmacist'), orderController.getOrderById);
// Pharmacist cancels an order
router.patch('/:orderId/cancel', authorize('pharmacist'), orderController.cancelOrder);

// Distributor views their orders
router.get('/distributor', authorize('distributor'), orderController.getDistributorOrders);
// Distributor accepts or rejects an order
router.patch('/distributor/:orderId/status', authorize('distributor'), orderController.updateOrderStatus);
// Distributor views accepted orders
router.get('/distributor/accepted', authorize('distributor'), orderController.getAcceptedOrders);
// Distributor marks order as sent to driver
router.patch('/distributor/:orderId/send-to-driver', authorize('distributor'), orderController.sendOrderToDriver);

module.exports = router; 