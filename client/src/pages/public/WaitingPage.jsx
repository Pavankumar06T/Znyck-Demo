import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Star, ShieldCheck, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function WaitingPage() {
    const { theme } = useTheme();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors duration-300 flex flex-col items-center justify-center relative overflow-hidden font-sans">

            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[100px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-2xl px-6 text-center"
            >
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
                    <Star size={14} className="fill-current" />
                    <span>Early Access</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400">
                    We're rolling out gradually.
                </h1>

                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto">
                    Znyck Pay is moving to production. Join the queue to get early access and secure your spot in the future of payments.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link
                        to="/signup"
                        className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-1 flex items-center justify-center space-x-2"
                    >
                        <span>Get Early Access</span>
                        <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-slate-500 dark:text-slate-500 text-sm font-medium">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="p-2 bg-white dark:bg-white/5 rounded-lg shadow-sm border border-slate-200 dark:border-white/5">
                            <ShieldCheck size={20} className="text-green-500" />
                        </div>
                        <span>Secure & Encrypted</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <div className="p-2 bg-white dark:bg-white/5 rounded-lg shadow-sm border border-slate-200 dark:border-white/5">
                            <Zap size={20} className="text-amber-500" />
                        </div>
                        <span>Instant Activation</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <div className="p-2 bg-white dark:bg-white/5 rounded-lg shadow-sm border border-slate-200 dark:border-white/5">
                            <Clock size={20} className="text-blue-500" />
                        </div>
                        <span>24/7 Priority Support</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
