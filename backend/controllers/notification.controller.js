const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get notifications for the logged-in user
// @route   GET /api/v1/notifications
// @access  Private
exports.getUserNotifications = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  let query = { user: userId };

  if (req.query.isRead === 'true') {
    query.isRead = true;
  } else if (req.query.isRead === 'false') {
    query.isRead = false;
  }
  // If req.query.isRead is not provided or is 'all', no isRead filter is applied to query all.

  const notifications = await Notification.find(query)
    .populate({
        path: 'relatedTo',
        select: 'name title subject _id' // Select fields relevant for linking/display
        // Add more specific population based on relatedModel if needed later
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalNotifications = await Notification.countDocuments(query);
  const totalPages = Math.ceil(totalNotifications / limit);

  res.status(200).json(new ApiResponse(200, {
    notifications,
    currentPage: page,
    totalPages,
    totalNotifications,
  }, 'Notifications fetched successfully.'));
});

// @desc    Mark a notification as read
// @route   PATCH /api/v1/notifications/:id/read
// @access  Private
exports.markNotificationAsRead = asyncHandler(async (req, res, next) => {
  const notificationId = req.params.id;
  const userId = req.user.id;

  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return res.status(404).json(new ApiResponse(404, null, 'Notification not found.'));
  }

  // Ensure the notification belongs to the logged-in user
  if (notification.user.toString() !== userId) {
    return res.status(403).json(new ApiResponse(403, null, 'User not authorized to update this notification.'));
  }

  if (notification.isRead) {
    return res.status(200).json(new ApiResponse(200, notification, 'Notification is already marked as read.'));
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read.'));
});

// @desc    Mark all unread notifications as read for the logged-in user
// @route   PATCH /api/v1/notifications/read-all
// @access  Private
exports.markAllNotificationsAsRead = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const result = await Notification.updateMany(
    { user: userId, isRead: false },
    { $set: { isRead: true } }
  );

  if (result.nModified === 0) {
     return res.status(200).json(new ApiResponse(200, { modifiedCount: 0 }, 'No unread notifications to mark as read.'));
  }
  
  res.status(200).json(new ApiResponse(200, { modifiedCount: result.nModified }, `${result.nModified} notifications marked as read.`));
});
