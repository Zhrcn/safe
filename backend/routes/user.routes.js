const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getAllUsers);
router.patch('/:id', protect, updateUser);

module.exports = router;
