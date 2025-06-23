const express = require('express');
const router = express.Router();
const { login, register, verifyToken, getCurrentUser, logout } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.get('/verify', verifyToken);
router.get('/me', getCurrentUser);
router.post('/logout', logout);

module.exports = router; 