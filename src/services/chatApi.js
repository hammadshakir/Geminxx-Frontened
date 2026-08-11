// services/chatApi.js
import api from './api';

// Send message
export const sendMessage = async (data) => {
  try {
    const response = await api.post('/chat/messages', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
};

// Get conversations
export const getConversations = async () => {
  try {
    const response = await api.get('/chat/conversations');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch conversations');
  }
};

// Get messages
export const getMessages = async (conversationId) => {
  try {
    const response = await api.get(`/chat/conversations/${conversationId}/messages`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch messages');
  }
};