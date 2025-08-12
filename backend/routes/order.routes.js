const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const orderController = require('../controllers/order.controller');

router.use(protect);

router.post('/', authorize('pharmacist', 'distributor'), orderController.createOrder);
router.get('/', authorize('pharmacist'), orderController.getPharmacistOrders);

router.get('/distributor', authorize('distributor'), orderController.getDistributorOrders);
router.patch('/distributor/:orderId/status', authorize('distributor'), orderController.updateOrderStatus);
router.get('/distributor/accepted', authorize('distributor'), orderController.getAcceptedOrders);
router.patch('/distributor/:orderId/send-to-driver', authorize('distributor'), orderController.sendOrderToDriver);

router.get('/:orderId', authorize('pharmacist'), orderController.getOrderById);
router.patch('/:orderId/cancel', authorize('pharmacist'), orderController.cancelOrder);
router.patch('/:orderId/complete', authorize('pharmacist'), orderController.completeOrder);
router.delete('/:orderId', authorize('pharmacist'), orderController.deleteOrder);

module.exports = router; 