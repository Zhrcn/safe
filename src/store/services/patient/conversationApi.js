import { api } from '../api';

export const conversationApi = {
    getConversations: () => api.get('/conversations'),
    getConversationById: (id) => api.get(`/conversations/${id}`),
    sendMessage: (conversationId, message) => api.post(`/conversations/${conversationId}/messages`, { message }),
    markAsRead: (conversationId) => api.put(`/conversations/${conversationId}/read`),
}; 