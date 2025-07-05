import axiosInstance from '../axiosInstance';
import { getSocket } from '@/utils/socket';

export const getConversations = async () => {
  const res = await axiosInstance.get('/conversations');
  return res.data.data;
};

export const getConversationById = async (id) => {
  const res = await axiosInstance.get(`/conversations/${id}`);
  return res.data.data;
};

export const markAsRead = async (conversationId) => {
  const res = await axiosInstance.put(`/conversations/${conversationId}/read`);
  return res.data.data;
};

export const addConversation = async (conversationData) => {
  const res = await axiosInstance.post('/conversations', conversationData);
  return res.data.data;
};

export const updateConversation = async (id, conversationData) => {
  const res = await axiosInstance.put(`/conversations/${id}`, conversationData);
  return res.data.data;
};

export const deleteConversation = async (id) => {
  const res = await axiosInstance.delete(`/conversations/${id}`);
  return res.data.data;
};

export const sendMessage = ({ conversationId, message }) => {
  const socket = getSocket();
  
  if (!socket) {
    return Promise.reject(new Error('Socket not available - please log in again'));
  }
  
  console.log('Sending message via socket:', { conversationId, message });
  console.log('Socket connected:', socket.connected);
  
  return new Promise((resolve, reject) => {
    if (!socket.connected) {
      console.error('Socket not connected');
      reject(new Error('Socket not connected'));
      return;
    }
    
    socket.emit('send_message', { conversationId, message }, (response) => {
      console.log('Socket response:', response);
      
      if (response && response.error) {
        console.error('Socket error:', response.error);
        reject(new Error(response.error));
      } else if (response && response.success && response.data) {
        console.log('Message sent successfully:', response.data);
        resolve(response.data);
      } else {
        console.error('Invalid response format:', response);
        reject(new Error('Invalid response from server'));
      }
    });
  });
};

export const onReceiveMessage = (handler) => {
  const socket = getSocket();
  socket.on('receive_message', handler);
  return () => socket.off('receive_message', handler);
};

export const joinConversation = (conversationId) => {
  const socket = getSocket();
  socket.emit('join_conversation', { conversationId });
};

export const leaveConversation = (conversationId) => {
  const socket = getSocket();
  socket.emit('leave_conversation', { conversationId });
};

export const sendTyping = ({ conversationId, userId }) => {
  const socket = getSocket();
  socket.emit('typing', { conversationId, userId });
};
