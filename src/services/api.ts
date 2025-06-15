
import axios from 'axios';

const BASE_URL = 'https://docmatex-api.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  console.log('Making API request to:', config.url);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration and network errors
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status);
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('docmatex_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Test backend connectivity
export const testConnection = async () => {
  try {
    console.log('Testing backend connection...');
    const response = await fetch(BASE_URL + '/api/health', { 
      method: 'GET',
      mode: 'cors'
    });
    console.log('Health check response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Backend connectivity test failed:', error);
    return false;
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      console.log('Attempting login to:', BASE_URL + '/api/auth/login');
      console.log('Request payload:', { email: email });
      
      // Test connection first
      const isConnected = await testConnection();
      if (!isConnected) {
        console.warn('Backend appears to be unreachable');
      }

      const response = await api.post('/api/auth/login', { email, password });
      console.log('Login successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login API Error:', error);
      
      // Provide more specific error messages
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to the server. Please check your internet connection or try again later.');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password. Please check your credentials.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
      }
    }
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    try {
      console.log('Fetching user profile...');
      const response = await api.get('/api/users/profile');
      console.log('Profile fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Profile API Error:', error);
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      } else if (error.response?.status === 401) {
        throw new Error('Your session has expired. Please login again.');
      } else {
        throw new Error(error.response?.data?.message || 'Failed to fetch profile. Please try again.');
      }
    }
  },
};

export default api;
