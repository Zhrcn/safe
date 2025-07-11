import { io } from "socket.io-client";
import { getToken } from './tokenUtils';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001";

let socket;

export const getSocket = () => {
  const token = getToken();
  
  if (!token) {
    console.error('[Socket] No authentication token found. Socket connection will NOT be established. Please log in.');
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
      reconnectionAttempts: Infinity, 
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false,
      upgrade: true
    });
    
    socket.on('connect', () => {
      console.log('[Socket] Connected successfully:', socket.id);
      console.log('[Socket] Auth token:', token ? 'Present' : 'Missing');
    });
    
    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
      if (error.message.includes('Authentication error')) {
        console.error('[Socket] Authentication failed - please log in again.');
      } else if (error.message.includes('xhr poll error') || error.message.includes('timeout')) {
        console.warn('[Socket] Backend unreachable at', SOCKET_URL, '- is the server running?');
      }
      setTimeout(() => {
        if (socket && !socket.connected) {
          console.log('[Socket] Attempting to reconnect after error...');
          socket.connect();
        }
      }, 3000);
    });
    
    socket.on('disconnect', (reason) => {
      console.warn('[Socket] Disconnected:', reason);
      if (reason === 'io server disconnect' || reason === 'transport close') {
        setTimeout(() => {
          if (socket && !socket.connected) {
            console.log('[Socket] Attempting to reconnect after disconnect...');
            socket.connect();
          }
        }, 1000);
      }
    });

    socket.on('error', (error) => {
      console.error('[Socket] General error:', error);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('[Socket] Reconnected after', attemptNumber, 'attempts');
    });

    socket.on('reconnect_error', (error) => {
      console.error('[Socket] Reconnection error:', error);
    });

    socket.on('reconnect_failed', () => {
      console.error('[Socket] Reconnection failed - will keep trying');
      setTimeout(() => {
        if (socket && !socket.connected) {
          console.log('[Socket] Retrying connection after failure...');
          socket.connect();
        }
      }, 5000);
    });

    if (!socket.connected) {
      socket.connect();
    }
  } else if (!socket.connected) {
    console.log('[Socket] Socket exists but not connected, reconnecting...');
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