const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['message', 'appointment', 'prescription', 'inquiry', 'general', 'consultation', 'medical_file_update', 'reminder'], 
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
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedModel'
  },
  relatedModel: {
    type: String,
    enum: ['Appointment', 'Prescription', 'Conversation', 'Inquiry', 'Consultation', 'MedicalFile', 'User'], 
  },
}, {
  timestamps: true,
  collection: 'Notifications'
});
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
