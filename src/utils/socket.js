import { io } from "socket.io-client";
import { getToken } from './tokenUtils';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001";

let socket;

export const getSocket = () => {
  const token = getToken();
  
  if (!token) {
    console.error('No authentication token found');
    return null;
  }

  if (!socket) {
    socket = io(SOCKET_URL, { 
      autoConnect: true,
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity, // Keep trying to reconnect indefinitely
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false,
      upgrade: true
    });
    
    socket.on('connect', () => {
      console.log('Socket connected successfully:', socket.id);
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      if (error.message.includes('Authentication error')) {
        console.error('Authentication failed - please log in again');
      }
      // Try to reconnect after a delay
      setTimeout(() => {
        if (socket && !socket.connected) {
          console.log('Attempting to reconnect after error...');
          socket.connect();
        }
      }, 3000);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      // Auto-reconnect on any disconnect
      if (reason === 'io server disconnect' || reason === 'transport close') {
        setTimeout(() => {
          if (socket && !socket.connected) {
            console.log('Attempting to reconnect after disconnect...');
            socket.connect();
          }
        }, 1000);
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
    });

    socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
    });

    socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed - will keep trying');
      // Even after reconnection fails, keep trying
      setTimeout(() => {
        if (socket && !socket.connected) {
          console.log('Retrying connection after failure...');
          socket.connect();
        }
      }, 5000);
    });

    // Ensure connection is established
    if (!socket.connected) {
      socket.connect();
    }
  } else if (!socket.connected) {
    // Reconnect if disconnected
    console.log('Socket exists but not connected, reconnecting...');
    socket.connect();
  }
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const isSocketConnected = () => {
  return socket && socket.connected;
}; 