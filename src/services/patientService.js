import axios from 'axios';
import { getAuthToken } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// Patient Profile
const fetchPatientData = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/patient`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 8000
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch patient data');
  }
};

const updatePatientProfile = async (updateData) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(`${API_BASE_URL}/patient`, updateData, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 8000
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Consultations
const getConsultations = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/patient/consultations`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 8000
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get consultations');
  }
};

const requestConsultation = async (consultationData) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API_BASE_URL}/patient/consultations`, consultationData, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 8000
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to request consultation');
  }
};

// Messaging
const getConversations = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/patient/messaging/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 8000
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get conversations');
  }
};

const getConversation = async (conversationId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/patient/messaging/conversations/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 8000
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get conversation');
  }
};

const sendMessage = async ({ conversationId, message }) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API_BASE_URL}/patient/messaging/conversations/${conversationId}`, { message }, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 8000
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
};

export {
  fetchPatientData,
  updatePatientProfile,
  getConsultations,
  requestConsultation,
  getConversations,
  getConversation,
  sendMessage
};
