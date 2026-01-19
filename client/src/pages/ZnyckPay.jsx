import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, User, Mail, Lock, Globe, Phone, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

export default function ZnyckPay() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    // Register Form State
    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        email: '',
        country: '',
        contact: '',
        password: '',
        confirmPassword: ''
    });

    // Login Form State
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleRegisterChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/auth/signup', {
                ...formData,
                role: 'admin',
                companyName: `${formData.nickname || formData.name}'s Space`
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
                tenantId: response.data.tenantId,
                role: response.data.role,
                plan: 'free'
            }));

            navigate('/user-space');

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/login', loginData);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
                tenantId: response.data.tenantId,
                role: response.data.role,
                plan: response.data.plan
            }));

            navigate('/user-space');

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1117] text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-md bg-[#1c1f2e] border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10">
                {/* Back Link */}
                <Link to="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-6 text-sm">
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                </Link>

                {/* Header */}
                <div className="flex items-center space-x-3 mb-8 justify-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Zap size={24} className="text-white" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight">Znyck Pay</span>
                </div>

                {/* TAB SWITCHER */}
                <div className="flex items-center space-x-8 mb-8 border-b border-white/10">
                    <button
                        onClick={() => setIsLogin(true)}
                        className="relative pb-3 px-2 text-base font-medium transition-colors outline-none flex-1 text-center"
                        style={{ color: isLogin ? 'white' : '#6b7280' }}
                    >
                        Sign In
                        {isLogin && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                            />
                        )}
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className="relative pb-3 px-2 text-base font-medium transition-colors outline-none flex-1 text-center"
                        style={{ color: !isLogin ? 'white' : '#6b7280' }}
                    >
                        Sign Up
                        {!isLogin && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                            />
                        )}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {isLogin ? (
                        // LOGIN FORM
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <form onSubmit={handleLoginSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={loginData.email}
                                            onChange={handleLoginChange}
                                            className="w-full bg-[#13141b] border border-[#2d2f3b] rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                            placeholder="name@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                                        <input
                                            type="password"
                                            name="password"
                                            value={loginData.password}
                                            onChange={handleLoginChange}
                                            className="w-full bg-[#13141b] border border-[#2d2f3b] rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Signing In...' : 'Sign In'}
                                    {!loading && <ArrowRight size={18} />}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        // REGISTER FORM
                        <motion.div
                            key="register"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleRegisterChange}
                                            className="w-full bg-[#13141b] border border-[#2d2f3b] rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Nickname</label>
                                        <input
                                            type="text"
                                            name="nickname"
                                            value={formData.nickname}
                                            onChange={handleRegisterChange}
                                            className="w-full bg-[#13141b] border border-[#2d2f3b] rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                            placeholder="Johnny"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Gmail ID</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleRegisterChange}
                                            className="w-full bg-[#13141b] border border-[#2d2f3b] rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                            placeholder="john@gmail.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Country</label>
                                        <div className="relative group">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleRegisterChange}
                                                className="w-full bg-[#13141b] border border-[#2d2f3b] rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                                placeholder="India"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                                            <input
                                                type="tel"
                                                name="contact"
                                                value={formData.contact}
                                                onChange={handleRegisterChange}
                                                className="w-full bg-[#13141b] border border-[#2d2f3b] rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                                placeholder="+91..."
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleRegisterChange}
                                            className="w-full bg-[#13141b] border border-[#2d2f3b] rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Confirm</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleRegisterChange}
                                            className="w-full bg-[#13141b] border border-[#2d2f3b] rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                    {!loading && <ArrowRight size={18} />}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
