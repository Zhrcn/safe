const Notification = require('../models/Notification'); 

const createNotification = async (userId, title, message, type, relatedId = null, relatedModelName = null) => {
  try {
    if (!userId || !title || !message || !type) {
      console.error('Missing required fields for notification:', { userId, title, message, type });
      return null;
    }

    const notificationData = {
      user: userId,
      title,
      message,
      type,
    };

    if (relatedId && relatedModelName) {
      notificationData.relatedTo = relatedId;
      notificationData.relatedModel = relatedModelName;
    }

    const notification = new Notification(notificationData);
    await notification.save();
    console.log(`Notification created for user ${userId}: ${title}`);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null; 
  }
};

module.exports = {
  createNotification,
};
