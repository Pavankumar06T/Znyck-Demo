
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Loader2, AlertCircle, LogIn, Mail } from 'lucide-react';
import api from '../../services/api';
import { useGlobal } from '../../context/GlobalContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Get redirect param
    const query = new URLSearchParams(window.location.search);
    const redirectPath = query.get('redirect');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
                tenantId: response.data.tenantId,
                role: response.data.role,
                plan: response.data.plan
            }));

            if (redirectPath) {
                navigate(redirectPath);
                return;
            }

            navigate('/org/:orgId/app/:appId/dashboard');
        } catch (err) {
            alert(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-slate-900 dark:text-white flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-600 mb-2">
                        ZNYCK
                    </Link>
                    <p className="text-slate-600 dark:text-gray-400">Welcome back! Please login to continue.</p>
                </div>

                <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl border border-slate-200 dark:border-gray-800 rounded-3xl p-8 shadow-2xl transition-all duration-300">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                        <LogIn className="text-indigo-500 dark:text-indigo-400" />
                        Login
                    </h2>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-gray-400 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" size={20} />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-gray-800 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-gray-400 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" size={20} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-gray-800 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <a href="#" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all text-sm uppercase tracking-wide flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Sign In'}
                            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-slate-600 dark:text-gray-500">
                    Don&apos;t have an account? <Link to="/signup" className="text-indigo-600 dark:text-white font-bold hover:underline">Sign up for free</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
