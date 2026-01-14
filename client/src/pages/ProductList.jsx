import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Star, ShoppingCart, ArrowRight, Zap, Grid, List } from 'lucide-react';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../hooks/useCheckout';

const ProductList = () => {
    const { category } = useParams();
    const { addToCart, cart } = useCart();
    const { handleCheckout } = useCheckout();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const data = await fetchProducts(category);
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, [category]);

    const [viewMode, setViewMode] = useState('grid');
    const navigate = useNavigate();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    };

    const categoryTitle = category
        ? category.charAt(0).toUpperCase() + category.slice(1).replace('ebook', 'E-Books').replace('accessories', 'Tech Accessories')
        : 'All Products';

    const getGradient = () => {
        switch (category) {
            case 'ebook': return 'from-blue-400 to-cyan-300';
            case 'freelance': return 'from-purple-400 to-pink-300';
            case 'accessories': return 'from-emerald-400 to-teal-300';
            default: return 'from-gray-100 to-gray-300';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500 selection:text-white pb-20">

            {/* Navbar Placeholder */}
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto mb-10 border-b border-gray-900">
                <Link to="/" className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    ZNYCK
                </Link>
                <div className="flex gap-4">
                    <Link to="/cart" className="relative w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center border border-gray-800 hover:bg-gray-800 transition-colors">
                        <ShoppingCart size={18} className="text-gray-400" />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {cart.length}
                            </span>
                        )}
                    </Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12">

                {/* Sidebar */}
                <aside className="w-full md:w-72 flex-shrink-0">
                    <div className="sticky top-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium text-sm group"
                        >
                            <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
                            Back
                        </button>

                        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl shadow-2xl">
                            <div className="flex items-center gap-3 mb-8 text-white border-b border-gray-800 pb-6">
                                <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/30">
                                    <Filter size={18} className="text-white" />
                                </div>
                                <h2 className="font-bold text-xl tracking-tight">Filters</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-gray-500 uppercase text-xs tracking-widest mb-4">Categories</h3>
                                    <ul className="space-y-3">
                                        {[
                                            { id: 'ebook', label: 'E-Books' },
                                            { id: 'freelance', label: 'Freelance Services' },
                                            { id: 'accessories', label: 'Tech Accessories' }
                                        ].map((cat) => (
                                            <li key={cat.id}>
                                                <Link
                                                    to={`/category/${cat.id}`}
                                                    className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${category === cat.id ? 'bg-white text-black font-bold shadow-lg shadow-white/10' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                                                >
                                                    <span>{cat.label}</span>
                                                    {category === cat.id && <ArrowRight size={14} />}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <motion.span
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-indigo-400 font-bold tracking-wider text-sm uppercase mb-2 block"
                            >
                                Browse Collection
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${getGradient()} tracking-tight`}
                            >
                                {categoryTitle}
                            </motion.h1>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className={`${viewMode === 'grid' ? 'h-96' : 'h-48'} bg-gray-900 rounded-3xl animate-pulse border border-gray-800`}></div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                        >
                            <AnimatePresence>
                                {products.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        variants={item}
                                        layout
                                        className={`group relative bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row items-center p-4 gap-6'}`}
                                    >
                                        <div className={`relative overflow-hidden flex-shrink-0 ${viewMode === 'grid' ? 'h-64 w-full' : 'h-32 w-32 rounded-2xl'}`}>
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10 opacity-60"></div>
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop';
                                                }}
                                                className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                                            />
                                            {viewMode === 'grid' && (
                                                <>
                                                    <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-bold text-white border border-white/10 shadow-xl">
                                                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                                        <span>4.5</span>
                                                    </div>
                                                    <div className="absolute top-4 left-4 z-20">
                                                        <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">New</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className={`${viewMode === 'grid' ? 'p-6' : 'flex-1'} relative z-20 flex flex-col`}>
                                            <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-indigo-400 transition-colors">{product.title}</h3>
                                            <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">{product.description}</p>

                                            <div className={`mt-auto pt-4 border-t border-gray-800 flex items-center justify-between gap-4 ${viewMode === 'list' && 'border-none pt-0 mt-2'}`}>
                                                <div>
                                                    {viewMode === 'grid' && <span className="text-xs text-gray-500 font-mono block mb-1">PRICE</span>}
                                                    <span className="text-2xl font-bold text-white tracking-tight">₹{product.price}</span>
                                                </div>
                                                <div className="flex gap-2 flex-1 justify-end">
                                                    <button
                                                        onClick={() => {
                                                            addToCart(product);
                                                            // Optional: Toast
                                                        }}
                                                        className="px-6 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-all text-sm uppercase tracking-wide border border-gray-700"
                                                    >
                                                        Add to Cart
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const items = [{ product: product._id, quantity: 1 }];
                                                            handleCheckout(items, product.price);
                                                        }}
                                                        className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-lg shadow-white/10 text-sm uppercase tracking-wide"
                                                    >
                                                        Buy Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductList;
