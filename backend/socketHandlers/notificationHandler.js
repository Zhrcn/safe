const Notification = require('../models/Notification');
const { createNotification } = require('../utils/notification.utils');

class NotificationHandler {
  constructor(io) {
    this.io = io;
    this.userRooms = new Map();
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {

      if (socket.userId) {
        this.userRooms.set(socket.userId, socket.id);
      }

      socket.on('join', ({ userId, role }) => {
        this.handleJoin(socket, userId, role);
      });

      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  handleJoin(socket, userId, role) {
    socket.join(`user:${userId}`);
    socket.join(`role:${role}`);
    this.userRooms.set(userId, socket.id);
  }

  handleDisconnect(socket) {
    if (socket.userId) {
      this.userRooms.delete(socket.userId);
    }
  }

  async sendToUser(userId, notificationData) {
    try {
      const socketId = this.userRooms.get(userId);
      if (socketId) {
        this.io.to(socketId).emit('notification:new', notificationData);
      }
    } catch (error) {
      console.error('NotificationHandler: Error sending to user:', error);
    }
  }

  async sendToRole(role, notificationData) {
    try {
      this.io.to(`role:${role}`).emit('notification:new', notificationData);
    } catch (error) {
      console.error('NotificationHandler: Error sending to role:', error);
    }
  }

  async sendToUsers(userIds, notificationData) {
    try {
      userIds.forEach(userId => {
        const socketId = this.userRooms.get(userId);
        if (socketId) {
          this.io.to(socketId).emit('notification:new', notificationData);
        }
      });
    } catch (error) {
      console.error('NotificationHandler: Error sending to users:', error);
    }
  }

  async broadcastToAll(notificationData) {
    try {
      this.io.emit('notification:new', notificationData);
    } catch (error) {
      console.error('NotificationHandler: Error broadcasting:', error);
    }
  }

  async sendAppointmentNotification(userId, appointmentData) {
    const notification = {
      id: `appointment-${Date.now()}`,
      title: appointmentData.title || 'Appointment Update',
      message: appointmentData.message || 'Your appointment has been updated',
      type: 'appointment',
      data: appointmentData,
      priority: appointmentData.priority || 'normal',
      timestamp: new Date()
    };

    await this.sendToUser(userId, notification);

    await createNotification(
      userId,
      notification.title,
      notification.message,
      'appointment',
      appointmentData.appointmentId,
      'Appointment'
    );
  }

  async sendMessageNotification(userId, messageData) {
    const notification = {
      id: `message-${Date.now()}`,
      title: messageData.title || 'New Message',
      message: messageData.message || `${messageData.senderName || 'Someone'}: ${messageData.text || 'sent you a message'}`,
      type: 'message',
      data: messageData,
      priority: 'high',
      timestamp: new Date()
    };

    await this.sendToUser(userId, notification);

    await createNotification(
      userId,
      notification.title,
      notification.message,
      'message',
      messageData.conversationId,
      'Conversation'
    );
  }

  async sendPrescriptionNotification(userId, prescriptionData) {
    const notification = {
      id: `prescription-${Date.now()}`,
      title: prescriptionData.title || 'Prescription Update',
      message: prescriptionData.message || 'Your prescription has been updated',
      type: 'prescription',
      data: prescriptionData,
      priority: prescriptionData.priority || 'normal',
      timestamp: new Date()
    };

    await this.sendToUser(userId, notification);

    await createNotification(
      userId,
      notification.title,
      notification.message,
      'prescription',
      prescriptionData.prescriptionId,
      'Prescription'
    );
  }

  async sendConsultationNotification(userId, consultationData) {
    const notification = {
      id: `consultation-${Date.now()}`,
      title: consultationData.title || 'Consultation Update',
      message: consultationData.message || 'Your consultation has been updated',
      type: 'consultation',
      data: consultationData,
      priority: consultationData.priority || 'normal',
      timestamp: new Date()
    };

    await this.sendToUser(userId, notification);

    await createNotification(
      userId,
      notification.title,
      notification.message,
      'consultation',
      consultationData.consultationId,
      'Consultation'
    );
  }

  async sendReferralNotification(userId, referralData) {
    const notification = {
      id: `referral-${Date.now()}`,
      title: referralData.title || 'New Referral Request',
      message: referralData.message || 'You have received a new referral request',
      type: 'referral',
      data: referralData,
      priority: 'high',
      timestamp: new Date()
    };

    await this.sendToUser(userId, notification);

    await createNotification(
      userId,
      notification.title,
      notification.message,
      'referral',
      referralData.referralId,
      'User'
    );
  }

  async sendMedicalFileNotification(userId, medicalFileData) {
    const notification = {
      id: `medical-file-${Date.now()}`,
      title: medicalFileData.title || 'Medical File Update',
      message: medicalFileData.message || 'Your medical file has been updated',
      type: 'medical_file_update',
      data: medicalFileData,
      priority: medicalFileData.priority || 'normal',
      timestamp: new Date()
    };

    await this.sendToUser(userId, notification);

    await createNotification(
      userId,
      notification.title,
      notification.message,
      'medical_file_update',
      medicalFileData.fileId,
      'MedicalFile'
    );
  }

  async sendReminderNotification(userId, reminderData) {
    const notification = {
      id: `reminder-${Date.now()}`,
      title: reminderData.title || 'Reminder',
      message: reminderData.message || 'You have a reminder',
      type: 'reminder',
      data: reminderData,
      priority: 'high',
      timestamp: new Date()
    };

    await this.sendToUser(userId, notification);

    await createNotification(
      userId,
      notification.title,
      notification.message,
      'reminder',
      reminderData.reminderId,
      'User'
    );
  }

  async sendGeneralNotification(userId, generalData) {
    const notification = {
      id: `general-${Date.now()}`,
      title: generalData.title || 'Notification',
      message: generalData.message || 'You have a new notification',
      type: 'general',
      data: generalData,
      priority: generalData.priority || 'normal',
      timestamp: new Date()
    };

    await this.sendToUser(userId, notification);

    await createNotification(
      userId,
      notification.title,
      notification.message,
      'general',
      generalData.relatedId,
      generalData.relatedModel
    );
  }

  async sendInquiryNotification(userId, inquiryData) {
    const notification = {
      id: `inquiry-${Date.now()}`,
      title: inquiryData.title || 'Inquiry Update',
      message: inquiryData.message || 'Your inquiry has been updated',
      type: 'inquiry',
      data: inquiryData,
      priority: inquiryData.priority || 'normal',
      timestamp: new Date()
    };

    await this.sendToUser(userId, notification);

    await createNotification(
      userId,
      notification.title,
      notification.message,
      'inquiry',
      inquiryData.inquiryId,
      'Inquiry'
    );
  }

  getOnlineUsersCount() {
    return this.userRooms.size;
  }

  getOnlineUsers() {
    return Array.from(this.userRooms.keys());
  }

  isUserOnline(userId) {
    return this.userRooms.has(userId);
  }
}

module.exports = NotificationHandler; 