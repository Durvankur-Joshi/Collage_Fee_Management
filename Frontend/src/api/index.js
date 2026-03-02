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
  getAll: async () => {
    try {
      const response = await axios.get('/api/students');
      return response;
    } catch (error) {
      console.error('Get all students error:', error);
      throw error;
    }
  },
  getCurrentStudent: async () => {
    try {
      const response = await axios.get('/api/students/me');
      return response;
    } catch (error) {
      console.error('Get current student error:', error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      console.log('📤 Creating student with data:', data);
      const response = await axios.post('/api/students', data);
      console.log('📥 Create response:', response.data);
      return response;
    } catch (error) {
      console.error('Create student error:', error);
      throw error;
    }
  },
  getSummary: async (id) => {
    try {
      const response = await axios.get(`/api/students/${id}/summary`);
      return response;
    } catch (error) {
      console.error('Get summary error:', error);
      throw error;
    }
  },
  sendFeeReminder: async (id) => {
    try {
      const response = await axios.post(`/api/students/${id}/send-reminder`);
      return response;
    } catch (error) {
      console.error('Send reminder error:', error);
      throw error;
    }
  },
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