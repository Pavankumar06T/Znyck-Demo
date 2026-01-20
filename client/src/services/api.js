import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

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
    // Legacy/Unused in this demo flow, keeping for reference or if needed
    const response = await api.post('/orders', { amount, items });
    return response.data;
};

export const createDemoOrder = async (product, preferredProvider = null) => {
    // We send productId and the full product details as fallback (in case it's a client-side mock)
    const response = await api.post('/payments/demo-order', {
        productId: product._id,
        productDetails: product,
        preferredProvider
    });
    return response.data;
};

export const verifyPayment = async (paymentData) => {
    const response = await api.post('/payments/verify-demo-order', paymentData);
    return response.data;
};

export const seedProducts = async () => {
    return await api.post('/products/seed');
};

export const fetchApps = async (orgId) => {
    const params = { organizationId: orgId };
    const response = await api.get('/apps', { params });
    return response.data;
};

export const createApp = async (appData) => {
    const response = await api.post('/apps', appData);
    return response.data;
};

export const fetchAppById = async (id) => {
    const response = await api.get(`/apps/${id}`);
    return response.data;
};

export const fetchTransactions = async () => {
    console.log('API Service: Fetching transactions from /transactions endpoint');
    const response = await api.get('/transactions');
    return response.data;
};

export default api;
