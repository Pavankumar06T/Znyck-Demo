import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Loader2, CreditCard } from 'lucide-react';
import api from '../../services/api';
import { useCheckout } from '../../hooks/useCheckout';
import StripePaymentModal from '../../components/StripePaymentModal';
import PaymentMethodModal from '../../components/PaymentMethodModal';

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
                const apiProducts = res.data.filter(p => p.category.toLowerCase() === category?.toLowerCase());

                // Demo Data to ensure we have at least 5 items
                const demoProducts = [
                    { _id: 'demo-1', name: 'Starter Kit', description: 'Essential tools for beginners', price: 2900, currency: 'INR', category: 'Product' },
                    { _id: 'demo-2', name: 'Pro Subscription', description: 'Advanced features for power users', price: 9900, currency: 'INR', category: 'E-Book' },
                    { _id: 'demo-3', name: 'Consultation', description: 'One-on-one expert advice', price: 15000, currency: 'INR', category: 'Freelance' },
                    { _id: 'demo-4', name: 'Premium Bundle', description: 'All-in-one package', price: 19900, currency: 'INR', category: 'Product' },
                    { _id: 'demo-5', name: 'Community Access', description: 'Join our exclusive community', price: 4900, currency: 'INR', category: 'E-Book' },
                    { _id: 'demo-6', name: 'Masterclass', description: 'Deep dive video course', price: 12500, currency: 'INR', category: 'E-Book' },
                    { _id: 'demo-7', name: 'UI Kit', description: 'Modern interface assets', price: 7500, currency: 'INR', category: 'Product' },
                ];

                // Filter demo products to match the requested category roughly or just show generic ones if needed
                // For this demo, let's just make sure we have enough.
                // We will create specific mock items if the API list is short.

                let combined = [...apiProducts];
                if (combined.length < 5) {
                    const needed = 5 - combined.length;
                    // Generate specific mocks for this category to fill the gap
                    for (let i = 0; i < needed; i++) {
                        combined.push({
                            _id: `mock-${category}-${i}`,
                            name: `${categoryName} Demo Item ${i + 1}`,
                            description: `This is a sample ${categoryName} item for demonstration.`,
                            price: (i + 1) * 1500,
                            currency: 'INR',
                            category: categoryName
                        });
                    }
                }

                setProducts(combined);
            } catch (err) {
                console.error("Failed to fetch products", err);
                setProducts([
                    { _id: 'err-1', name: 'Demo Item 1', description: 'Fallback Item', price: 1000, currency: 'INR' },
                    { _id: 'err-2', name: 'Demo Item 2', description: 'Fallback Item', price: 2000, currency: 'INR' },
                    { _id: 'err-3', name: 'Demo Item 3', description: 'Fallback Item', price: 3000, currency: 'INR' },
                    { _id: 'err-4', name: 'Demo Item 4', description: 'Fallback Item', price: 4000, currency: 'INR' },
                    { _id: 'err-5', name: 'Demo Item 5', description: 'Fallback Item', price: 5000, currency: 'INR' },
                ]);
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
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white">{categoryName} Store</h1>
                    <p className="text-gray-400">Browse and purchase {categoryName.toLowerCase()} items (Test Mode)</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product._id} className="bg-[#1c1f2e] border border-white/5 rounded-xl p-6 hover:border-blue-500/30 transition-all flex flex-col group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                    <ShoppingCart size={24} />
                                </div>
                                <span className="text-sm font-mono text-white bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    {product.currency} {(product.price / 100).toFixed(2)}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-6 flex-1">{product.description}</p>

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
                    <div className="bg-[#1c1f2e] p-6 rounded-xl flex items-center gap-4">
                        <Loader2 className="animate-spin text-blue-500" size={24} />
                        <span className="text-white font-medium">Initializing Secure Payment...</span>
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
                            navigate('/dashboard/transactions');
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
