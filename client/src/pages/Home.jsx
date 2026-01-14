import React, { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Briefcase, Monitor, ArrowRight, Zap, Globe, Shield, ShoppingBag } from 'lucide-react';
import { seedProducts } from '../services/api';

const Home = () => {

    useEffect(() => {
        seedProducts().catch(err => console.log("Seeding skipped or failed", err));
    }, []);

    const categories = [
        {
            id: 'ebook',
            title: 'Knowledge Vault',
            description: 'Premium E-Books and guides to elevate your skills.',
            icon: <BookOpen size={32} className="text-white" />,
            color: 'from-blue-500 to-blue-700',
            link: '/category/ebook'
        },
        {
            id: 'freelance',
            title: 'Expert Talent',
            description: 'Connect with top-tier freelancers for your projects.',
            icon: <Briefcase size={32} className="text-white" />,
            color: 'from-purple-500 to-purple-700',
            link: '/category/freelance'
        },
        {
            id: 'accessories',
            title: 'Tech Arsenal',
            description: 'High-performance gear for your workspace.',
            icon: <Monitor size={32} className="text-white" />,
            color: 'from-emerald-500 to-emerald-700',
            link: '/category/accessories'
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500 selection:text-white">

            {/* Navbar Placeholder */}
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto absolute top-0 left-0 right-0 z-20">
                <div className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    ZNYCK
                </div>
                <div className="hidden md:flex gap-8 text-gray-300 font-medium text-sm">
                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                    <Link to="/category/ebook" className="hover:text-white transition-colors">E-Books</Link>
                    <Link to="/category/freelance" className="hover:text-white transition-colors">Freelance</Link>
                    <Link to="/category/accessories" className="hover:text-white transition-colors">Gear</Link>
                </div>
                <Link to="/login" className="px-6 py-2 rounded-full border border-gray-700 hover:bg-gray-800 transition-all text-sm font-semibold">
                    Sign In
                </Link>
                <Link to="/cart" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700 hover:bg-gray-800 transition-colors">
                    <ShoppingBag size={18} className="text-gray-400" />
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <div className="z-10 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-bold tracking-wider mb-6 border border-indigo-500/20">
                                RELAUNCHED V2.0
                            </span>
                            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                                Simply <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Futuresque</span>.
                            </h1>
                            <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
                                The next-generation marketplace. Digital assets, expert services, and premium hardware—all in one unified ecosystem.
                            </p>

                            <div className="flex gap-4">
                                <Link to="/category/accessories" className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2">
                                    Start Exploring <ArrowRight size={18} />
                                </Link>
                                <button
                                    onClick={() => document.getElementById('categories').scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-4 bg-gray-900 border border-gray-800 text-white font-bold rounded-xl hover:border-gray-600 transition-all"
                                >
                                    View Demo
                                </button>
                            </div>
                        </motion.div>

                        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-gray-800 pt-8">
                            <div>
                                <h4 className="text-3xl font-bold text-white mb-1">10k+</h4>
                                <p className="text-gray-500 text-sm">Active Users</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-white mb-1">500+</h4>
                                <p className="text-gray-500 text-sm">Verified Pros</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-white mb-1">24/7</h4>
                                <p className="text-gray-500 text-sm">Support</p>
                            </div>
                        </div>
                    </div>

                    {/* 3D Content */}
                    <div className="h-[400px] lg:h-[600px] relative z-0 flex items-center justify-center">
                        <motion.img
                            src="/hero-new.jpg"
                            alt="Future Commerce 3D Render"
                            className="w-full h-full object-contain drop-shadow-2xl"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        />
                    </div>
                </div>

                {/* Background Glows */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none"></div>
            </section>

            {/* Features/Categories Grid */}
            <section id="categories" className="py-24 px-6 bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Curated Categories</h2>
                        <p className="text-gray-400">Everything you need to build your empire.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {categories.map((cat, index) => (
                            <Link to={cat.link} key={cat.id} className="group relative">
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"
                                    style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} // Fallback generic logic, strictly controlled by class below
                                ></motion.div>
                                <div className={`relative h-full bg-gray-900 border border-gray-800 p-8 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300 group-hover:-translate-y-2`}>
                                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${cat.color} shadow-lg`}>
                                        {cat.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{cat.title}</h3>
                                    <p className="text-gray-400 mb-8">{cat.description}</p>
                                    <div className="flex items-center text-sm font-bold uppercase tracking-wider text-gray-300 group-hover:text-white">
                                        Browse <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>

                                    {/* Decorative circle */}
                                    <div className={`absolute -right-6 -bottom-6 w-32 h-32 bg-gradient-to-br ${cat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-20 border-t border-gray-900 bg-black/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-10">Trusted by modern teams</p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Fake Logos for Demo */}
                        {['Amazon', 'GlobalTech', 'Google', 'Microsoft', 'Trio'].map(name => (
                            <span key={name} className="text-xl font-bold text-white">{name}</span>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
