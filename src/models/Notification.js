const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['message', 'appointment', 'prescription', 'inquiry', 'general'], // ممكن تزيد أنواع حسب الحاجة
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  relatedTo: { 
    // ممكن تربطه بأي كائن مثل appointment, prescription, conversation ...
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedModel'
  },
  relatedModel: {
    type: String,
    enum: ['Appointment', 'Prescription', 'Conversation', 'Inquiry', 'General'], // أو غيرها حسب تطبيقك
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, {
  timestamps: true,
  collection: 'Notifications'
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

module.exports = Notification;
