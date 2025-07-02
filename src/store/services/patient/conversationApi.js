import axiosInstance from '../axiosInstance';

export const getConversations = async () => {
  const res = await axiosInstance.get('/conversations');
  return res.data.data;
};

export const getConversationById = async (id) => {
  const res = await axiosInstance.get(`/conversations/${id}`);
  return res.data.data;
};

export const sendMessage = async (conversationId, message) => {
  const res = await axiosInstance.post(`/conversations/${conversationId}/messages`, { message });
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