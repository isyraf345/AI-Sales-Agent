import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Chat API
export const sendMessage = async (message) => {
  const response = await api.post('/chat/send', { message });
  return response.data;
};

// Booking API
export const createBooking = async (bookingData) => {
  const response = await api.post('/booking/create', bookingData);
  return response.data;
};

// ETL API
export const processETL = async (records) => {
  const response = await api.post('/etl/process', { records });
  return response.data;
};

// Lead Scoring API
export const scoreLead = async (leadData) => {
  const response = await api.post('/leads/score', leadData);
  return response.data;
};

// Feedback API
export const analyzeFeedback = async (feedbackData) => {
  const response = await api.post('/feedback/analyze', feedbackData);
  return response.data;
};

// Health Check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;