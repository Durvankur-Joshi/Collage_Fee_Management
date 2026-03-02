import axios from './axios';

// Auth APIs
export const authAPI = {
  register: (userData) => axios.post('/api/auth/register', userData),
  login: (credentials) => axios.post('/api/auth/login', credentials),
  createUserByAdmin: (userData) => axios.post('/api/auth/create-user', userData),
};

// Student APIs
export const studentAPI = {
  getAll: () => axios.get('/api/students'),
  getCurrentStudent: () => axios.get('/api/students/me'),
  create: (data) => axios.post('/api/students', data),
  getSummary: (id) => axios.get(`/api/students/${id}/summary`),
  sendFeeReminder: (id) => axios.post(`/api/students/${id}/send-reminder`),
};

// Fee APIs
export const feeAPI = {
  getAll: () => axios.get('/api/fees'),
  create: (data) => axios.post('/api/fees', data),
};

// Payment APIs
export const paymentAPI = {
  getAll: () => axios.get('/api/payments'),
  create: (data) => axios.post('/api/payments', data),
};