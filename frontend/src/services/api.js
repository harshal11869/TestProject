import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer API
export const customerAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Financial Details API
export const financialAPI = {
  getByCustomerId: (customerId) => api.get(`/financial-details/customer/${customerId}`),
  getById: (id) => api.get(`/financial-details/${id}`),
  create: (data) => api.post('/financial-details', data),
  update: (id, data) => api.put(`/financial-details/${id}`, data),
  delete: (id) => api.delete(`/financial-details/${id}`),
};

// Transaction API
export const transactionAPI = {
  getByCustomerId: (customerId) => api.get(`/transactions/customer/${customerId}`),
  create: (data) => api.post('/transactions', data),
};

export default api;
