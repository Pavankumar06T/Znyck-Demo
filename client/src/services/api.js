import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Proxy in vite config handles localhost:5000
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Ensure Bearer prefix
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
