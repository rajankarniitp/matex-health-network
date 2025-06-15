
import axios from 'axios';

const BASE_URL = 'https://docmatex-api.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 second timeout
  withCredentials: false, // Disable credentials for CORS
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  console.log('Making API request to:', config.baseURL + config.url);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration and network errors
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status, response.data);
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

// Test backend connectivity with better error handling
export const testConnection = async () => {
  try {
    console.log('Testing backend connection...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(BASE_URL + '/api/health', { 
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    console.log('Health check response:', response.status);
    return response.ok;
  } catch (error: any) {
    console.error('Backend connectivity test failed:', error);
    // Even if health check fails, try the actual login endpoint
    return true; // Allow login attempt even if health check fails
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      console.log('Attempting login to:', BASE_URL + '/api/auth/login');
      console.log('Request payload:', { email });
      
      const response = await api.post('/api/auth/login', { 
        email, 
        password 
      });
      
      console.log('Login successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login API Error:', error);
      
      // Provide more specific error messages
      if (error.code === 'ERR_NETWORK' || error.name === 'AbortError') {
        throw new Error('Unable to connect to the server. Please check your internet connection or try again later.');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password. Please check your credentials.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Login failed. Please try again.');
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
