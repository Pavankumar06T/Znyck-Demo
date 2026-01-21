import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchTransactions } from '../services/api';
import {
    RefreshCw, Filter, TrendingUp, TrendingDown,
    DollarSign, CreditCard, Users, Activity,
    Download, Calendar
} from 'lucide-react';

const MetricCard = ({ title, value, change, trend, icon: Icon }) => (
    <div className="bg-white dark:bg-[#1c1f2e] border border-slate-200 dark:border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-sm dark:shadow-none">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                <Icon size={24} />
            </div>
            {trend && (
                <div className={`flex items-center space-x-1 text-sm font-medium ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                    {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span>{change}</span>
                </div>
            )}
        </div>
        <h3 className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>

        {/* Background Decoration */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
    </div>
);

export default function UserSpace() {
    const [transactions, setTransactions] = useState([]);
    const [user, setUser] = useState(null);
    const [org, setOrg] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadData = async () => {
        setLoading(true);
        try {
            // Fetch Transactions
            const txData = await fetchTransactions();
            setTransactions(txData);

            // Fetch User Profile
            const token = localStorage.getItem('token');
            if (token) {
                const res = await fetch('http://localhost:5000/api/v1/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const userData = await res.json();
                if (userData.user) setUser(userData.user);
                if (userData.organization) setOrg(userData.organization);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Calculate Metrics (Mock/Derived)
    const totalVolume = transactions.reduce((acc, tx) => acc + (tx.amount / 100), 0);
    const successCount = transactions.filter(tx => tx.status === 'succeeded').length;

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">

            {/* Content Area */}

            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Today</h1>
                    <p className="text-slate-500 dark:text-gray-500 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Live Platform Data
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <Calendar size={16} />
                        <span>Last 7 Days</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20">
                        <Download size={16} />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Gross Volume"
                    value={`₹${totalVolume.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                    change="+12.5%"
                    trend="up"
                    icon={DollarSign}
                />
                <MetricCard
                    title="Net Revenue"
                    value={`₹${(totalVolume * 0.95).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                    change="+8.2%"
                    trend="up"
                    icon={Activity}
                />
                <MetricCard
                    title="New Customers"
                    value={transactions.length}
                    change="+2"
                    trend="up"
                    icon={Users}
                />
                <MetricCard
                    title="Successful Payments"
                    value={successCount}
                    change="-2.1%"
                    trend="down"
                    icon={CreditCard}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Transactions Section (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-[#1c1f2e] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden min-h-[500px] shadow-sm dark:shadow-none transition-colors duration-300">
                        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Transactions</h3>
                            <div className="flex space-x-2">
                                <button onClick={loadData} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-gray-400 transition-colors">
                                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                                </button>
                                <button className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-gray-400 transition-colors">
                                    <Filter size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-slate-500 dark:text-gray-500 text-xs uppercase font-semibold">
                                    <tr className="border-b border-slate-200 dark:border-white/5">
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {loading ? (
                                        <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500 dark:text-gray-500">Loading live data...</td></tr>
                                    ) : transactions.length === 0 ? (
                                        <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500 dark:text-gray-500">No transactions recorded yet.</td></tr>
                                    ) : (
                                        transactions.slice(0, 8).map((tx) => (
                                            <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-2 h-2 rounded-full ${tx.status === 'succeeded' ? 'bg-green-500' :
                                                            tx.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`} />
                                                        <span className="text-sm font-medium text-slate-700 dark:text-white capitalize">{tx.status}</span>
                                                    </div>
                                                    <div className="text-xs text-slate-400 dark:text-gray-500 ml-5 font-mono mt-1">{tx._id.slice(-8)}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900 dark:text-white">
                                                        {tx.currency} {(tx.amount / 100).toFixed(2)}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-gray-500 mt-1 capitalize">{tx.gateway?.provider}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-slate-600 dark:text-gray-300">{tx.customer?.email || 'guest@user.com'}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-gray-500">
                                                    {new Date(tx.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {transactions.length > 8 && (
                            <div className="p-4 border-t border-slate-200 dark:border-white/5 text-center">
                                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium pb-1 border-b border-dashed border-blue-400/50">
                                    View All Transactions
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Activity Feed (1/3 width) */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#1c1f2e] border border-slate-200 dark:border-white/10 rounded-xl p-6 h-full shadow-sm dark:shadow-none transition-colors duration-300">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                            <Users size={20} className="text-blue-500" />
                            Your Profile
                        </h3>

                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mb-3 ring-4 ring-white dark:ring-[#0f1117] shadow-xl text-white">
                                {user ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white">{user ? user.name : 'User'}</h4>
                            <p className="text-sm text-slate-500 dark:text-gray-500">{user ? user.email : 'user@example.com'}</p>
                            <div className="mt-2 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium border border-blue-200 dark:border-blue-500/20 capitalize">
                                {user ? user.role : 'Member'}
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-slate-200 dark:border-white/5 pt-6">
                            <div>
                                <label className="text-xs text-slate-400 dark:text-gray-500 uppercase font-semibold">Organization</label>
                                <div className="text-slate-700 dark:text-gray-300 font-medium mt-1">{org ? org.name : 'My Organization'}</div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 dark:text-gray-500 uppercase font-semibold">Location</label>
                                <div className="text-slate-700 dark:text-gray-300 font-medium mt-1">{user ? user.country : 'Unknown'}</div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 dark:text-gray-500 uppercase font-semibold">Member Since</label>
                                <div className="text-slate-700 dark:text-gray-300 font-medium mt-1">
                                    {user ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '-'}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/user-space/settings')}
                            className="w-full mt-8 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            Edit Profile
                        </button>
                    </div>

                    {/* Promo / Upsell / Status */}
                    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">Setup Guide</h4>
                        <p className="text-sm text-slate-600 dark:text-gray-400 mb-4">Complete your account setup to enable international payments.</p>
                        <div className="w-full bg-slate-200 dark:bg-white/5 rounded-full h-2 mb-4">
                            <div className="bg-blue-500 h-2 rounded-full w-3/4" />
                        </div>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">75% Complete</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Temporary Mock Data Generation for the Activity Feed (Or keep it static as shown)
