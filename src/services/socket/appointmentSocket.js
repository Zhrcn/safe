import { getSocket, isSocketConnected } from '../../utils/socket';

class AppointmentSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect() {
    this.socket =  
  getSocket();
    
    if (!this.socket) {
      console.warn('Appointment socket: No socket available');
      return;
    }

    if (this.isConnected) {
      return;
    }

    this.isConnected = isSocketConnected();
    
    if (this.isConnected) {
      console.log('Appointment socket: Using existing connection');
      this.setupEventListeners();
    } else {
      console.log('Appointment socket: Waiting for connection...');
      this.socket.on('connect', () => {
        console.log('Appointment socket: Connected');
        this.isConnected = true;
        this.setupEventListeners();
      });
    }
  }

  setupEventListeners() {
    console.log('Appointment socket: Setting up event listeners...');
    
    this.socket.on('appointment:new', (data) => {
      console.log('Appointment socket: New appointment received:', data);
      this.notifyListeners('appointment:new', data);
    });

    this.socket.on('appointment:status_changed', (data) => {
      console.log('Appointment socket: Appointment status changed:', data);
      this.notifyListeners('appointment:status_changed', data);
    });

    this.socket.on('appointment:updated', (data) => {
      console.log('Appointment socket: Appointment updated:', data);
      this.notifyListeners('appointment:updated', data);
    });

    this.socket.on('appointment:reschedule_requested', (data) => {
      console.log('Appointment socket: Reschedule request received:', data);
      this.notifyListeners('appointment:reschedule_requested', data);
    });

    this.socket.on('appointment:status_update_ack', (data) => {
      console.log('Status update acknowledged:', data);
      this.notifyListeners('appointment:status_update_ack', data);
    });

    this.socket.on('appointment:created_ack', (data) => {
      console.log('Appointment creation acknowledged:', data);
      this.notifyListeners('appointment:created_ack', data);
    });

    this.socket.on('appointment:updated_ack', (data) => {
      console.log('Appointment update acknowledged:', data);
      this.notifyListeners('appointment:updated_ack', data);
    });

    this.socket.on('appointment:reschedule_request_ack', (data) => {
      console.log('Reschedule request acknowledged:', data);
      this.notifyListeners('appointment:reschedule_request_ack', data);
    });
  }

  on(event, callback) {
    console.log(`Appointment socket: Adding listener for event: ${event}`);
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    console.log(`Appointment socket: Total listeners for ${event}: ${this.listeners.get(event).length}`);
  }

  off(event, callback) {
    console.log(`Appointment socket: Removing listener for event: ${event}`);
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
        console.log(`Appointment socket: Listener removed for ${event}. Remaining: ${callbacks.length}`);
      }
    }
  }

  notifyListeners(event, data) {
    console.log(`Appointment socket: Notifying listeners for event: ${event}`, data);
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      console.log(`Appointment socket: Found ${callbacks.length} listeners for event: ${event}`);
      callbacks.forEach((callback, index) => {
        try {
          console.log(`Appointment socket: Calling listener ${index + 1} for event: ${event}`);
          callback(data);
        } catch (error) {
          console.error('Error in appointment socket listener:', error);
        }
      });
    } else {
      console.log(`Appointment socket: No listeners found for event: ${event}`);
    }
  }


  emitAppointmentStatusUpdate(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('appointment:status_update', data);
    }
  }

  emitAppointmentCreated(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('appointment:created', data);
    }
  }

  emitAppointmentUpdated(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('appointment:updated', data);
    }
  }

  emitRescheduleRequest(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('appointment:reschedule_request', data);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }


  getConnectionStatus() {
    return this.socket ? isSocketConnected() : false;
  }
}

const appointmentSocketService = new AppointmentSocketService();

export default appointmentSocketService; 