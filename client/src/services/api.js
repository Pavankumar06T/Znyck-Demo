import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request Interceptor
 * - Attaches Authorization header ONLY for protected routes
 * - Injects Znyck context headers (App + Env)
 */
api.interceptors.request.use(
    (config) => {
        const isAuthRoute =
            config.url.includes('/auth/login') ||
            config.url.includes('/auth/signup');

        // Attach JWT only if NOT auth route
        if (!isAuthRoute) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        // Inject Znyck Context Headers
        const appId = localStorage.getItem('znyck_active_app_id');
        const env = localStorage.getItem('znyck_env') || 'test';

        if (appId) {
            config.headers['X-Znyck-App-Id'] = appId;
        }

        config.headers['X-Znyck-Env'] = env;

        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response Interceptor (Optional but recommended)
 * - Auto logout on 401 (except login/signup)
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || '';

        const isAuthRoute =
            url.includes('/auth/login') ||
            url.includes('/auth/signup');

        if (status === 401 && !isAuthRoute) {
            console.warn('Unauthorized – clearing session');
            localStorage.clear();
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

/* ===========================
   API HELPERS
=========================== */

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
    const response = await api.post('/orders', { amount, items });
    return response.data;
};

export const createDemoOrder = async (product, preferredProvider = null) => {
    const response = await api.post('/payments/demo-order', {
        productId: product._id,
        productDetails: product,
        preferredProvider,
    });
    return response.data;
};

export const verifyPayment = async (paymentData) => {
    const response = await api.post('/payments/verify-demo-order', paymentData);
    return response.data;
};

export const seedProducts = async () => {
    const response = await api.post('/products/seed');
    return response.data;
};

export const fetchOrgs = async () => {
    const response = await api.get('/orgs');
    return response.data;
};

export const fetchApps = async (orgId) => {
    const response = await api.get('/apps', {
        params: { organizationId: orgId },
    });
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
    const response = await api.get('/transactions');
    return response.data;
};

export default api;
