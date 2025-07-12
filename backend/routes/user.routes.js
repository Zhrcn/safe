const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser, createUser, deleteUser } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getAllUsers);
router.post('/', protect, createUser);
router.patch('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;
