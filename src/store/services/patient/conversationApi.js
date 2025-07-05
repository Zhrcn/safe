import axiosInstance from '../axiosInstance';
import { getSocket } from '@/utils/socket';

class ConversationService {
  // HTTP API Methods
  static async getConversations() {
    const res = await axiosInstance.get('/conversations');
    return res.data.data;
  }

  static async getConversationById(id) {
    const res = await axiosInstance.get(`/conversations/${id}`);
    return res.data.data;
  }

  static async markAsRead(conversationId) {
    const res = await axiosInstance.put(`/conversations/${conversationId}/read`);
    return res.data.data;
  }

  static async addConversation(conversationData) {
    const res = await axiosInstance.post('/conversations', conversationData);
    return res.data.data;
  }

  static async updateConversation(id, conversationData) {
    const res = await axiosInstance.put(`/conversations/${id}`, conversationData);
    return res.data.data;
  }

  static async deleteConversation(id) {
    const res = await axiosInstance.delete(`/conversations/${id}`);
    return res.data.data;
  }

  static async deleteMessage(conversationId, messageId) {
    const res = await axiosInstance.delete(`/conversations/${conversationId}/messages/${messageId}`);
    return res.data.data;
  }

  // Socket Methods
  static sendMessage({ conversationId, message }) {
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
  }

  static deleteMessageSocket({ conversationId, messageId }) {
    const socket = getSocket();
    
    if (!socket) {
      return Promise.reject(new Error('Socket not available - please log in again'));
    }
    
    return new Promise((resolve, reject) => {
      socket.emit('delete_message', { conversationId, messageId }, (response) => {
        if (response && response.error) {
          reject(new Error(response.error));
        } else if (response && response.success) {
          resolve(response);
        } else {
          reject(new Error('Invalid response from server'));
        }
      });
    });
  }

  static getMessagesSocket(conversationId) {
    const socket = getSocket();
    if (!socket) {
      return Promise.reject(new Error('Socket not available - please log in again'));
    }
    console.log('[getMessagesSocket] Requesting messages for conversation:', conversationId);
    console.log('[getMessagesSocket] Socket connected:', socket.connected);
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.error('[getMessagesSocket] Request timed out after 10 seconds, falling back to HTTP API');
        this.fallbackToHttp(conversationId, resolve, reject);
      }, 10000);
      
      socket.emit('get_messages', { conversationId }, (response) => {
        clearTimeout(timeout);
        console.log('[getMessagesSocket] Response received:', response);
        if (response && response.error) {
          console.error('[getMessagesSocket] Error:', response.error);
          reject(new Error(response.error));
        } else if (response && response.success) {
          console.log('[getMessagesSocket] Success, messages:', response.messages);
          resolve(response.messages);
        } else {
          console.error('[getMessagesSocket] Invalid response format:', response);
          reject(new Error('Invalid response from server'));
        }
      });
    });
  }

  static async fallbackToHttp(conversationId, resolve, reject) {
    try {
      const response = await fetch(`/api/v1/conversations/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.data && data.data.messages) {
        console.log('[getMessagesSocket] HTTP fallback successful:', data.data.messages);
        resolve(data.data.messages);
      } else {
        reject(new Error(data.error || 'Failed to load messages'));
      }
    } catch (err) {
      console.error('[getMessagesSocket] HTTP fallback failed:', err);
      reject(new Error('Failed to load messages via HTTP fallback'));
    }
  }

  // Socket Event Listeners
  static onReceiveMessage(handler) {
    const socket = getSocket();
    socket.on('receive_message', handler);
    return () => socket.off('receive_message', handler);
  }

  static onMessageDeleted(handler) {
    const socket = getSocket();
    socket.on('message_deleted', handler);
    return () => socket.off('message_deleted', handler);
  }

  static onTyping(handler) {
    const socket = getSocket();
    socket.on('typing', handler);
    return () => socket.off('typing', handler);
  }

  // Room Management
  static joinConversation(conversationId) {
    const socket = getSocket();
    socket.emit('join_conversation', { conversationId });
  }

  static leaveConversation(conversationId) {
    const socket = getSocket();
    socket.emit('leave_conversation', { conversationId });
  }

  static sendTyping({ conversationId, userId }) {
    const socket = getSocket();
    socket.emit('typing', { conversationId, userId });
  }
}

// Export methods for backward compatibility
export const {
  getConversations,
  getConversationById,
  markAsRead,
  addConversation,
  updateConversation,
  deleteConversation,
  deleteMessage,
  sendMessage,
  deleteMessageSocket,
  getMessagesSocket,
  onReceiveMessage,
  onMessageDeleted,
  onTyping,
  joinConversation,
  leaveConversation,
  sendTyping
} = ConversationService;
