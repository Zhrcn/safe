const express = require('express');
const router = express.Router();

const {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes in this file will be protected
router.use(protect);

// GET /api/v1/notifications - Get all notifications for the logged-in user
router.get('/', getUserNotifications);

// PATCH /api/v1/notifications/read-all - Mark all notifications as read
router.patch('/read-all', markAllNotificationsAsRead);

// PATCH /api/v1/notifications/:id/read - Mark a specific notification as read
router.patch('/:id/read', markNotificationAsRead);

module.exports = router;
