import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Globe, Zap, ArrowRight, LayoutGrid, Terminal } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#0f1117] text-white overflow-hidden selection:bg-blue-500/30">

            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Zap size={20} className="text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">Znyck Pay</span>
                </div>
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
                    <a href="#" className="hover:text-white transition-colors">Products</a>
                    <a href="#" className="hover:text-white transition-colors">Developers</a>
                    <a href="#" className="hover:text-white transition-colors">Pricing</a>
                </div>
                <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white">Sign In</Link>
                    <Link to="/dashboard" className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                        Dashboard
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-8">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-xs font-medium text-gray-300">v2.0 Now Available</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                        Payments infrastructure <br />
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">for the internet</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Millions of companies of all sizes—from startups to Fortune 500s—use
                        Znyck Pay to accept payments, send payouts, and manage their businesses online.
                    </p>

                    <div className="flex items-center justify-center space-x-4">
                        <Link to="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-500 transition-all flex items-center space-x-2 shadow-lg shadow-blue-600/20">
                            <span>Start now</span>
                            <ArrowRight size={20} />
                        </Link>
                        <Link to="/demo" className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center space-x-2">
                            <Terminal size={20} />
                            <span>View Demo</span>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-black/20 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-[#1c1f2e] p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                                <Globe className="text-blue-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Global Reach</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Accept payments from 135+ countries. We handle the complex routing so you don't have to logic between Stripe and Razorpay.
                            </p>
                        </div>

                        <div className="bg-[#1c1f2e] p-8 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                                <Shield className="text-purple-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Fraud Protection</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Radar for Fraud Teams helps detect and block fraud using machine learning trained on data across millions of global companies.
                            </p>
                        </div>

                        <div className="bg-[#1c1f2e] p-8 rounded-2xl border border-white/5 hover:border-green-500/30 transition-all group">
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                                <LayoutGrid className="text-green-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Developer First</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Powerful, easy-to-use APIs. We provide client libraries for React, Node, Python, and more to get you started in minutes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
