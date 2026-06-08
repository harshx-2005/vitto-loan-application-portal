import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject the authorization token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vitto_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to parse unified response formats
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Standardize error shape returned by the backend or fallback
    const errResponse = error.response?.data || {
      success: false,
      message: error.message || 'Something went wrong. Please try again.',
      errors: [],
    };
    return Promise.reject(errResponse);
  }
);

export const applicationApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  
  submit: (payload) => api.post('/applications', payload),
  
  getAll: (status) => {
    const params = {};
    if (status && status !== 'all') {
      params.status = status;
    }
    return api.get('/applications', { params });
  },
  
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
  
  getSummary: () => api.get('/summary'),
};

export default api;
