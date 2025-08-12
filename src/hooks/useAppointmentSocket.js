import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getSocket, isSocketConnected } from '../utils/socket';
import { refetchAppointments } from '../utils/appointmentUtils';

const useAppointmentSocket = () => {
  const dispatch = useRef();
  const socketRef = useRef(null);
  const listenersAddedRef = useRef(false);

  useEffect(() => {
    console.log('🔌 Appointment socket hook: Initializing...');
    
    const socket = getSocket();
    if (!socket) {
      console.warn('🔌 Appointment socket hook: No socket available');
      return;
    }

    socketRef.current = socket;
    console.log('🔌 Appointment socket hook: Socket obtained, connected:', socket.connected);

    if (socket.connected && !listenersAddedRef.current) {
      addEventListeners(socket);
    }

    const handleConnect = () => {
      console.log('🔌 Appointment socket hook: Socket connected, adding listeners');
      if (!listenersAddedRef.current) {
        addEventListeners(socket);
      }
      
      setTimeout(() => {
        console.log('🧪 Testing socket connection...');
        socket.emit('test:connection', { message: 'Socket connection test' });
      }, 1000);
    };

    const handleDisconnect = () => {
      console.log('🔌 Appointment socket hook: Socket disconnected');
      listenersAddedRef.current = false;
    };

    const handleTestResponse = (data) => {
      console.log('🧪 Socket test response received:', data);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('test:response', handleTestResponse);


    return () => {
      console.log('🔌 Appointment socket hook: Cleaning up...');
      if (socket) {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('test:response', handleTestResponse);
        removeEventListeners(socket);
      }
    };
  }, []);

  const addEventListeners = (socket) => {
    if (listenersAddedRef.current) return;
    
    console.log('🔌 Appointment socket hook: Adding event listeners...');


    socket.on('appointment:new', (data) => {
      console.log('📨 Appointment socket: New appointment received');
      handleNewAppointment(data);
    });


    socket.on('appointment:status_changed', (data) => {
      console.log('📨 Appointment socket: Status changed');
      handleStatusChange(data);
    });


    socket.on('appointment:updated', (data) => {
      console.log('📨 Appointment socket: Appointment updated');
      handleAppointmentUpdate(data);
    });


    socket.on('appointment:reschedule_requested', (data) => {
      console.log('📨 Appointment socket: Reschedule requested');
      handleRescheduleRequest(data);
    });


    socket.on('appointment:deleted', (data) => {
      console.log('📨 Appointment socket: Appointment deleted');
      handleAppointmentDeleted(data);
    });

    listenersAddedRef.current = true;
    console.log('🔌 Appointment socket hook: Event listeners added');
  };

  const removeEventListeners = (socket) => {
    if (!listenersAddedRef.current) return;
    
    console.log('🔌 Appointment socket hook: Removing event listeners...');
    
    socket.off('appointment:new');
    socket.off('appointment:status_changed');
    socket.off('appointment:updated');
    socket.off('appointment:reschedule_requested');
    socket.off('appointment:deleted');
    
    listenersAddedRef.current = false;
    console.log('🔌 Appointment socket hook: Event listeners removed');
  };

  const handleNewAppointment = useCallback((data) => {
    console.log('🎯 Appointment hook: Handling new appointment for role:', store.getState().auth?.user?.role);
    

    setTimeout(() => {
      refetchAppointments();
    }, 100);
  }, []);

  const handleStatusChange = useCallback((data) => {
    console.log('🎯 Appointment hook: Handling status change');
    refetchAppointments();
  }, []);

  const handleAppointmentUpdate = useCallback((data) => {
    console.log('🎯 Appointment hook: Handling appointment update');
    refetchAppointments();
  }, []);

  const handleRescheduleRequest = useCallback((data) => {
    console.log('🎯 Appointment hook: Handling reschedule request');
    refetchAppointments();
  }, []);

  const handleAppointmentDeleted = useCallback((data) => {
    console.log('🎯 Appointment hook: Handling appointment deletion');
    refetchAppointments();
  }, []);

  return {
    isConnected: socketRef.current ? isSocketConnected() : false,
    socket: socketRef.current,
  };
};

export default useAppointmentSocket; 