import axios from './axios';

// Auth APIs
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return response;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  },
  login: async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      return response;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },
  createUserByAdmin: async (userData) => {
    try {
      const response = await axios.post('/api/auth/create-user', userData);
      return response;
    } catch (error) {
      console.error('Create user API error:', error);
      throw error;
    }
  },
};

// Student APIs
export const studentAPI = {
  getAll: () => axios.get('/api/students'),
  getCurrentStudent: () => axios.get('/api/students/me'),
  create: (data) => axios.post('/api/students', data),
  getSummary: (id) => axios.get(`/api/students/${id}/summary`),
  sendFeeReminder: (id) => axios.post(`/api/students/${id}/send-reminder`),
};

export const feeAPI = {
  getAll: async () => {
    try {
      const response = await axios.get('/api/fees');
      return response;
    } catch (error) {
      console.error('Get fees error:', error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await axios.post('/api/fees', data);
      return response;
    } catch (error) {
      console.error('Create fee error:', error);
      throw error;
    }
  },
};

// Payment APIs
export const paymentAPI = {
  getAll: async () => {
    try {
      const response = await axios.get('/api/payments');
      return response;
    } catch (error) {
      console.error('Get payments error:', error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await axios.post('/api/payments', data);
      return response;
    } catch (error) {
      console.error('Create payment error:', error);
      throw error;
    }
  },
};