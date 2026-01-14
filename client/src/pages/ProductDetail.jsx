import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Added Link import here
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ShieldCheck, Zap } from 'lucide-react';
import { fetchProductById, createOrder, verifyPayment } from '../services/api';

// Dynamic script loader for robustness
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await fetchProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Failed to load product", error);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    const handleBuyNow = async () => {
        if (!product) return;

        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            alert('Failed to load Razorpay SDK. Please check your internet connection.');
            return;
        }

        try {
            // 1. Create Order on Server
            const orderData = await createOrder(product.price, [{ product: product._id, quantity: 1 }]);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Znyck Commerce",
                description: `Purchase of ${product.title}`,
                image: product.image,
                order_id: orderData.id,
                handler: async function (response) {
                    try {
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: orderData.orderId
                        };
                        const verifyRes = await verifyPayment(verifyData);
                        if (verifyRes.status === 'success') {
                            alert('Payment Successful!');
                        } else {
                            alert('Payment Verification Failed');
                        }
                    } catch (error) {
                        console.error(error);
                        alert('Payment Verification Error');
                    }
                },
                prefill: {
                    name: "Demo User",
                    email: "demo@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#4338ca"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Payment initiation failed", error);
            alert("Payment initiation failed. Check console for details.");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Product not found</div>;

    return (
        <div className="min-h-screen bg-black text-white font-sans py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Home
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800"
                    >
                        <img
                            src={product.image}
                            alt={product.title}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/600x400?text=No+Image';
                            }}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Info Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col h-full justify-center"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <span className="px-3 py-1 bg-indigo-900/50 text-indigo-300 text-xs font-bold uppercase tracking-wide rounded-full border border-indigo-500/30">
                                {product.category}
                            </span>
                            <div className="flex items-center text-yellow-500 text-sm font-bold">
                                <Star size={16} className="fill-current mr-1" />
                                4.5
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{product.title}</h1>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="flex items-center gap-3 mb-8 text-gray-500">
                            <ShieldCheck className="text-emerald-500" />
                            <span className="text-sm">Secure Payment</span>
                            <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                            <Zap className="text-blue-500" />
                            <span className="text-sm">Instant Delivery</span>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-800 pt-8 mt-auto">
                            <div>
                                <p className="text-gray-500 text-sm">Total Price</p>
                                <p className="text-3xl font-bold text-white">₹{product.price}</p>
                            </div>
                            <button
                                onClick={handleBuyNow}
                                className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                Buy Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
