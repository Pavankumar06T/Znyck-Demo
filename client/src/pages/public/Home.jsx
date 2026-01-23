import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ArrowRight, Globe, Shield, Zap, Code2, Layers, CheckCircle,
    Sun, Moon, CheckCircle2, PlayCircle, Lock, LayoutGrid, Terminal, Smartphone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function Home() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden font-sans selection:bg-blue-100 dark:selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-white">

            {/* Background Decorations */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Light Mode Blobs */}
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[100px] opacity-70 mix-blend-multiply dark:opacity-0 transition-opacity duration-500"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-[100px] opacity-70 mix-blend-multiply dark:opacity-0 transition-opacity duration-500"></div>

                {/* Dark Mode Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px] opacity-0 dark:opacity-40 animate-pulse-slow transition-opacity duration-500"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[128px] opacity-0 dark:opacity-40 transition-opacity duration-500"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                <div className="absolute inset-0 dark:hidden" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3 }}></div>
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-3 cursor-pointer group">
                        <div className="w-10 h-10 bg-blue-600 dark:bg-gradient-to-br dark:from-blue-600 dark:to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 dark:shadow-blue-500/20 transition-all duration-300 group-hover:scale-110">
                            <Zap size={22} className="text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white transition-colors">Znyck Pay</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-transparent text-slate-500 hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-white/10 transition-colors focus:outline-none"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        <Link to="/early-access" className="text-sm font-bold text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors hidden sm:block">
                            Sign In
                        </Link>
                        <Link to="/early-access" className="group relative px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold overflow-hidden transition-all hover:bg-blue-700 dark:hover:scale-105 dark:shadow-blue-600/40 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transform hover:-translate-y-0.5">
                            <span className="relative z-10 flex items-center space-x-1">
                                <span>Get Started</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-left"
                    >

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight mb-8 leading-[1.1] text-slate-900 dark:text-white"
                        >
                            Payment infrastructure <br />
                            <span className="text-slate-700 dark:text-slate-300">
                                for the <span className="text-blue-700 dark:text-blue-400">Internet.</span>
                            </span>
                        </motion.h1>

                        <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 max-w-xl mb-10 leading-relaxed font-medium font-sans">
                            Millions of companies of all sizes use Znyck Pay to accept payments, send payouts, and manage their businesses online.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link to="/early-access" className="px-8 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-slate-800 dark:hover:bg-blue-500 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-slate-900/20 dark:shadow-blue-600/25 hover:shadow-slate-900/30 hover:-translate-y-1">
                                <span>Access Znyck Pay</span>
                                <ArrowRight size={20} />
                            </Link>
                            <Link to="/dashboard" className="px-8 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white rounded-full font-bold text-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center justify-center space-x-2 hover:border-slate-300 dark:backdrop-blur-sm">
                                <PlayCircle size={20} />
                                <span>View Demo</span>
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center space-x-6 text-slate-400 text-sm font-semibold">
                            <div className="flex items-center"><CheckCircle2 size={16} className="text-green-500 mr-2" /> No setup fees</div>
                            <div className="flex items-center"><CheckCircle2 size={16} className="text-green-500 mr-2" /> Instant activation</div>
                            <div className="flex items-center"><CheckCircle2 size={16} className="text-green-500 mr-2" /> 24/7 Support</div>
                        </div>
                    </motion.div>

                    {/* Right: Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 30, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                        className="relative h-[600px] hidden lg:flex items-center justify-center perspective-1000"
                    >
                        {/* Decorative Blobs */}
                        <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full blur-[80px] opacity-20 -z-10 animate-pulse-slow"></div>

                        <div className="relative w-full max-w-md" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-12deg) rotateX(5deg)' }}>

                            {/* Card 1: Credit Card */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                className="absolute top-0 left-0 w-full aspect-[1.586/1] rounded-2xl p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl shadow-slate-900/40 border border-white/10 z-20 backdrop-blur-xl"
                            >
                                <div className="flex justify-between items-start mb-12">
                                    <Zap className="text-white" size={32} />
                                    <div className="text-lg font-mono tracking-widest opacity-80">CONTACTLESS</div>
                                </div>
                                <div className="text-2xl font-mono tracking-widest mb-8">2526 2526 2526 2526</div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-xs opacity-60 uppercase mb-1">Card Holder</div>
                                        <div className="font-bold tracking-wide">ZNYCK BUSINESS</div>
                                    </div>
                                    <div>
                                        <div className="text-xs opacity-60 uppercase mb-1">Expires</div>
                                        <div className="font-bold tracking-wide"> 01/30</div>
                                    </div>
                                    <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full bg-red-500/80 -mr-4"></div>
                                        <div className="w-8 h-8 rounded-full bg-yellow-500/80"></div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Card 2: Terminal */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                                className="absolute -right-20 -bottom-32 w-64 bg-white dark:bg-[#1f2937] rounded-[2rem] p-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-black/50 border border-slate-100 dark:border-gray-700 z-30 transition-colors duration-300"
                            >
                                <div className="bg-slate-50 dark:bg-gray-800 rounded-[1.5rem] p-6 h-full flex flex-col items-center justify-between border border-slate-100 dark:border-gray-700 transition-colors duration-300">
                                    <div className="w-full">
                                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 className="text-green-600 dark:text-green-400" size={24} />
                                        </div>
                                        <div className="text-center">
                                            <div className="text-slate-500 dark:text-gray-400 text-sm mb-1">Payment Success</div>
                                            <div className="text-slate-900 dark:text-white font-extrabold text-2xl">$10,420.00</div>
                                        </div>
                                    </div>
                                    <div className="w-full space-y-3 mt-6">
                                        <div className="h-2 w-full bg-slate-200 dark:bg-gray-700 rounded-full"></div>
                                        <div className="h-2 w-2/3 bg-slate-200 dark:bg-gray-700 rounded-full mx-auto"></div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Elements */}
                            <div className="absolute -left-12 top-20 bg-white dark:bg-[#1f2937] p-4 rounded-xl shadow-lg border border-slate-100 dark:border-gray-700 z-40 animate-bounce transition-colors duration-300">
                                <Lock className="text-blue-500" size={24} />
                            </div>
                            <div className="absolute right-10 -top-12 bg-white dark:bg-[#1f2937] p-3 rounded-lg shadow-lg border border-slate-100 dark:border-gray-700 z-10 transition-colors duration-300">
                                <div className="text-xs font-bold text-slate-800 dark:text-white">Verified</div>
                            </div>

                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 relative z-10 bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-blue-600 dark:text-blue-400 font-bold tracking-wide uppercase text-sm mb-4">Features</h2>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">A fully unified platform</h2>
                        <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                            Everything you need to accept payments and grow your business globally.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Globe,
                                title: "Global Scale",
                                desc: "Accept payments from 135+ currencies and automatically handle conversions.",
                                color: "text-blue-600 dark:text-blue-400",
                                bg: "bg-blue-50 dark:bg-blue-500/10",
                            },
                            {
                                icon: Shield,
                                title: "Fraud Protection",
                                desc: "Real-time machine learning fraud prevention to protect your business.",
                                color: "text-purple-600 dark:text-purple-400",
                                bg: "bg-purple-50 dark:bg-purple-500/10",
                            },
                            {
                                icon: LayoutGrid,
                                title: "Developer First",
                                desc: "Powerful APIs and easy-to-use libraries for React, Node, and more.",
                                color: "text-indigo-600 dark:text-green-400",
                                bg: "bg-indigo-50 dark:bg-green-500/10",
                            },
                            {
                                icon: Terminal,
                                title: "Instant Integration",
                                desc: "Pre-built checkout flows and UI components to get you started in minutes.",
                                color: "text-pink-600 dark:text-pink-400",
                                bg: "bg-pink-50 dark:bg-pink-500/10",
                            },
                            {
                                icon: Zap,
                                title: "Fastest Payouts",
                                desc: "Get paid faster with instant payouts to your bank account or debit card.",
                                color: "text-amber-500 dark:text-yellow-400",
                                bg: "bg-amber-50 dark:bg-yellow-500/10",
                            },
                            {
                                icon: Smartphone,
                                title: "Mobile Ready",
                                desc: "Fully optimized for mobile checkouts and Apple/Google Pay integration.",
                                color: "text-teal-600 dark:text-orange-400",
                                bg: "bg-teal-50 dark:bg-orange-500/10",
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-slate-50 dark:bg-[#12141c]/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-100 dark:border-white/5 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:bg-white dark:hover:bg-[#161922]"
                            >
                                <div className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className={`${feature.color}`} size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-base">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
                <div className="max-w-5xl mx-auto bg-blue-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to get started?</h2>
                        <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
                            Create an account in minutes and start accepting payments today. No credit card required.
                        </p>
                        <div className="flex items-center justify-center space-x-4">
                            <Link to="/early-access" className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
                                Create account
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#050505] py-12 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500 dark:text-gray-500 text-sm">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <div className="w-6 h-6 bg-slate-900 dark:bg-blue-600 rounded flex items-center justify-center">
                            <Zap size={14} className="text-white" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">Znyck Pay</span>
                    </div>
                    <p>&copy; {new Date().getFullYear()} Znyck Pay. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
