const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser, createUser, deleteUser, getUserById } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUserById);
router.post('/', protect, createUser);
router.patch('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;
