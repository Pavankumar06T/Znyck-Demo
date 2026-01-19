import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Loader2, CreditCard } from 'lucide-react';
import api from '../services/api';
import { useCheckout } from '../hooks/useCheckout';

const DemoProductModal = ({ category, onClose }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { handleCheckout, loading: checkoutLoading } = useCheckout();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch products filtered by category
                // Assuming the API supports filtering or we filter clientside
                const res = await api.get('/products');
                let filtered = res.data.filter(p => p.category === category);

                // If no products found for this category, maybe show some mock ones or all
                if (filtered.length === 0) {
                    // Fallback for demo purposes if backend is empty
                    filtered = [
                        { _id: 'demo-1', name: `${category} Demo 1`, description: 'Sample Item', price: 9900, currency: 'INR' },
                        { _id: 'demo-2', name: `${category} Premium`, description: 'High quality item', price: 19900, currency: 'INR' },
                    ];
                }
                setProducts(filtered);
            } catch (err) {
                console.error("Failed to fetch products", err);
                // Fallback
                setProducts([
                    { _id: 'err-1', name: `${category} Basic`, description: 'Demo Item (Offline)', price: 4900, currency: 'INR' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchProducts();
        }
    }, [category]);

    const onBuyClick = async (product) => {
        // Trigger Razorpay Checkout
        await handleCheckout(product);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1c1f2e] border border-white/10 rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">{category} Store</h2>
                        <p className="text-sm text-gray-400">Select an item to purchase (Test Mode)</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {products.map(product => (
                                <div key={product._id} className="bg-black/20 border border-white/5 rounded-xl p-4 hover:border-blue-500/30 transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400">
                                            <ShoppingCart size={20} />
                                        </div>
                                        <span className="text-xs font-mono text-gray-400 border border-white/10 px-2 py-1 rounded">
                                            {product.currency} {(product.price / 100).toFixed(2)}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-white mb-1">{product.name}</h3>
                                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">{product.description || 'No description available.'}</p>

                                    <button
                                        onClick={() => onBuyClick(product)}
                                        disabled={checkoutLoading}
                                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                                    >
                                        {checkoutLoading ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
                                        Buy Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DemoProductModal;
