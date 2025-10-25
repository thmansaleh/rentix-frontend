import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8080/api",
  baseURL: "https://law-backend-woad.vercel.app/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    // Try to get token from cookie first
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };
    
    let token = getCookie('authToken');
    
    // Fallback to localStorage if cookie doesn't exist
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('authToken');
    }
    
    // Add token to Authorization header if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 unauthorized error, redirect to login
    if (error.response && error.response.status === 401) {
      // Clear auth data
      document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
