import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Loader2, CreditCard } from 'lucide-react';
import api from '../../services/api';
import { useCheckout } from '../../hooks/useCheckout';
import StripePaymentModal from '../../components/modals/StripePaymentModal';
import PaymentMethodModal from '../../components/modals/PaymentMethodModal';

const CategoryStore = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null); // For Payment Method Selection
    const { handleCheckout, loading: checkoutLoading, stripeConfig, setStripeConfig } = useCheckout();

    // Map URL param to friendly name
    const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Store';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await api.get('/products');
                // Filter by category (case insensitive matching)
                // Deduplicate items by name to handle potential DB duplicates
                const uniqueProducts = [];
                const seen = new Set();

                // Sort by price ascending to keep the "cheaper" one if duplicates exist, or just first one
                res.data.sort((a, b) => a.price - b.price);

                const categoryProducts = res.data.filter(p => p.category.toLowerCase() === category?.toLowerCase());

                for (const p of categoryProducts) {
                    if (!seen.has(p.name)) {
                        seen.add(p.name);
                        uniqueProducts.push(p);
                    }
                }

                // Filter out products with price < 50 INR (5000 paise) as they break Stripe (min $0.50)
                const validPriceProducts = uniqueProducts.filter(p => p.price >= 5000);

                setProducts(validPriceProducts);
            } catch (err) {
                console.error("Failed to fetch products", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchProducts();
        }
    }, [category, categoryName]);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{categoryName} Store</h1>
                    <p className="text-slate-600 dark:text-gray-400">Browse and purchase {categoryName.toLowerCase()} items (Test Mode)</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product._id} className="bg-white dark:bg-[#1c1f2e] border border-slate-200 dark:border-white/5 rounded-xl p-6 hover:border-blue-500/30 transition-all flex flex-col group shadow-sm dark:shadow-none duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                    <ShoppingCart size={24} />
                                </div>
                                <span className="text-sm font-mono text-slate-700 dark:text-white bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/5">
                                    {product.currency} {(product.price / 100).toFixed(2)}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{product.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-gray-500 mb-6 flex-1">{product.description}</p>

                            <button
                                onClick={() => setSelectedProduct(product)}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <CreditCard size={18} />
                                Buy Now
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Payment Method Selection Modal */}
            <PaymentMethodModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
                onSelect={(provider) => {
                    // 1. Close Selection Modal
                    const productToBuy = selectedProduct;
                    setSelectedProduct(null);

                    // 2. Trigger Checkout with Preference
                    handleCheckout(productToBuy, {}, provider);
                }}
            />

            {/* Checkout Loading Overlay (Global) */}
            {checkoutLoading && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
                    <div className="bg-white dark:bg-[#1c1f2e] p-6 rounded-xl flex items-center gap-4 shadow-2xl">
                        <Loader2 className="animate-spin text-blue-500" size={24} />
                        <span className="text-slate-900 dark:text-white font-medium">Initializing Secure Payment...</span>
                    </div>
                </div>
            )}

            {stripeConfig && (
                <StripePaymentModal
                    isOpen={!!stripeConfig}
                    config={stripeConfig}
                    onClose={() => setStripeConfig(null)}
                    onSuccess={async (paymentIntent) => {
                        try {
                            await api.post('/payments/verify-demo-order', {
                                paymentIntentId: paymentIntent.id,
                                productId: stripeConfig.productId,
                                user: { email: 'guest@znyck.demo', name: 'Guest User' }
                            });
                            navigate('/success');
                        } catch (e) {
                            console.error("Verification failed", e);
                            alert("Payment succeeded but verification failed.");
                        }
                    }}
                />
            )}
        </div>
    );
};

export default CategoryStore;
