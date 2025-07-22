const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const distributorController = require('../controllers/distributor.controller');

router.use(protect);

router.get('/profile', authorize('distributor'), distributorController.getDistributorProfile);
router.patch('/profile', authorize('distributor'), distributorController.updateDistributorProfile);
router.get('/', distributorController.getAllDistributors); // public or admin
router.patch('/inventory', authorize('distributor'), distributorController.updateInventory);

// Order management for distributor
router.get('/orders', authorize('distributor'), distributorController.getDistributorOrders);
router.patch('/orders/:orderId', authorize('distributor'), distributorController.updateOrderStatus);

module.exports = router; 