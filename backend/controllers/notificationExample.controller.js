const notificationService = require('../utils/notificationService');
const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

exports.sendAppointmentNotification = asyncHandler(async (req, res, next) => {
  const { userId, appointmentData } = req.body;
  
  try {
    await notificationService.sendAppointmentNotification(userId, {
      title: 'Appointment Confirmed',
      message: 'Your appointment has been confirmed for tomorrow at 2:00 PM',
      appointmentId: appointmentData.appointmentId,
      priority: 'normal',
      data: {
        appointmentDate: appointmentData.date,
        doctorName: appointmentData.doctorName,
        location: appointmentData.location
      }
    });
    
    res.status(200).json(new ApiResponse(200, null, 'Appointment notification sent successfully'));
  } catch (error) {
    next(error);
  }
});

exports.sendMessageNotification = asyncHandler(async (req, res, next) => {
  const { userId, messageData } = req.body;
  
  try {
    await notificationService.sendMessageNotification(userId, {
      title: 'New Message',
      message: 'You have received a new message',
      conversationId: messageData.conversationId,
      senderName: messageData.senderName,
      text: messageData.text,
      data: {
        conversationId: messageData.conversationId,
        senderId: messageData.senderId
      }
    });
    
    res.status(200).json(new ApiResponse(200, null, 'Message notification sent successfully'));
  } catch (error) {
    next(error);
  }
});

exports.sendPrescriptionNotification = asyncHandler(async (req, res, next) => {
  const { userId, prescriptionData } = req.body;
  
  try {
    await notificationService.sendPrescriptionNotification(userId, {
      title: 'New Prescription',
      message: 'A new prescription has been issued for you',
      prescriptionId: prescriptionData.prescriptionId,
      priority: 'normal',
      data: {
        medicationName: prescriptionData.medicationName,
        dosage: prescriptionData.dosage,
        doctorName: prescriptionData.doctorName
      }
    });
    
    res.status(200).json(new ApiResponse(200, null, 'Prescription notification sent successfully'));
  } catch (error) {
    next(error);
  }
});

exports.sendReferralNotification = asyncHandler(async (req, res, next) => {
  const { userId, referralData } = req.body;
  
  try {
    await notificationService.sendReferralNotification(userId, {
      title: 'New Referral Request',
      message: 'You have received a new patient referral',
      referralId: referralData.referralId,
      data: {
        patientName: referralData.patientName,
        fromDoctor: referralData.fromDoctor,
        reason: referralData.reason,
        urgency: referralData.urgency
      }
    });
    
    res.status(200).json(new ApiResponse(200, null, 'Referral notification sent successfully'));
  } catch (error) {
    next(error);
  }
});

exports.sendReminderNotification = asyncHandler(async (req, res, next) => {
  const { userId, reminderData } = req.body;
  
  try {
    await notificationService.sendReminderNotification(userId, {
      title: 'Medication Reminder',
      message: 'Time to take your medication',
      reminderId: reminderData.reminderId,
      data: {
        medicationName: reminderData.medicationName,
        dosage: reminderData.dosage,
        time: reminderData.time
      }
    });
    
    res.status(200).json(new ApiResponse(200, null, 'Reminder notification sent successfully'));
  } catch (error) {
    next(error);
  }
});

exports.testRealTimeNotification = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  
  try {
    await notificationService.sendGeneralNotification(userId, {
      title: 'Test Real-Time Notification',
      message: 'This is a test notification sent from the backend! It should appear immediately without refresh.',
      priority: 'high',
      data: {
        test: true,
        timestamp: new Date().toISOString(),
        source: 'backend-test'
      }
    });
    
    res.status(200).json(new ApiResponse(200, null, 'Test notification sent successfully'));
  } catch (error) {
    next(error);
  }
});

exports.sendToMultipleUsers = asyncHandler(async (req, res, next) => {
  const { userIds, notificationData } = req.body;
  
  try {
    await notificationService.sendToMultipleUsers(userIds, {
      type: 'general',
      title: 'System Maintenance',
      message: 'System will be down for maintenance from 2:00 AM to 4:00 AM',
      priority: 'normal',
      data: {
        maintenanceStart: '2:00 AM',
        maintenanceEnd: '4:00 AM',
        reason: 'System updates'
      }
    });
    
    res.status(200).json(new ApiResponse(200, null, 'Notifications sent to multiple users successfully'));
  } catch (error) {
    next(error);
  }
});

exports.sendToAllDoctors = asyncHandler(async (req, res, next) => {
  const { notificationData } = req.body;
  
  try {
    await notificationService.sendToRole('doctor', {
      type: 'general',
      title: 'New Protocol Update',
      message: 'New medical protocols have been updated. Please review.',
      priority: 'normal',
      data: {
        protocolVersion: '2.1',
        effectiveDate: '2024-01-15',
        changes: ['Updated dosage guidelines', 'New contraindications added']
      }
    });
    
    res.status(200).json(new ApiResponse(200, null, 'Notification sent to all doctors successfully'));
  } catch (error) {
    next(error);
  }
});

exports.broadcastToAll = asyncHandler(async (req, res, next) => {
  const { notificationData } = req.body;
  
  try {
    await notificationService.broadcastToAll({
      type: 'general',
      title: 'Important Announcement',
      message: 'Welcome to the new version of SafeApp!',
      priority: 'normal',
      data: {
        version: '2.0',
        features: ['Enhanced UI', 'Better performance', 'New features']
      }
    });
    
    res.status(200).json(new ApiResponse(200, null, 'Broadcast notification sent successfully'));
  } catch (error) {
    next(error);
  }
});

exports.sendCustomNotification = asyncHandler(async (req, res, next) => {
  const { userId, notificationData } = req.body;
  
  try {
    await notificationService.sendNotification(userId, {
      type: notificationData.type || 'general',
      title: notificationData.title,
      message: notificationData.message,
      priority: notificationData.priority || 'normal',
      data: notificationData.data || {},
      relatedId: notificationData.relatedId,
      relatedModel: notificationData.relatedModel
    });
    
    res.status(200).json(new ApiResponse(200, null, 'Custom notification sent successfully'));
  } catch (error) {
    next(error);
  }
}); 