const { getIO } = require('../utils/socket.utils');

class AppointmentHandler {
  constructor(io) {
    this.io = io;
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User ${socket.userId} connected to appointment handler`);

      socket.join(socket.userId);

      socket.on('appointment:status_update', (data) => {
        this.handleAppointmentStatusUpdate(socket, data);
      });

      socket.on('appointment:created', (data) => {
        this.handleAppointmentCreated(socket, data);
      });

      socket.on('appointment:updated', (data) => {
        this.handleAppointmentUpdated(socket, data);
      });

      socket.on('appointment:reschedule_request', (data) => {
        this.handleRescheduleRequest(socket, data);
      });

      socket.on('disconnect', () => {
        console.log(`User ${socket.userId} disconnected from appointment handler`);
      });
    });
  }

  emitAppointmentStatusUpdate(appointment) {
    const io = getIO();
    
    if (appointment.patient && appointment.patient.user) {
      io.to(appointment.patient.user.toString()).emit('appointment:status_changed', {
        appointmentId: appointment._id.toString(),
        status: appointment.status,
        message: `Your appointment status has been updated to: ${appointment.status}`,
        appointment: appointment
      });
    }

    if (appointment.doctor && appointment.doctor.user) {
      io.to(appointment.doctor.user.toString()).emit('appointment:status_changed', {
        appointmentId: appointment._id.toString(),
        status: appointment.status,
        message: `Appointment status updated to: ${appointment.status}`,
        appointment: appointment
      });
    }
  }

  emitNewAppointment(appointment) {
    const io = getIO();
    
    if (appointment.doctor && appointment.doctor.user) {
      io.to(appointment.doctor.user.toString()).emit('appointment:new', {
        appointmentId: appointment._id.toString(),
        message: `New appointment request from ${appointment.patient?.user?.firstName || 'Patient'}`,
        appointment: appointment
      });
    }
  }

  emitAppointmentUpdate(appointment, updateType = 'updated') {
    const io = getIO();
    
    const eventData = {
      appointmentId: appointment._id.toString(),
      updateType,
      message: `Appointment has been ${updateType}`,
      appointment: appointment
    };

    if (appointment.patient && appointment.patient.user) {
      io.to(appointment.patient.user.toString()).emit('appointment:updated', eventData);
    }

    
    if (appointment.doctor && appointment.doctor.user) {
      io.to(appointment.doctor.user.toString()).emit('appointment:updated', eventData);
    }
  }

  emitRescheduleRequest(appointment) {
    const io = getIO();
    
    if (appointment.doctor && appointment.doctor.user) {
      io.to(appointment.doctor.user.toString()).emit('appointment:reschedule_requested', {
        appointmentId: appointment._id.toString(),
        message: `Reschedule request from ${appointment.patient?.user?.firstName || 'Patient'}`,
        rescheduleRequest: appointment.rescheduleRequest,
        appointment: appointment
      });
    }
  }

  handleAppointmentStatusUpdate(socket, data) {
    console.log('Appointment status update received:', data);

    socket.emit('appointment:status_update_ack', { success: true });
  }

  handleAppointmentCreated(socket, data) {
    console.log('Appointment created event received:', data);
    socket.emit('appointment:created_ack', { success: true });
  }

  handleAppointmentUpdated(socket, data) {
    console.log('Appointment updated event received:', data);
    socket.emit('appointment:updated_ack', { success: true });
  }

  handleRescheduleRequest(socket, data) {
    console.log('Reschedule request received:', data);
    socket.emit('appointment:reschedule_request_ack', { success: true });
  }
}

module.exports = AppointmentHandler; 