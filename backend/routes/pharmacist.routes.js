const express = require('express');
const router = express.Router();
const {
  getPharmacistProfile,
  updatePharmacistProfile,
  getPharmacists,
  getPharmacist
} = require('../controllers/pharmacist.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const inventoryController = require('../controllers/inventory.controller');

router.get('/', getPharmacists);

router.use(protect);
router.use(authorize('pharmacist'));

// Inventory routes
router.get('/inventory', inventoryController.getInventory);
router.get('/inventory/low-stock', inventoryController.getLowStockItems);
router.get('/inventory/:id', inventoryController.getInventoryItem);
router.post('/inventory', inventoryController.createInventoryItem);
router.patch('/inventory/:id', inventoryController.updateInventoryItem);
router.delete('/inventory/:id', inventoryController.deleteInventoryItem);

router
  .route('/profile')
  .get(getPharmacistProfile)
  .patch(updatePharmacistProfile);

router.get('/:id', getPharmacist);

module.exports = router;
