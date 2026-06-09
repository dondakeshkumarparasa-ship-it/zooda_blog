import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.zooda.in/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // ← must match storage key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Optionally refresh token, else clear and redirect
      localStorage.clear();
      window.location.href = '/';  // adjust to your login route
    }
    return Promise.reject(error);
  }
);

export default api;