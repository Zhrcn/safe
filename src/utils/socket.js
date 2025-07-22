import { io } from "socket.io-client";
import { getToken } from './tokenUtils';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001";

let socket = null;
let connectionAttempts = 0;
const MAX_RECONNECTION_ATTEMPTS = 5;
let isBackendUnavailable = false;
let lastErrorLogTime = 0;

function showBackendUnavailableMessage() {
  if (typeof window !== 'undefined') {
    alert('Unable to connect to the server. Please try again later.');
  }
}

export const getSocket = () => {
  const token = getToken();
  
  if (!token) {
    if (connectionAttempts === 0) {
      console.warn('[Socket] No authentication token found. Socket connection will NOT be established.');
    }
    return null;
  }

  if (isBackendUnavailable) {
    return null;
  }

  if (socket && socket.connected) {
    return socket;
  }

  if (socket && !socket.connected && connectionAttempts < MAX_RECONNECTION_ATTEMPTS) {
    if (Date.now() - lastErrorLogTime > 5000) {
      console.log('[Socket] Socket exists but not connected, reconnecting...', connectionAttempts + 1);
      lastErrorLogTime = Date.now();
    }
    connectionAttempts++;
    socket.connect();
    return socket;
  }

  if (connectionAttempts >= MAX_RECONNECTION_ATTEMPTS) {
    if (!isBackendUnavailable) {
      console.warn('[Socket] Max reconnection attempts reached. Backend may be unavailable.');
      showBackendUnavailableMessage();
    }
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
      if (Date.now() - lastErrorLogTime > 5000) {
        console.error('[Socket] Connection error:', error.message);
        lastErrorLogTime = Date.now();
      }
      connectionAttempts++;
      let delay = Math.min(2000 * Math.pow(2, connectionAttempts), 20000);
      
      if (error.message.includes('Authentication error')) {
        console.error('[Socket] Authentication failed - please log in again.');
        disconnectSocket();
      } else if (error.message.includes('xhr poll error') || error.message.includes('timeout') || error.message.includes('transport close')) {
        if (connectionAttempts >= MAX_RECONNECTION_ATTEMPTS) {
          isBackendUnavailable = true;
          showBackendUnavailableMessage();
        }
      }
      
      if (connectionAttempts < MAX_RECONNECTION_ATTEMPTS) {
        setTimeout(() => {
          if (socket && !socket.connected) {
            if (Date.now() - lastErrorLogTime > 5000) {
              console.log('[Socket] Attempting to reconnect after error...', connectionAttempts);
              lastErrorLogTime = Date.now();
            }
            socket.connect();
          }
        }, delay);
      }
    });
    
    socket.on('disconnect', (reason) => {
      if (Date.now() - lastErrorLogTime > 5000) {
        console.warn('[Socket] Disconnected:', reason);
        lastErrorLogTime = Date.now();
      }
      if (reason === 'io server disconnect' || reason === 'transport close') {
        if (connectionAttempts < MAX_RECONNECTION_ATTEMPTS) {
          let delay = Math.min(1000 * Math.pow(2, connectionAttempts), 20000);
          setTimeout(() => {
            if (socket && !socket.connected) {
              if (Date.now() - lastErrorLogTime > 5000) {
                console.log('[Socket] Attempting to reconnect after disconnect...', connectionAttempts + 1);
                lastErrorLogTime = Date.now();
              }
              connectionAttempts++;
              socket.connect();
            }
          }, delay);
        }
      }
    });

    socket.on('error', (error) => {
      if (Date.now() - lastErrorLogTime > 5000) {
        console.error('[Socket] General error:', error);
        lastErrorLogTime = Date.now();
      }
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