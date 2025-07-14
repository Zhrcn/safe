import { io } from "socket.io-client";
import { getToken } from './tokenUtils';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001";

let socket = null;
let connectionAttempts = 0;
const MAX_RECONNECTION_ATTEMPTS = 3;
let isBackendUnavailable = false;

export const getSocket = () => {
  const token = getToken();
  
  if (!token) {
    console.warn('[Socket] No authentication token found. Socket connection will NOT be established.');
    return null;
  }

  if (isBackendUnavailable) {
    return null;
  }

  if (socket && socket.connected) {
    return socket;
  }

  if (socket && !socket.connected && connectionAttempts < MAX_RECONNECTION_ATTEMPTS) {
    console.log('[Socket] Socket exists but not connected, reconnecting...', connectionAttempts + 1);
    connectionAttempts++;
    socket.connect();
    return socket;
  }

  if (connectionAttempts >= MAX_RECONNECTION_ATTEMPTS) {
    console.warn('[Socket] Max reconnection attempts reached. Backend may be unavailable.');
    isBackendUnavailable = true;
    disconnectSocket();
    return null;
  }

  if (!socket) {
    console.log('[Socket] Creating new socket connection...');
    socket = io(SOCKET_URL, { 
      autoConnect: false, 
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: false, 
      timeout: 10000, 
      forceNew: true,
      upgrade: true
    });
    
    socket.on('connect', () => {
      console.log('[Socket] Connected successfully:', socket.id);
      console.log('[Socket] Auth token:', token ? 'Present' : 'Missing');
      connectionAttempts = 0; 
      isBackendUnavailable = false; 
    });
    
    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
      connectionAttempts++;
      
      if (error.message.includes('Authentication error')) {
        console.error('[Socket] Authentication failed - please log in again.');
        disconnectSocket();
      } else if (error.message.includes('xhr poll error') || error.message.includes('timeout') || error.message.includes('transport close')) {
        console.warn('[Socket] Backend unreachable at', SOCKET_URL, '- is the server running?');
        if (connectionAttempts >= MAX_RECONNECTION_ATTEMPTS) {
          isBackendUnavailable = true;
        }
      }
      
      if (connectionAttempts < MAX_RECONNECTION_ATTEMPTS) {
        setTimeout(() => {
          if (socket && !socket.connected) {
            console.log('[Socket] Attempting to reconnect after error...', connectionAttempts);
            socket.connect();
          }
        }, 2000);
      }
    });
    
    socket.on('disconnect', (reason) => {
      console.warn('[Socket] Disconnected:', reason);
      if (reason === 'io server disconnect' || reason === 'transport close') {
        if (connectionAttempts < MAX_RECONNECTION_ATTEMPTS) {
          setTimeout(() => {
            if (socket && !socket.connected) {
              console.log('[Socket] Attempting to reconnect after disconnect...', connectionAttempts + 1);
              connectionAttempts++;
              socket.connect();
            }
          }, 1000);
        }
      }
    });

    socket.on('error', (error) => {
      console.error('[Socket] General error:', error);
    });

    socket.connect();
  }
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    connectionAttempts = 0;
    isBackendUnavailable = false;
  }
};

export const isSocketConnected = () => {
  return socket && socket.connected;
};

export const resetSocketConnection = () => {
  disconnectSocket();
  isBackendUnavailable = false;
  connectionAttempts = 0;
}; 