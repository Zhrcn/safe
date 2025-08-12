const { getIO } = require('./socket.utils');
const { createNotification } = require('./notification.utils');

class NotificationService {
  constructor() {
    this.io = null;
  }

  initializeIO() {
    try {
      this.io = getIO();
    } catch (error) {
      this.io = null;
    }
  }

  async sendNotification(userId, notificationData) {
    try {
      if (!this.io) {
        this.initializeIO();
      }
      if (!this.io) {
        await createNotification(
          userId,
          notificationData.title || 'Notification',
          notificationData.message || 'You have a new notification',
          notificationData.type || 'general',
          notificationData.relatedId,
          notificationData.relatedModel
        );
        return { saved: true, realtime: false };
      }

      const notification = {
        id: `${notificationData.type}-${Date.now()}`,
        title: notificationData.title || 'Notification',
        message: notificationData.message || 'You have a new notification',
        type: notificationData.type || 'general',
        data: notificationData.data || {},
        priority: notificationData.priority || 'normal',
        timestamp: new Date()
      };

      this.io.to(`user:${userId}`).emit('notification:new', notification);

      await createNotification(
        userId,
        notification.title,
        notification.message,
        notification.type,
        notificationData.relatedId,
        notificationData.relatedModel
      );

      return notification;
    } catch (error) {
      throw error;
    }
  }

  async sendAppointmentNotification(userId, appointmentData) {
    return this.sendNotification(userId, {
      type: 'appointment',
      title: appointmentData.title || 'Appointment Update',
      message: appointmentData.message || 'Your appointment has been updated',
      priority: appointmentData.priority || 'normal',
      data: appointmentData,
      relatedId: appointmentData.appointmentId,
      relatedModel: 'Appointment'
    });
  }

  async sendMessageNotification(userId, messageData) {
    return this.sendNotification(userId, {
      type: 'message',
      title: messageData.title || 'New Message',
      message: messageData.message || `${messageData.senderName || 'Someone'}: ${messageData.text || 'sent you a message'}`,
      priority: 'high',
      data: messageData,
      relatedId: messageData.conversationId,
      relatedModel: 'Conversation'
    });
  }

  async sendPrescriptionNotification(userId, prescriptionData) {
    return this.sendNotification(userId, {
      type: 'prescription',
      title: prescriptionData.title || 'Prescription Update',
      message: prescriptionData.message || 'Your prescription has been updated',
      priority: prescriptionData.priority || 'normal',
      data: prescriptionData,
      relatedId: prescriptionData.prescriptionId,
      relatedModel: 'Prescription'
    });
  }

  async sendConsultationNotification(userId, consultationData) {
    return this.sendNotification(userId, {
      type: 'consultation',
      title: consultationData.title || 'Consultation Update',
      message: consultationData.message || 'Your consultation has been updated',
      priority: consultationData.priority || 'normal',
      data: consultationData,
      relatedId: consultationData.consultationId,
      relatedModel: 'Consultation'
    });
  }

  async sendReferralNotification(userId, referralData) {
    return this.sendNotification(userId, {
      type: 'referral',
      title: referralData.title || 'New Referral Request',
      message: referralData.message || 'You have received a new referral request',
      priority: 'high',
      data: referralData,
      relatedId: referralData.referralId,
      relatedModel: 'User'
    });
  }

  async sendMedicalFileNotification(userId, medicalFileData) {
    return this.sendNotification(userId, {
      type: 'medical_file_update',
      title: medicalFileData.title || 'Medical File Update',
      message: medicalFileData.message || 'Your medical file has been updated',
      priority: medicalFileData.priority || 'normal',
      data: medicalFileData,
      relatedId: medicalFileData.fileId,
      relatedModel: 'MedicalFile'
    });
  }

  async sendReminderNotification(userId, reminderData) {
    return this.sendNotification(userId, {
      type: 'reminder',
      title: reminderData.title || 'Reminder',
      message: reminderData.message || 'You have a reminder',
      priority: 'high',
      data: reminderData,
      relatedId: reminderData.reminderId,
      relatedModel: 'User'
    });
  }

  async sendInquiryNotification(userId, inquiryData) {
    return this.sendNotification(userId, {
      type: 'inquiry',
      title: inquiryData.title || 'Inquiry Update',
      message: inquiryData.message || 'Your inquiry has been updated',
      priority: inquiryData.priority || 'normal',
      data: inquiryData,
      relatedId: inquiryData.inquiryId,
      relatedModel: 'Inquiry'
    });
  }

  async sendGeneralNotification(userId, generalData) {
    return this.sendNotification(userId, {
      type: 'general',
      title: generalData.title || 'Notification',
      message: generalData.message || 'You have a new notification',
      priority: generalData.priority || 'normal',
      data: generalData,
      relatedId: generalData.relatedId,
      relatedModel: generalData.relatedModel
    });
  }

  async sendToMultipleUsers(userIds, notificationData) {
    const promises = userIds.map(userId => this.sendNotification(userId, notificationData));
    return Promise.all(promises);
  }

  async sendToRole(role, notificationData) {
    try {
      if (!this.io) {
        this.initializeIO();
      }
      if (!this.io) {
        return { saved: false, realtime: false };
      }

      const notification = {
        id: `${notificationData.type}-${Date.now()}`,
        title: notificationData.title || 'Notification',
        message: notificationData.message || 'You have a new notification',
        type: notificationData.type || 'general',
        data: notificationData.data || {},
        priority: notificationData.priority || 'normal',
        timestamp: new Date()
      };

      this.io.to(`role:${role}`).emit('notification:new', notification);

      return notification;
    } catch (error) {
      throw error;
    }
  }

  async broadcastToAll(notificationData) {
    try {
      if (!this.io) {
        this.initializeIO();
      }
      if (!this.io) {
        return { saved: false, realtime: false };
      }

      const notification = {
        id: `${notificationData.type}-${Date.now()}`,
        title: notificationData.title || 'Notification',
        message: notificationData.message || 'You have a new notification',
        type: notificationData.type || 'general',
        data: notificationData.data || {},
        priority: notificationData.priority || 'normal',
        timestamp: new Date()
      };

      this.io.emit('notification:new', notification);

      return notification;
    } catch (error) {
      throw error;
    }
  }
}

let notificationServiceInstance = null;

const getNotificationService = () => {
  if (!notificationServiceInstance) {
    notificationServiceInstance = new NotificationService();
  }
  return notificationServiceInstance;
};

module.exports = getNotificationService(); 