import axios from './axios';

// Auth APIs
export const authAPI = {
  register: (userData) => axios.post('/auth/register', userData),
  login: (credentials) => axios.post('/auth/login', credentials),
};

// Student APIs
export const studentAPI = {
  getAll: () => axios.get('/students'),
  create: (data) => axios.post('/students', data),
  getSummary: (id) => axios.get(`/students/${id}/summary`),
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