const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  deleteReadNotifications
} = require('../controllers/notification.controller');

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getUserNotifications);


router.patch('/read-all', markAllNotificationsAsRead);
router.patch('/:id/read', markNotificationAsRead);

router.delete('/read', deleteReadNotifications);
router.delete('/:id', deleteNotification);
router.delete('/', deleteAllNotifications);

module.exports = router;
