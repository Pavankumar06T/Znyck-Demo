import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchProducts = async (category) => {
    const params = category ? { category } : {};
    const response = await api.get('/products', { params });
    return response.data;
};

export const fetchProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

export const createOrder = async (amount, items) => {
    const response = await api.post('/payments/create-order', { amount, items });
    return response.data;
};

export const verifyPayment = async (paymentData) => {
    const response = await api.post('/payments/verify-payment', paymentData);
    return response.data;
};

export const seedProducts = async () => {
    return await api.post('/products/seed');
};

export default api;
