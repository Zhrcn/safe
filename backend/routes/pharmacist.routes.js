const express = require('express');
const router = express.Router();
const {
  getPharmacistProfile,
  updatePharmacistProfile,
  getPharmacists,
  getPharmacist
} = require('../controllers/pharmacist.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', getPharmacists);
router.get('/:id', getPharmacist);

router.use(protect);
router.use(authorize('pharmacist'));
router
  .route('/profile')
  .get(getPharmacistProfile)
  .patch(updatePharmacistProfile);

module.exports = router;
