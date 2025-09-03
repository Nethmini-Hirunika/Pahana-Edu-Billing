// src/api/axios.js
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - try basic auth with stored credentials
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const credentials = JSON.parse(localStorage.getItem('userCredentials') || 'null');
    
    // Try basic authentication if credentials are available
    if (credentials && credentials.username && credentials.password) {
      const basicAuth = btoa(`${credentials.username}:${credentials.password}`);
      config.headers.Authorization = `Basic ${basicAuth}`;
      console.log('Using Basic Auth for:', credentials.username);
    }
    
    console.log('Request headers:', config.headers);
    console.log('Cookies:', document.cookie);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to get cookie value
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log('API Error:', err.response?.status, err.response?.data);
    
    if (err?.response?.status === 401) {
      window.dispatchEvent(new Event("app:unauthorized"));
    }
    
    // Better error handling for 403
    if (err?.response?.status === 403) {
      console.error('Access denied - authentication required');
    }
    
    return Promise.reject(err);
  }
);

