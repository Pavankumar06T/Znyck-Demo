import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Briefcase, ArrowRight, Sparkles, Phone, Globe, CreditCard, Building2, FileText } from 'lucide-react';
import api from '../services/api';

const Signup = () => {
    // Basic Info
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [country, setCountry] = useState('');

    // Business Info
    const [companyName, setCompanyName] = useState('');
    const [website, setWebsite] = useState('');

    // KYC / Payment Gateway Info
    const [panNumber, setPanNumber] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Get redirect param
    const query = new URLSearchParams(window.location.search);
    const redirectPath = query.get('redirect');

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                name,
                email,
                contact,
                password,
                country,
                companyName,
                website,
                panNumber,
                bankDetails: {
                    accountNumber,
                    ifscCode,
                    bankName,
                    accountHolderName: accountHolderName || name
                }
            };

            const response = await api.post('/auth/signup', payload);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
                tenantId: response.data.tenantId,
                role: response.data.role,
                plan: 'free',
                saasType: response.data.saasType
            }));

            if (redirectPath) {
                navigate(redirectPath);
                return;
            }

            navigate('/user-space');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl relative z-10 my-10"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
                        ZNYCK
                    </Link>
                    <p className="text-gray-400">Join the platform powering the future of commerce.</p>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 pb-4 border-b border-gray-800">
                        <Sparkles className="text-yellow-400" />
                        Create Your Account
                    </h2>

                    <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* LEFT COLUMN: Personal & Account */}
                        <div className="space-y-5">
                            <h3 className="text-lg font-semibold text-gray-300">Personal Details</h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="email"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Contact Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="tel"
                                        placeholder="+1 234 567 890"
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Country</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder="United States"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Business & KYC */}
                        <div className="space-y-5">
                            <h3 className="text-lg font-semibold text-gray-300">Business & Financials</h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Company / Workspace Name</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Acme Inc."
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Website Link</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="url"
                                        placeholder="https://znyck.com"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Payment Gateway-like Details */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">PAN Number</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder="ABCDE1234F"
                                        value={panNumber}
                                        onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                                        className="w-full bg-black/50 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none uppercase"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Bank Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder="HDFC Bank"
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 ml-1">Account No.</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            placeholder="1234567890"
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value)}
                                            className="w-full bg-black/50 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 ml-1">IFSC Code</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            placeholder="HDFC0001234"
                                            value={ifscCode}
                                            onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                                            className="w-full bg-black/50 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none uppercase"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button Span Full Width */}
                        <div className="col-span-1 md:col-span-2 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all text-sm uppercase tracking-wide flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Account...' : 'Complete Registration'}
                                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                            </button>

                            <p className="text-center mt-6 text-gray-500">
                                Already have an account? <Link to="/login" className="text-white font-bold hover:underline">Log in</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
