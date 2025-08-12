const { getIO } = require('../utils/socket.utils');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

class PrescriptionHandler {
  constructor(io) {
    this.io = io;
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {

      socket.join(socket.userId);

      socket.on('prescription:status_update', (data) => {
        this.handlePrescriptionStatusUpdate(socket, data);
      });

      socket.on('prescription:created', (data) => {
        this.handlePrescriptionCreated(socket, data);
      });

      socket.on('prescription:updated', (data) => {
        this.handlePrescriptionUpdated(socket, data);
      });

      socket.on('prescription:dispensed', (data) => {
        this.handlePrescriptionDispensed(socket, data);
      });

      socket.on('prescription:refill_request', (data) => {
        this.handleRefillRequest(socket, data);
      });

      socket.on('disconnect', () => {
        console.log(`User ${socket.userId} disconnected from prescription handler`);
      });
    });

    setInterval(() => {
      this.checkAndEmitExpiryWarnings();
    }, 6 * 60 * 60 * 1000);

    setTimeout(() => {
      this.checkAndEmitExpiryWarnings();
    }, 5000); 
  }

  emitPrescriptionCreated(prescription) {
    const io = getIO();
    
    if (prescription.patientId) {
      io.to(prescription.patientId.toString()).emit('prescription:new', {
        prescriptionId: prescription._id.toString(),
        message: `New prescription from Dr. ${prescription.doctorId?.user?.firstName || 'Doctor'}`,
        prescription: prescription,
        type: 'created'
      });
    }
  }

  emitPrescriptionUpdated(prescription, updateType = 'updated') {
    const io = getIO();
    
    const eventData = {
      prescriptionId: prescription._id.toString(),
      updateType,
      message: `Your prescription has been ${updateType}`,
      prescription: prescription,
      type: 'updated'
    };

    if (prescription.patientId) {
      io.to(prescription.patientId.toString()).emit('prescription:updated', eventData);
    }
  }

  emitPrescriptionStatusChange(prescription, oldStatus, newStatus) {
    const io = getIO();
    
    if (prescription.patientId) {
      io.to(prescription.patientId.toString()).emit('prescription:status_changed', {
        prescriptionId: prescription._id.toString(),
        oldStatus,
        newStatus,
        message: `Your prescription status has changed from ${oldStatus} to ${newStatus}`,
        prescription: prescription,
        type: 'status_change'
      });
    }
  }

  emitPrescriptionDispensed(prescription, dispenseData) {
    const io = getIO();
    
    if (prescription.patientId) {
      io.to(prescription.patientId.toString()).emit('prescription:dispensed', {
        prescriptionId: prescription._id.toString(),
        message: 'Your prescription has been dispensed',
        dispenseData,
        prescription: prescription,
        type: 'dispensed'
      });
    }
  }

  emitRefillRequest(prescription, refillData) {
    const io = getIO();
    
    if (prescription.doctorId) {
      io.to(prescription.doctorId.toString()).emit('prescription:refill_requested', {
        prescriptionId: prescription._id.toString(),
        message: `Refill request for prescription from ${prescription.patientId?.firstName || 'Patient'}`,
        refillData,
        prescription: prescription,
        type: 'refill_request'
      });
    }
  }

  emitPrescriptionExpiryWarning(prescription, daysUntilExpiry) {
    const io = getIO();
    
    if (prescription.patientId) {
      io.to(prescription.patientId.toString()).emit('prescription:expiry_warning', {
        prescriptionId: prescription._id.toString(),
        message: `Your prescription will expire in ${daysUntilExpiry} days`,
        daysUntilExpiry,
        prescription: prescription,
        type: 'expiry_warning'
      });
    }
  }

  async checkAndEmitExpiryWarnings() {
    try {
      const today = new Date();
      const prescriptions = await Prescription.find({
        status: { $in: ['active', 'partially_filled'] },
        expiryDate: { $exists: true }
      }).populate('patientId', 'firstName lastName');

      for (const prescription of prescriptions) {
        const daysUntilExpiry = Math.ceil((prescription.expiryDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
          this.emitPrescriptionExpiryWarning(prescription, daysUntilExpiry);
        }
        
        if (daysUntilExpiry < 0 && prescription.status !== 'expired') {
          prescription.status = 'expired';
          await prescription.save();
          
          this.emitPrescriptionStatusChange(prescription, prescription.status, 'expired');
        }
      }
    } catch (error) {
      console.error('Error checking prescription expiry warnings:', error);
    }
  }


  handlePrescriptionStatusUpdate(socket, data) {
    socket.emit('prescription:status_update_ack', { success: true });
  }

  handlePrescriptionCreated(socket, data) {
    socket.emit('prescription:created_ack', { success: true });
  }

  handlePrescriptionUpdated(socket, data) {
    socket.emit('prescription:updated_ack', { success: true });
  }

  handlePrescriptionDispensed(socket, data) {
    socket.emit('prescription:dispensed_ack', { success: true });
  }

  handleRefillRequest(socket, data) {
    socket.emit('prescription:refill_request_ack', { success: true });
  }

  async broadcastPrescriptionUpdate(prescription, eventType, additionalData = {}) {
    const io = getIO();
    
    const eventData = {
      prescriptionId: prescription._id.toString(),
      eventType,
      prescription: prescription,
      timestamp: new Date(),
      ...additionalData
    };

    if (prescription.patientId) {
      io.to(prescription.patientId.toString()).emit(`prescription:${eventType}`, eventData);
    }

    if (prescription.doctorId) {
      io.to(prescription.doctorId.toString()).emit(`prescription:${eventType}`, eventData);
    }
    
    io.to('role:pharmacist').emit(`prescription:${eventType}`, eventData);
  }
}

module.exports = PrescriptionHandler; 