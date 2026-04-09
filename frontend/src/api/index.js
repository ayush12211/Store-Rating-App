import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  updatePassword: (data) => api.put('/auth/password', data),
  me: () => api.get('/auth/me'),
};

export const storeAPI = {
  getAll: (params) => api.get('/stores', { params }),
  rate: (storeId, data) => api.post(`/stores/${storeId}/ratings`, data),
  updateRating: (storeId, data) => api.put(`/stores/${storeId}/ratings`, data),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  createUser: (data) => api.post('/admin/users', data),
  getStores: (params) => api.get('/admin/stores', { params }),
  createStore: (data) => api.post('/admin/stores', data),
};

export const ownerAPI = {
  getDashboard: () => api.get('/owner/dashboard'),
};

export default api;
