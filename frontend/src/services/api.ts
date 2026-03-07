import axios from 'axios';

// Use Vite environment variable when deployed (set VITE_API_URL in Vercel),
// otherwise fall back to local development server.
const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  register: (userData: { name: string; email: string; password: string; phone?: string; address?: any; birthDate?: string }) => 
    api.post('/auth/register', userData),
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData: any) => api.put('/auth/profile', userData),
};

// Products APIs
export const productsAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (productData: any) => api.post('/products', productData),
  update: (id: string, productData: any) => api.put(`/products/${id}`, productData),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Orders APIs
export const ordersAPI = {
  create: (orderData: any) => api.post('/orders', orderData),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, statusData: any) =>
    api.put(`/orders/${id}/status`, statusData),
  cancel: (id: string) => api.put(`/orders/${id}/cancel`),
  getCancelled: () => api.get('/orders/cancelled'),
};

// Payment APIs
export const paymentsAPI = {
  createOrder: (amount: number, currency: string = 'INR') => 
    api.post('/payments/create-order', { amount, currency }),
  verifyPayment: (paymentData: any) => 
    api.post('/payments/verify-payment', paymentData),
};

// Admin APIs
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  updateUser: (id: string, userData: any) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getStats: () => api.get('/admin/stats'),
};

export default api;
