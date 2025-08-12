const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
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
  const notifications = await Notification.find(query)
    .populate({
        path: 'relatedTo',
        select: 'name title subject _id'
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
exports.markNotificationAsRead = asyncHandler(async (req, res, next) => {
  const notificationId = req.params.id;
  const userId = req.user.id;
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    return res.status(404).json(new ApiResponse(404, null, 'Notification not found.'));
  }
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

exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notificationId = req.params.id;
  const userId = req.user.id;
  
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    return res.status(404).json(new ApiResponse(404, null, 'Notification not found.'));
  }
  
  if (notification.user.toString() !== userId) {
    return res.status(403).json(new ApiResponse(403, null, 'User not authorized to delete this notification.'));
  }
  
  await Notification.findByIdAndDelete(notificationId);
  res.status(200).json(new ApiResponse(200, null, 'Notification deleted successfully.'));
});

exports.deleteAllNotifications = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  
  const result = await Notification.deleteMany({ user: userId });
  
  res.status(200).json(new ApiResponse(200, { deletedCount: result.deletedCount }, `${result.deletedCount} notifications deleted successfully.`));
});

exports.deleteReadNotifications = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  
  const result = await Notification.deleteMany({ user: userId, isRead: true });
  
  res.status(200).json(new ApiResponse(200, { deletedCount: result.deletedCount }, `${result.deletedCount} read notifications deleted successfully.`));
});
