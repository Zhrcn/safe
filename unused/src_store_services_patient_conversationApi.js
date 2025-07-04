import axiosInstance from '../axiosInstance';
import { getSocket } from '@/utils/socket';

// REST for CRUD
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

// --- Socket.IO for sending messages ---
export const sendMessage = ({ conversationId, message }) => {
  const socket = getSocket();
  return new Promise((resolve, reject) => {
    socket.emit('send_message', { conversationId, message }, (response) => {
      if (response && response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
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