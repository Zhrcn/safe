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
      autoConnect: false,
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });
    
    // Connect the socket
    socket.connect();
    
    // Add connection event listeners
    socket.on('connect', () => {
      console.log('Socket connected successfully:', socket.id);
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      if (error.message.includes('Authentication error')) {
        console.error('Authentication failed - please log in again');
      }
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  } else if (!socket.connected) {
    // Reconnect if disconnected
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