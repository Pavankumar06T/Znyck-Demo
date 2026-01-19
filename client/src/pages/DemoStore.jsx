import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Filter, Loader2 } from 'lucide-react';
import api from '../services/api';

const DemoStore = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    // Fetch products
    useEffect(() => {
        fetchProducts();
    }, [filter]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Using query param for server-side filtering
            const endpoint = filter === 'All' ? '/products' : `/products?category=${filter}`;
            const res = await api.get(endpoint);
            setProducts(res.data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async (product) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            // Redirect to login if not authenticated
            navigate('/login');
            return;
        }

        const user = JSON.parse(userStr);

        // Load Razorpay Script
        const loadRazorpay = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };

        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
            alert('Razorpay SDK failed to load');
            return;
        }

        try {
            // 1. Create Order on Backend (Demo Order Endpoint)
            const response = await api.post('/payments/demo-order', {
                productId: product._id
            });

            if (!response.data.success) {
                alert('Order creation failed');
                return;
            }

            const { orderId, amount, currency, keyId } = response.data;

            // 2. Open Razorpay Checkout
            const options = {
                key: keyId,
                amount: amount,
                currency: currency,
                name: "Znyck Demo Store",
                description: `Purchase ${product.name}`,
                order_id: orderId,
                handler: async function (response) {
                    // Verify Payment on Backend
                    try {
                        const verifyRes = await api.post('/payments/verify-demo-order', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            productId: product._id,
                            user: user // Pass logged in user info
                        });

                        if (verifyRes.data.success) {
                            alert('Payment Successful & Verified! Transaction ID: ' + verifyRes.data.transactionId);
                        } else {
                            alert('Payment successful but verification failed.');
                        }
                    } catch (err) {
                        console.error(err);
                        alert('Verification Failed: ' + err.message);
                    }
                },
                prefill: {
                    name: user.name || "Demo User",
                    email: user.email || "user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#3B82F6"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert(response.error.description);
            });
            rzp1.open();

        } catch (err) {
            console.error(err);
            alert('Payment initialization failed: ' + (err.response?.data?.error || err.message));
        }
    };


    return (
        <div className="min-h-screen bg-black text-white p-8">
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        ZNYCK DEMO STORE
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex bg-gray-900 rounded-full p-1 border border-gray-800">
                        {['All', 'E-Book', 'Freelance', 'Products'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === cat
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4 pl-6 border-l border-gray-800">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-bold text-white">{user.name || 'Customer'}</div>
                                <div className="text-xs text-green-400 uppercase tracking-wider font-bold">Logged In</div>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors"
                        >
                            Log In
                        </button>
                    )}
                </div>
            </header>

            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-blue-500" size={48} /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {products.map(product => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:shadow-2xl hover:border-blue-500/30 transition-all flex flex-col"
                            >
                                <div className="h-48 bg-gray-800 rounded-xl mb-6 flex items-center justify-center text-gray-600">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-xl" />
                                    ) : (
                                        <ShoppingBag size={48} />
                                    )}
                                </div>
                                <div className="mb-4">
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{product.category}</span>
                                    <h3 className="text-xl font-bold mt-1">{product.name}</h3>
                                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{product.description || "No description available."}</p>
                                </div>
                                <div className="mt-auto flex justify-between items-center">
                                    <span className="text-2xl font-bold">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency }).format(product.price / 100)}
                                    </span>
                                    <button
                                        onClick={() => handleBuy(product)}
                                        className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DemoStore;
