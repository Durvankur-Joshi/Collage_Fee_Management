import axios from './axios';

// Auth APIs
export const authAPI = {
  register: (userData) => axios.post('/auth/register', userData),
  login: (credentials) => axios.post('/auth/login', credentials),
  createUserByAdmin: (userData) => axios.post('/auth/create-user', userData), // New endpoint for admin
};

// Student APIs
// Student APIs
export const studentAPI = {
  getAll: () => axios.get('/students'),
  create: (data) => axios.post('/students', data),
  createWithUser: (data) => axios.post('/students/with-user', data), // New combined endpoint
  getSummary: (id) => axios.get(`/students/${id}/summary`),
  sendFeeReminder: (id) => axios.post(`/students/${id}/send-reminder`),
};

// Fee APIs
export const feeAPI = {
  getAll: () => axios.get('/fees'),
  create: (data) => axios.post('/fees', data),
};

// Payment APIs
export const paymentAPI = {
  getAll: () => axios.get('/payments'),
  create: (data) => axios.post('/payments', data),
};